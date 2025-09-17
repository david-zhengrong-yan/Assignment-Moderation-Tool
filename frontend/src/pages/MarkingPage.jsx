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

export default function MarkingPage() {
  const [questions, setQuestions] = useState([
    { index: 1, question: 'Question1', fullMark: 5, getMark: 3 },
    { index: 1, question: 'Question2', fullMark: 7, getMark: 4 },
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
              <Box sx={{ display: "flex", gap: 1, mb: 2, justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ mb: 2, width: '33%', textAlign: 'center' }}>
                  Question
                </Typography>
                <Typography variant="h5" sx={{ mb: 2, width: '33%', textAlign: 'center' }}>
                  Full mark
                </Typography>
                <Typography variant="h5" sx={{ mb: 2, width: '33%', textAlign: 'center' }}>
                  Your mark
                </Typography>
              </Box>
              {
                questions.map(question => {
                  return (
                    <Box key={question.index} sx={{ display: "flex", gap: 1, mb: 2, justifyContent: 'center' }}>
                      <div style={{ background: '#E5E5E5', borderRadius: '4px', width: '33%', textAlign: 'center' }}>
                        {question.question}
                      </div>
                      <div style={{ background: '#E5E5E5', borderRadius: '4px', width: '33%', textAlign: 'center' }}>
                        {question.fullMark}
                      </div>
                      <div style={{ background: '#E5E5E5', borderRadius: '4px', width: '33%', textAlign: 'center' }}>
                        {question.getMark}
                      </div>
                    </Box>
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
