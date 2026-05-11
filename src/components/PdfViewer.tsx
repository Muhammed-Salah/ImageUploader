"use client";

import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import styles from './PdfViewer.module.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set([1]));
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  // Resize handler
  useEffect(() => {
    const updateDimensions = () => {
      setContainerWidth(window.innerWidth);
      setContainerHeight(window.innerHeight);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    // Start background rendering after initial page is shown
    setTimeout(() => {
      setRenderedPages(prev => {
        const nextSet = new Set(prev);
        for (let i = 1; i <= numPages; i++) {
          nextSet.add(i);
        }
        return nextSet;
      });
    }, 1000);
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const next = prevPageNumber + offset;
      return Math.min(Math.max(1, next), numPages);
    });
  };

  const previousPage = useCallback(() => changePage(-1), [numPages]);
  const nextPage = useCallback(() => changePage(1), [numPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        previousPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, previousPage]);

  return (
    <div className={styles.container}>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} size={32} />
            <p>Preparing Slides...</p>
          </div>
        }
      >
        {Array.from(renderedPages).map((p) => (
          <div
            key={p}
            data-active={p === pageNumber}
            className={styles.pageWrapper}
          >
            <Page
              pageNumber={p}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={containerWidth}
              height={containerHeight}
              className={styles.page}
              loading={
                <div className={styles.pageLoading}>
                  <Loader2 className={styles.spinner} size={24} />
                </div>
              }
            />
          </div>
        ))}
      </Document>

      {numPages > 1 && (
        <div className={styles.toolbar}>
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className={styles.navButton}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className={styles.pageInfo}>
            <span>{pageNumber}</span> / <span>{numPages}</span>
          </div>

          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className={styles.navButton}
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
