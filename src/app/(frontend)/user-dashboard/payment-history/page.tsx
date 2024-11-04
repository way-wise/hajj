'use client'
import React, { FC } from 'react'
import qs from 'qs'
import { useAuth } from '@/providers/Auth'
import './page.css'
import html2pdf from 'html2pdf.js'
import Link from 'next/link'

interface PaymentHistoryProps {}

const PaymentHistory: FC<PaymentHistoryProps> = () => {
  const [invoices, setInvoices] = React.useState([])
  const { user } = useAuth()

  const stringifiedQuery = qs.stringify(
    {
      where: {
        paidBy: {
          equals: user?.id,
        },
      },
    },
    { addQueryPrefix: true },
  )

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/invoices${stringifiedQuery}`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setInvoices(result.docs)
      } catch {
        console.log('data not found')
      }
    }

    if (user?.id) {
      fetchData()
    }
  }, [user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const printHandler = (id: string) => {
    const element = document.getElementById(id)

    if (element) {
      element.classList.add('printable')
      window.print()
      element.classList.remove('printable')
    }
  }

  const downloadHandler = (id: string) => {
    const element = document.getElementById(id)
    const opt = {
      margin: 1,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }
    html2pdf(element, opt)
  }


  return (
    <div className="flex flex-col lg:h-[700px] min-h-max w-full">
      <div className="bg-primary text-primary-foreground p-4">
        <h2 className="text-xl font-semibold">Payment History</h2>
      </div>

      <div className="p-8 grid grid-cols-1 gap-6">
        {invoices.length > 0 &&
          invoices.map((invoice: any) => (
            <div className="p-6 border border-gray-100 shadow-md rounded-md" key={invoice.id}>
              <div id={invoice.id}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl mb-0">{invoice.title}</h2>
                  <p>Invoice No: #{invoice?.details?.invoiceDetails?.number}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-10 my-4">
                  <div className="flex justify-between">
                    <p>Customer:</p>
                    <p>{invoice?.billingAddress?.billingTo?.name}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Issue Date:</p>
                    <p>{formatDate(invoice?.details?.invoiceDetails?.issueDate)}</p>
                  </div>

                  <div className="flex justify-between">
                    <p>Payment Method:</p>
                    <p>{invoice?.details?.payments?.paymentMethod}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Due Date:</p>
                    <p>{formatDate(invoice?.details?.invoiceDetails?.dueDate)}</p>
                  </div>
                </div>

                <table className="border-collapse border w-full">
                  <thead>
                    <tr>
                      <th className="border">SL#</th>
                      <th className="border">Name</th>
                      <th className="border">Description</th>
                      <th className="border">Quantity</th>
                      <th className="border">Rate</th>
                      <th className="border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.invoiceItems?.items?.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border text-center px-2">{index + 1}</td>
                        <td className="border px-2">{item?.name}</td>
                        <td className="border px-2">{item?.description}</td>
                        <td className="border text-center px-2">{item?.quantity}</td>
                        <td className="border text-end px-2">${item?.rate}</td>
                        <td className="border text-end px-2">${item?.total}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5} className="border px-2">
                        Total
                      </td>
                      <td className="border text-end px-2">
                        ${invoice?.invoiceSummary?.invoicePaymentSummary?.subTotalAmount}
                      </td>
                    </tr>
                    {invoice?.invoiceSummary?.invoicePaymentSummary?.isTax && (
                      <tr>
                        <td colSpan={5} className="border px-2">
                          Tax
                        </td>
                        <td className="border text-end px-2">
                          ${invoice?.invoiceSummary?.invoicePaymentSummary?.tax}
                        </td>
                      </tr>
                    )}
                    {invoice?.invoiceSummary?.invoicePaymentSummary?.isDiscount && (
                      <tr>
                        <td colSpan={5} className="border px-2">
                          Discount
                        </td>
                        <td className="border text-end px-2">
                          ${invoice?.invoiceSummary?.invoicePaymentSummary?.discount}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={5} className="border px-2">
                        Grand Total
                      </td>
                      <td className="border text-end px-2">
                        ${invoice?.invoiceSummary?.invoicePaymentSummary?.totalAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-end mt-4">
                <Link href={`${window.location.origin}/invoices/${invoice.slug}`}>
                  <button className="bg-primary text-white w-24 py-1 rounded border-none me-3 text-sm">
                    View
                  </button>
                </Link>

                <button
                  onClick={() => printHandler(invoice.id)}
                  className="bg-green-500 text-white w-24 py-1 rounded border-none me-3 text-sm"
                >
                  Print
                </button>
                <button
                  onClick={() => downloadHandler(invoice.id)}
                  className="bg-blue-500 text-white w-24 py-1 rounded border-none text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default PaymentHistory
