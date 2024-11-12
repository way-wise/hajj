'use client'

import { Button } from '@payloadcms/ui'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DownloadClient = ({ data }: { data: any }) => {

  return (
    <>
      <div id="hajjQueryView" className="package-container">
        <div className="header">
          <div className="logo-container">
            <img src="/assets/waywise-islam-logo.png" alt="Way Wise" className="logo" />
            <div className="company-info">
              <span className="company-name">Way Wise Islam & Al Muqaddas</span>
              <p className="subtitle">An American and Bangladeshi Joint Venture</p>
            </div>
            <img src="/assets/mukaddas-logo.png" alt="Muqaddas" className="logo" />
          </div>
          <h1 className="main-title">Customized Umrah Package</h1>
        </div>

        <div className="package-content">
          <div className="greeting">
            <p className="red-heading">Dear Mr/Mrs Kabir,</p>
            <p>
              Thanks for your Interest. We recieved your information and prepared a customised Umrah
              Package for you.
            </p>
          </div>

          <div className="package-grid">
            <div className="left-section">
              <h3 className="red-heading">Your Package Includes</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Package proposed date</span>
                  <span className="value">{data?.proposed_date}</span>
                </div>
                <div className="info-item">
                  <span className="label">Proposed time of Umrah</span>
                  <span className="value">{data?.proposed_time}</span>
                </div>
                <div className="info-item">
                  <span className="label">Umrah duration</span>
                  <span className="value">
                    Makkah {data?.makka_duration} days, Madina {data?.madina_duration} days
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Flight preference</span>
                  <span className="value">{data?.flight_reference}</span>
                </div>
                <div className="info-item">
                  <span className="label">Occupancy type in hotel room</span>
                  <span className="value">{data?.occupancy_type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Hotel type & distance in Makkah</span>
                  <span className="value">{data?.makka_hotel_type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Hotel type & distance in Madina</span>
                  <span className="value">{data?.madina_hotel_type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Transport Service</span>
                  <span className="value">{data?.transport_service}</span>
                </div>
              </div>
            </div>

            <div className="right-section">
              <h3 className="red-heading">Pricing</h3>
              <div className="pricing-list">
                <div className="price-item">
                  <span className="label">Total estimated cost of package</span>
                  <span className="amount">{data?.total_cost_of_package}</span>
                </div>
                <div className="price-item">
                  <span className="label">Waywise service charge</span>
                  <span className="amount">{data?.waywise_service_fee}</span>
                </div>
                <div className="price-item grand-total">
                  <span className="red-heading">Grand Total</span>
                  <span className="amount-big">{data?.grand_total}</span>
                </div>
              </div>

              <div className="package-notes">
                <ul>
                  <li>All Jiara in Makkah & Madina included</li>
                  <li>Qualified tour guide/Muallem included</li>
                  <li>Visa & all type of registration cost included</li>
                  <li>Taif and Jeddah visit not included</li>
                  {data?.is_food_included && <li>Food not included</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="validity">This estimated package will be valid for 24 hours.</div>
          <div className="contact-info">
            <span>
            <img src="/assets/home.png" className="icon" /> House: B/148(5th Floor), <br /> Road: 22, Mohakhali,
              Dhaka- 1212
            </span>
            <span>
            <img src="/assets/phone.png"  className="icon" /> +880 1748 771945
            </span>
            <span>
            <img src="/assets/glob.png"  className="icon" /> www.waywiseislam.com
            </span>
          </div>
        </div>
      </div>

      <div className="download-button">
        <Button
          onClick={() => {
            const capture = document.getElementById('hajjQueryView')
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

export default DownloadClient
