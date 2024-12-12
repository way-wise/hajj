'use client'

import React, { useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import './styles.css'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
// import pdf from './ByteBeatJan2024.pdf'
// import Loading from "./Loading";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`

interface PagesProps {
  children: React.ReactNode
  number: string
}

const Pages = React.forwardRef<HTMLDivElement, PagesProps>((props, ref) => {
  return (
    <div className="pdf-page" ref={ref}>
      <div>{props.children}</div>
      <div>Page number: {props.number}</div>
    </div>
  )
})
Pages.displayName = 'Pages'

const FlipBook: React.FC<{ document: string, width: number, height: number }> = function FlipBook({ document, width, height }) {
  // const [loading, setLoading] = useState(true);

  const [numPages, setNumPages] = useState(null)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    //   setTimeout(()=>{

    //       setLoading(false);
    //   },1000)
  }
  return (
    <>
      {/* {loading && <Loading loading = {loading} />} */}
      <div className="bg-gray-50 h-full flex flex-col justify-start items-center md:justify-center scroll-mx-2 overflow-hidden">
        <HTMLFlipBook
          width={width || 300}
          height={height || 200}
          showCover={true}
          className="demo-book"
          style={{}}
          startPage={0}
          size="fixed"
          minWidth={width || 300}
          maxWidth={1000}
          minHeight={height || 200}
          maxHeight={1533}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showPageCorners={true}
          disableFlipByClick={false}
          swipeDistance={0}
          clickEventForward={true}
          useMouseEvents={true}
          mobileScrollSupport={true}
        >
          {[...Array(numPages).keys()].map((n) => (
            <Pages key={'page-' + n} number={`${n + 1}`}>
              <Document file={document} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                  pageNumber={n + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={width || 300}
                  className="border-3 border-black"
                />
              </Document>
            </Pages>
          ))}
        </HTMLFlipBook>
      </div>
    </>
  )
}

export default FlipBook
