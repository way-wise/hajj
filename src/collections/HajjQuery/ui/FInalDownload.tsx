'use client'

import { Button } from '@payloadcms/ui'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f0f9ff',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '10px',
  },
  logo: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
  },
  companyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  companyCode: {
    color: '#666',
  },
  subtitle: {
    color: '#dc2626',
    fontSize: '14px',
  },
  mainTitle: {
    backgroundColor: '#000',
    color: '#ffd700',
    padding: '10px',
    textAlign: 'center',
    fontSize: '24px',
    margin: '20px 0',
  },
  packageContent: {
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  greeting: {
    marginBottom: '20px',
    color: '#333',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    margin: '20px 0',
  },
  infoItem: {
    marginBottom: '15px',
  },
  label: {
    color: '#666',
    fontSize: '14px',
    display: 'block',
    marginBottom: '5px',
  },
  value: {
    margin: '5px 0',
    fontWeight: 'bold',
  },
  grandTotal: {
    marginTop: '20px',
    paddingTop: '10px',
    borderTop: '2px solid #333',
  },
  grandTotalValue: {
    fontSize: '24px',
    color: '#dc2626',
    fontWeight: 'bold',
  },
  notesList: {
    listStyle: 'none',
    padding: '0',
    margin: '20px 0',
  },
  noteItem: {
    margin: '5px 0',
    paddingLeft: '20px',
    position: 'relative' as const,
  },
  noteBullet: {
    position: 'absolute' as const,
    left: '0',
    color: '#dc2626',
  },
  footer: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #ccc',
  },
  validity: {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '10px',
  },
  contactInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '10px',
    fontSize: '14px',
    color: '#666',
  },
  downloadButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '1rem',
  },
}

const FinalDownload = ({ data }: { data: any }) => {
  return (
    <>
      <div id="hajjQueryView" style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img src="/way-wise-logo.png" alt="Way Wise" style={styles.logo} />
            <img src="/muqaddas-logo.png" alt="Muqaddas" style={styles.logo} />
          </div>
          <h1 style={styles.companyTitle}>
            Way Wise <span style={styles.companyCode}>188.52 • 65.39</span> Muqaddas
          </h1>
          <p style={styles.subtitle}>An American and Bangladesh Joint Venture</p>
        </div>

        <h2 style={styles.mainTitle}>Customized Umrah Package</h2>

        <div style={styles.packageContent}>
          <div style={styles.greeting}>
            <p>Dear Mr/Mrs {data?.title || 'Kabir'},</p>
            <p>
              Thanks for your interest. We received your information and prepared a customised
              Umrah Package for you.
            </p>
          </div>

          <div style={styles.infoGrid}>
            <div>
              <h3>Your Information</h3>
              <div style={styles.infoItem}>
                <label style={styles.label}>Name</label>
                <p style={styles.value}>{data?.title || 'Demo text entry'}</p>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.label}>Proposed time of Umrah</label>
                <p style={styles.value}>{data?.date || 'Demo text entry'}</p>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.label}>Umrah duration</label>
                <p style={styles.value}>{'Demo text entry'}</p>
              </div>
            </div>

            <div>
              <h3>Pricing</h3>
              <div style={styles.infoItem}>
                <label style={styles.label}>Total estimated cost of package</label>
                <p style={styles.value}>10000000</p>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.label}>Waywise service charge</label>
                <p style={styles.value}>10000</p>
              </div>
              <div style={styles.grandTotal}>
                <label style={styles.label}>Grand Total</label>
                <p style={styles.grandTotalValue}>10000000</p>
              </div>
            </div>
          </div>

          <ul style={styles.notesList}>
            <li style={styles.noteItem}>
              <span style={styles.noteBullet}>•</span> Food not included
            </li>
            <li style={styles.noteItem}>
              <span style={styles.noteBullet}>•</span> All Jiara in Makkah & Madina Included
            </li>
            <li style={styles.noteItem}>
              <span style={styles.noteBullet}>•</span> All time qualified tour guide/Muallem
            </li>
            <li style={styles.noteItem}>
              <span style={styles.noteBullet}>•</span> Visa & all type of registration cost included
            </li>
          </ul>

          <div style={styles.footer}>
            <p style={styles.validity}>
              This estimated package will be valid for 24 hours. Price may increase later.
            </p>
            <div style={styles.contactInfo}>
              <span>📍 Mohakhali DOHS, Dhaka</span>
              <span>📞 +880 123456789</span>
              <span>🌐 www.waywiseislam.com</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.downloadButton}>
        <Button
          onClick={() => {
            const capture = document.querySelector('#hajjQueryView')
            if (capture) {
              html2canvas(capture as HTMLElement).then((canvas) => {
                const imgData = canvas.toDataURL('img/png')
                const doc = new jsPDF('p', 'mm', 'a4')
                const componentWidth = doc.internal.pageSize.getWidth()
                const componentHeight = doc.internal.pageSize.getHeight()
                doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight)
                doc.save('umrah-package.pdf')
              })
            }
          }}
        >
          Download Package
        </Button>
      </div>
    </>
  )
}

export default FinalDownload
