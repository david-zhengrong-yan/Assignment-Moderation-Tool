import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  PaginationItem,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { DownloadIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// Set worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Full PDF Viewer Component
function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Responsive width
  React.useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 250, 800); // navbar + padding accounted
      setContainerWidth(width);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: 2,
        overflowY: "auto",
        maxHeight: 600,
        p: 1,
        mb: 1,
      }}
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={containerWidth}
          />
        ))}
      </Document>
    </Box>
  );
}

const CriteriaCard = ({ criteria }) => {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  return (
    <Box sx={{ mb: 4, mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {criteria.index}. {criteria.title}
      </Typography>
      <Pagination page={page} onChange={handleChange} shape="rounded" variant="outlined" sx={{ width: '100%' }} count={criteria.items.length} color="primary" renderItem={(item) => {
        item.page = '';
        if (item.selected) {
          item.page = "√";
        }
        return <PaginationItem sx={{ flex: 1 }} {...item} />;
      }} />
      <div style={{display: 'flex'}}>
        <Typography variant="h6" sx={{ flex: 1, mb: 2, color: '#66CCFF' }}>
          {criteria.items[page - 1].level}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, color: '#66CCFF' }}>
          {criteria.items[page - 1].mark} / {criteria.totalMark}
        </Typography>
      </div>

      <p>
        {criteria.items[page - 1].description}
      </p>
    </Box>
  )
}

export default function MarkingPage() {
  const [criterias, setCriterias] = useState([
    {
      index: 1, title: 'Introduction: Applies...',
      totalMark: 15,
      items: [{ level: "High Distinction", description: "Text Here", mark: 15 },
      { level: "2", description: "Text Here", mark: 11 },
      { level: "3", description: "Text Here", mark: 8 },
      { level: "4", description: "Text Here", mark: 4 },
      { level: "5", description: "Text Here", mark: 2 }
      ]
    },
    {
      index: 2, title: 'Introduction: Locates....',
      totalMark: 10,
      items: [{ level: "High Distinction", description: "Text Here", mark: 10 },
      { level: "2", description: "Text Here", mark: 8 },
      { level: "3", description: "Text Here", mark: 4 },
      { level: "4", description: "Text Here", mark: 6 },
      { level: "5", description: "Text Here", mark: 2 }
      ]
    },
  ]);

  const navbarWidth = 200;


  const assignmentFile = "sample.pdf";

  const renderFileViewer = (file) => {
    if (file.endsWith(".pdf")) {
      return <PDFViewer file={file} />;
    } else if (file.match(/\.(jpg|jpeg|png|gif)$/)) {
      return <img src={file} alt="file preview" style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 4 }} />;
    } else {
      return <Typography>Preview not available</Typography>;
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: `${navbarWidth}px`,
            p: 4,
            bgcolor: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            Submission Name
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <div style={{ width: '50%' }}>
              {renderFileViewer(assignmentFile)}
            </div>
            <div style={{ width: '50%' }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Criteria
              </Typography>
              {
                criterias.map(criteria => {
                  return (
                    <CriteriaCard criteria={criteria} key={criteria.index} />
                  )
                })
              }
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button variant="contained">
                  Go Back
                </Button>
                <Button variant="contained">
                  Submit
                </Button>
              </Box>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
