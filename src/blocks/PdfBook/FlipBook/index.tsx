'use client'

import React, { useState } from 'react'
import './styles.css'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { HTMLFlipBook } from './Flip'
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

const FlipBook: React.FC<{ document: string; width: number; height: number }> = function FlipBook({
  document,
  width,
  height,
}) {
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
      <div className="h-full flex flex-col justify-center items-center scroll-mx-2 py-20 overflow-hidden">
        <HTMLFlipBook
          key={`${width}-${height}`}
          width={width || 300}
          height={height || 200}
          showCover={true}
          className="flip-book"
          size="fixed"
          maxShadowOpacity={0.5}
        >
          {[...Array(numPages).keys()].map((n) => (
            <Pages key={'page-' + n} number={`${n + 1}`}>
              <Document file={document} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                  pageNumber={n + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={width || 300}
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
