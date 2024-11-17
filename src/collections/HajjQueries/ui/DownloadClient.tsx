/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@payloadcms/ui'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DownloadClient = ({ data, showButton = true }: { data: any; showButton: boolean }) => {
  function getFileName() {
    const package_type = data?.package_type || 'Hajj'
    let str = data?.name || 'user'
    str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
    str = str.toLowerCase() // convert string to lowercase
    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-') // remove consecutive hyphens
    return `${str}_${package_type}`
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
      {showButton && (
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
      )}
      <div style={{ height: 'calc(100vh - 190px)', overflowY: 'auto', flexBasis: '1' }}>
        <div id="hajjQueryView" className="package-container">
          <div className="header">
            <div className="logo-container">
              <img src="/assets/waywise-islam-logo.png" alt="Way Wise" className="logo" />
              <div className="company-info">
                <span className="company-name">Way Wise Islam & Al Muqaddas</span>
                <div className="subtitle">
                  <span>An American and Bangladeshi Joint Venture</span>
                </div>
              </div>
              <img src="/assets/mukaddas-logo.png" alt="Muqaddas" className="logo" />
            </div>
            <span className="main-title">Customized {data?.package_type} Package</span>
            <div
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '5px'
              }}
            >
              <span>Client Name : {data?.name}</span>
              &nbsp; &nbsp; &nbsp;
              <span>Client Mobile : {data?.mobile}</span>
            </div>
          </div>

          <div className="package-content">
            <div className="greeting">
              <p className="red-heading">
                Dear {data?.salutation} {data?.name},
              </p>
              <p style={{ lineHeight: '24px' }}>
                Thank you for your Interest. We recieved your information and prepared a customized
                <br />
                <span className="red-heading">{data?.package_type}</span> Package for you.
              </p>
            </div>

            <span
              className="main-title"
              style={{
                marginBottom: '25px',
                fontSize: '28px',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'block'
              }}
            >
              Your <span style={{ color: '#bb303b' }}>{data?.package_name}</span> Package Includes:
            </span>
            <div className="package-grid">
              <div className="left-section">
                <div className="info-list">
                  <div className="info-item">
                    <span className="label">Departure Date from Dhaka:</span>
                    <span className="value">
                      {data?.proposed_date
                        ? new Date(data?.proposed_date).toLocaleString('en-GB', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Proposed time of {data?.package_type}:</span>
                    <span className="value">{data?.proposed_time}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">{data?.package_type} duration by City:</span>
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
                    padding: '20px 15px 20px 15px',
                    borderRadius: '10px',
                  }}
                >
                  <span
                    style={{
                      color: '#222222',
                      marginBottom: '20px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      display: 'block',
                      textTransform: 'uppercase',
                    }}
                  >
                    Pricing
                  </span>
                  <div className="pricing-list">
                    <div className="price-item">
                      <span className="label">Total estimated cost:</span>
                      <span className="amount">{data?.total_cost_of_package}</span>
                    </div>
                    <div className="price-item">
                      <span className="label">Waywise service charge:</span>
                      <span className="amount">{data?.waywise_service_fee}</span>
                    </div>
                    {data?.discount && data?.discount > 0 ? (
                      <div className="price-item">
                        <span className="label">Discount:</span>
                        <span className="amount">- {data?.discount}</span>
                      </div>
                    ) : (
                      ''
                    )}
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
                      <span style={{display:'flex', flexDirection: 'column', alignItems: 'end', gap: '5px'}}>
                        <span className="amount-big">{data?.grand_total}</span>
                        <span style={{fontSize: '15px'}}>(Per Person)</span>
                      </span>
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
                <div
                  style={{
                    background: '#003CFF',
                    marginTop: '20px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ background: '#FFB519', padding: '10px 0', textAlign: 'center' }}>
                    <span style={{ fontSize: '23px', fontWeight: 'bold', display: 'block' }}>Our other Businesses</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '10px 15px',
                      color: '#ffffff',
                      fontWeight: '500',
                      fontSize: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>•</span>Digital
                        Marketing
                      </span>
                      <span style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>•</span>Residential
                        Construction
                      </span>
                      <span style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>•</span>Export -
                        Import & Marketplace
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>•</span>Software & IT
                        Solutions
                      </span>
                      <span style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>•</span>International
                        Jobs Recruitment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer">
            <div
              className="validity"
              style={{
                height: '75px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: '700' }}>
                This estimated package will be valid for 24 hours.
              </span>
              <span style={{ fontSize: '16px' }}>
                Date of Creation:{' '}
                {data?.updatedAt
                  ? new Date(data?.updatedAt).toLocaleString('en-GB', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : ''}
              </span>
            </div>
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
                <br /> www.waywiseglobal.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadClient
