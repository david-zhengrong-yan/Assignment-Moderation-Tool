// Convert a .docx to HTML in the browser via Mammoth, then parse the rubric table.
// Result shape:
// {
//   levels: [{id, name}, ...],
//   criteria: [{
//     id, title,
//     maxScore?: number,
//     requireComment: boolean,
//     cells: [{ description, min?: number, max?: number }, ...] // aligned to levels
//   }]
// }

import * as mammoth from "mammoth/mammoth.browser";

/** Convert a DOCX file to rubric JSON */
export async function parseDocxToRubric(file) {
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
  return parseHtmlRubric(html);
}

/** Parse HTML tables to rubric JSON { levels, criteria } */
export function parseHtmlRubric(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const tables = Array.from(doc.querySelectorAll("table"));
  if (!tables.length) throw new Error("No table found in the document.");

  // Pick the most likely rubric-looking table by header keywords
  let best = null;
  let bestScore = -1;
  for (const t of tables) {
    const ths = Array.from(t.querySelectorAll("tr:first-child > *"));
    const headers = ths.map((c) => norm(c.textContent));
    const score =
      (headers.some((h) => /criteria|criterion/.test(h)) ? 2 : 0) +
      (headers.some((h) => /distinction|credit|pass|fail|high/.test(h)) ? 3 : 0) +
      headers.length / 10;
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  if (!best) best = tables[0];

  const rows = Array.from(best.querySelectorAll("tr"));
  if (rows.length < 2) throw new Error("Rubric table needs a header and at least one row.");

  // Header: first col is "Criteria", remaining are performance levels
  const headerCells = Array.from(rows[0].children);
  const levels = headerCells.slice(1).map((_, i) => ({
    id: `L${i + 1}`,
    name: strip(headerCells[i + 1]?.textContent || `Level ${i + 1}`),
  }));

  // Body rows: each is a criterion
  const criteria = rows.slice(1).map((tr, rIdx) => {
    const tds = Array.from(tr.children);
    const title = strip(tds[0]?.textContent || `Criterion ${rIdx + 1}`);

    const cells = tds.slice(1).map((td) => {
      const text = strip(td.textContent || "");
      const { min, max } = extractRange(text);
      return { description: text, min, max };
    });

    while (cells.length < levels.length) cells.push({ description: "" });

    // Derive a maxScore if detectable from any "(x – y points)"
    const maxes = cells.map((c) => c.max).filter((v) => typeof v === "number");
    const derivedMax = maxes.length ? Math.max(...maxes) : undefined;

    return {
      id: `C${rIdx + 1}`,
      title,
      cells,
      maxScore: derivedMax,
      requireComment: true, // default on (can be toggled in editor)
    };
  });

  return { levels, criteria };
}

/** Extract "(x – y points)" / "x - y points" / "x points" */
export function extractRange(text) {
  const t = text.replace(/\s+/g, " ");
  let m = t.match(/\((\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*points?\)/i);
  if (m) return { min: +m[1], max: +m[2] };
  m = t.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*points?/i);
  if (m) return { min: +m[1], max: +m[2] };
  m = t.match(/(\d+(?:\.\d+)?)\s*points?/i);
  if (m) return { min: +m[1], max: +m[1] };
  return {};
}

const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const strip = (s) => (s || "").replace(/\s*\n+\s*/g, " ").replace(/\s{2,}/g, " ").trim();
