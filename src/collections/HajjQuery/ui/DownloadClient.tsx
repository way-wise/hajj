/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@payloadcms/ui'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DownloadClient = ({ data }: { data: any }) => {
  function getFileName() {
    const package_type = data?.package_type || 'Hajj'
    let str = data?.name || 'user'
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
             .replace(/\s+/g, '-') // replace spaces with hyphens
             .replace(/-+/g, '-'); // remove consecutive hyphens
    return `${str}_${package_type}`;
  }
  return (
    <div
      style={{
        marginTop: '30px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: '40px',
        justifyContent: 'center',
      }}
    >
      <div className="download-button">
        <Button
          className="btn1"
          onClick={() => {
            const capture = document.getElementById('hajjQueryView')
            if (capture) {
              html2canvas(capture as HTMLElement).then((canvas) => {
                let uri = canvas.toDataURL()
                let filename = `${getFileName()}.png`
                var link = document.createElement('a')
                if (typeof link.download === 'string') {
                  link.href = uri
                  link.download = filename
                  //Firefox requires the link to be in the body
                  document.body.appendChild(link)
                  //simulate click
                  link.click()
                  //remove the link when done
                  document.body.removeChild(link)
                } else {
                  window.open(uri)
                }
              })
            }
          }}
        >
          Download Image
        </Button>
        <Button
          className="btn2"
          onClick={() => {
            const capture = document.getElementById('hajjQueryView')
            if (capture) {
              html2canvas(capture as HTMLElement).then((canvas) => {
                const imgData = canvas.toDataURL('img/png')
                const doc = new jsPDF('p', 'mm', 'a4')
                const componentWidth = doc.internal.pageSize.getWidth()
                const componentHeight = doc.internal.pageSize.getHeight()
                doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight)
                doc.save(`${getFileName()}.pdf`)
              })
            }
          }}
        >
          Download PDF
        </Button>
      </div>
      <div style={{ height: 'calc(100vh - 190px)', overflowY: 'auto', flexBasis: '1' }}>
        <div id="hajjQueryView" className="package-container">
          <div className="header">
            <div className="logo-container">
              <img src="/assets/waywise-islam-logo.png" alt="Way Wise" className="logo" />
              <div className="company-info">
                <h1 className="company-name">Way Wise Islam & Al Muqaddas</h1>
                <div className="subtitle">
                  <span>An American and Bangladeshi Joint Venture</span>
                </div>
              </div>
              <img src="/assets/mukaddas-logo.png" alt="Muqaddas" className="logo" />
            </div>
            <h1 className="main-title">Customized {data?.package_type} Package</h1>
          </div>

          <div className="package-content">
            <div className="greeting">
              <p className="red-heading">
                Dear {data?.salutation} {data?.name},
              </p>
              <p style={{ lineHeight: '24px' }}>
                Thanks for your Interest. We recieved your information and prepared a customised
                <br />
                <span className="red-heading">{data?.package_type}</span> Package for you.
              </p>
            </div>

            <h3
              className="main-title"
              style={{
                marginBottom: '35px',
                fontSize: '28px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Your <span style={{ color: '#bb303b' }}>{data?.package_name}</span> Package Includes:
            </h3>
            <div className="package-grid">
              <div className="left-section">
                <div className="info-list">
                  <div className="info-item">
                    <span className="label">Package proposed date:</span>
                    <span className="value">
                      {data?.proposed_date
                        ? new Date(data?.proposed_date).toLocaleString('en-GB', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : ''}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Proposed time of Umrah:</span>
                    <span className="value">{data?.proposed_time}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Umrah duration:</span>
                    <span className="value">
                      Makkah {data?.makka_duration} days, Madina {data?.madina_duration} days
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Flight preference:</span>
                    <span className="value">{data?.flight_reference}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Occupancy type in hotel room:</span>
                    <span className="value">{data?.occupancy_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Hotel type & distance in Makkah:</span>
                    <span className="value">{data?.makka_hotel_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Hotel type & distance in Madina:</span>
                    <span className="value">{data?.madina_hotel_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Transport Service:</span>
                    <span className="value">{data?.transport_service}</span>
                  </div>
                </div>
              </div>

              <div className="right-section">
                <div
                  style={{
                    background: '#ffe0e0',
                    padding: '20px 15px 30px 15px',
                    borderRadius: '10px',
                  }}
                >
                  <h3
                    style={{
                      color: '#222222',
                      marginBottom: '30px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    Pricing
                  </h3>
                  <div className="pricing-list">
                    <div className="price-item">
                      <span className="label">Total estimated cost:</span>
                      <span className="amount">{data?.total_cost_of_package}</span>
                    </div>
                    <div className="price-item">
                      <span className="label">Waywise service charge:</span>
                      <span className="amount">{data?.waywise_service_fee}</span>
                    </div>
                    <div
                      className="price-item grand-total"
                      style={{
                        paddingTop: '20px',
                        marginTop: '3px',
                        borderTop: '1px solid #999999',
                      }}
                    >
                      <span className="label" style={{ fontSize: '20px', fontWeight: '900' }}>
                        Grand Total:
                      </span>
                      <span className="amount-big">{data?.grand_total}</span>
                    </div>
                  </div>
                </div>

                <div className="package-notes">
                  <ul>
                    <li>All Jiara in Makkah & Madina included</li>
                    <li>Qualified tour guide/Muallem included</li>
                    <li>Visa & all type of registration cost included</li>
                    <li>Taif and Jeddah visit not included</li>
                    <li>Food {data?.is_food_included ? '' : 'not'} included</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="footer">
            <div className="validity">This estimated package will be valid for 24 hours.</div>
            <div className="contact-info">
              <span style={{ width: '40%', flexBasis: 'min-content' }}>
                <img src="/assets/home.png" className="icon" alt="homeIcon" /> House: B/148(5th
                Floor), <br /> Road: 22, Mohakhali, Dhaka- 1212
              </span>
              <span style={{ width: '30%' }}>
                <img src="/assets/phone.png" className="icon" alt="phoneIcon" /> +880 1748 771945
              </span>
              <span style={{ width: '30%' }}>
                <img src="/assets/glob.png" className="icon" alt="globIcon" /> www.waywiseislam.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadClient
