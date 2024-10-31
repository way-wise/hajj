'use client'

import React, { useEffect, useState } from 'react'

import numberToWords from 'number-to-words'
import { Invoice } from '@/payload-types'
import { Media } from '../Media'
import { useSearchParams } from 'next/navigation'

import { loadStripe } from '@stripe/stripe-js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

/**
 * Formats a number with commas and decimal places
 *
 * @param {number} number - Number to format
 * @returns {string} A styled number to be displayed on the invoice
 */
const formatNumberWithCommas = (number: number) => {
  return number.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Turns a number into words for invoices
 *
 * @param {number} price - Number to format
 * @returns {string} Number in words
 */
const formatPriceToString = (price: number): string => {
  // Split the price into integer and fractional parts (Dollar and Cents)
  const integerPart = Math.floor(price)
  const fractionalPart = Math.round((price - integerPart) * 100)

  // Convert the integer part to words with capitalized first letter
  const integerPartInWords = numberToWords
    .toWords(integerPart)
    .replace(/^\w/, (c) => c.toUpperCase())

  // Create the result string without fractional part if it's zero
  let result = integerPartInWords

  // Append fractional part only if it's not zero
  if (fractionalPart !== 0) {
    result += ` and ${fractionalPart}/100`
  }

  // Handle the case when both integer and fractional parts are zero
  if (integerPart === 0 && fractionalPart === 0) {
    return 'Zero'
  }

  return result
}

const isDataUrl = (str: string) => str.startsWith('data:')

export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

const InvoiceTheme1 = (data: Invoice) => {
  const { id, slug, billingAddress, details, invoiceItems, invoiceSummary } = data
  const { billingFrom, billingTo } = billingAddress || {}
  const { invoiceDetails } = details || {}

  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isCancel, setIsCancel] = useState<boolean>(false)

  const params = useSearchParams()

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    if (params.get('success')) {
      console.log('payment Successfull.');
      setIsSuccess(true)
    }

    if (params.get('canceled')) {
      console.log('payment canceled.');
      setIsCancel(true)
    }
  }, [params]);

  return (
    <>
      <AlertDialog open={isSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Successfull</AlertDialogTitle>
            <AlertDialogDescription>
              Your payment is successfully paid with card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsSuccess(false)}>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => setIsSuccess(false)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Canceled</AlertDialogTitle>
            <AlertDialogDescription>
              Your payment is canceled. You can try again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCancel(false)}>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => setIsCancel(false)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section style={{ fontFamily: 'Outfit, sans-serif' }}>
        <div className="flex flex-col p-4 sm:p-10 bg-white rounded-xl min-h-[60rem]">
          <div className="flex justify-between">
            <div>
              {invoiceDetails.logo && (
                <Media
                  resource={invoiceDetails?.logo}
                  className="w-36 h-24"
                  priority
                  alt={`Logo of ${billingFrom?.name}`}
                />
              )}
              <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600">
                {billingFrom?.name}
              </h1>
            </div>
            <div className="text-right">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Invoice #</h2>
              <span className="mt-1 block text-gray-500">{invoiceDetails.number}</span>
              <address className="mt-4 not-italic text-gray-800">
                {billingFrom?.address}
                <br />
                {billingFrom?.zip}, {billingFrom?.city}
                <br />
                {billingFrom?.country}
                <br />
              </address>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Bill to:</h3>
              <h3 className="text-lg font-semibold text-gray-800">{billingTo?.name}</h3>
              <address className="mt-2 not-italic text-gray-500">
                {billingTo?.address}, {billingTo?.zip}
                <br />
                {billingTo?.city}, {billingTo?.country}
                <br />
              </address>
            </div>
            <div className="sm:text-right space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl className="grid sm:grid-cols-6 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800">Invoice date:</dt>
                  <dd className="col-span-3 text-gray-500">
                    {new Date(invoiceDetails?.issueDate).toLocaleDateString('en-US', DATE_OPTIONS)}
                  </dd>
                </dl>
                <dl className="grid sm:grid-cols-6 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800">Due date:</dt>
                  <dd className="col-span-3 text-gray-500">
                    {new Date(invoiceDetails?.dueDate).toLocaleDateString('en-US', DATE_OPTIONS)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="border border-gray-200 p-1 rounded-lg space-y-1">
              <div className="hidden sm:grid sm:grid-cols-5">
                <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">
                  Item
                </div>
                <div className="text-left text-xs font-medium text-gray-500 uppercase">Qty</div>
                <div className="text-left text-xs font-medium text-gray-500 uppercase">Rate</div>
                <div className="text-right text-xs font-medium text-gray-500 uppercase">Amount</div>
              </div>
              <div className="hidden sm:block border-b border-gray-200"></div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-1">
                {invoiceItems?.items &&
                  invoiceItems?.items.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="col-span-full sm:col-span-2 border-b border-gray-300">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-600">{item?.description}</p>
                      </div>
                      <div className="border-b border-gray-300">
                        <p className="text-gray-800">{item.quantity}</p>
                      </div>
                      <div className="border-b border-gray-300">
                        <p className="text-gray-800">{item.rate} USD</p>
                      </div>
                      <div className="border-b border-gray-300">
                        <p className="sm:text-right text-gray-800">{item.total} USD</p>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
              <div className="sm:hidden border-b border-gray-200"></div>
            </div>
          </div>

          <div className="mt-2 flex sm:justify-end">
            <div className="sm:text-right space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800">Subtotal:</dt>
                  <dd className="col-span-2 text-gray-500">
                    {formatNumberWithCommas(
                      Number(invoiceSummary?.invoicePaymentSummary?.subTotalAmount),
                    )}{' '}
                    USD
                  </dd>
                </dl>
                {invoiceSummary?.invoicePaymentSummary?.isDiscount &&
                  invoiceSummary?.invoicePaymentSummary?.discount &&
                  invoiceSummary?.invoicePaymentSummary?.discount > 0 && (
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                      <dt className="col-span-3 font-semibold text-gray-800">Discount:</dt>
                      <dd className="col-span-2 text-gray-500">
                        {`- ${invoiceSummary?.invoicePaymentSummary?.discount} $USD`}
                      </dd>
                    </dl>
                  )}
                {invoiceSummary?.invoicePaymentSummary?.isTax &&
                  invoiceSummary?.invoicePaymentSummary?.tax &&
                  invoiceSummary?.invoicePaymentSummary?.tax > 0 && (
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                      <dt className="col-span-3 font-semibold text-gray-800">Tax:</dt>
                      <dd className="col-span-2 text-gray-500">
                        {`+ ${invoiceSummary?.invoicePaymentSummary?.tax}%`}
                      </dd>
                    </dl>
                  )}
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800">Total:</dt>
                  <dd className="col-span-2 text-gray-500">
                    {formatNumberWithCommas(
                      Number(invoiceSummary?.invoicePaymentSummary?.totalAmount),
                    )}{' '}
                    USD
                  </dd>
                </dl>
                {invoiceSummary?.invoicePaymentSummary?.inWord && (
                  <dl className="grid sm:grid-cols-5 gap-x-3">
                    <dt className="col-span-3 font-semibold text-gray-800">Total in words:</dt>
                    <dd className="col-span-2 text-gray-500">
                      <em>
                        {formatPriceToString(
                          (invoiceSummary?.invoicePaymentSummary?.totalAmount as number) || 0,
                        )}{' '}
                        USD
                      </em>
                    </dd>
                  </dl>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="my-4">
              {invoiceSummary?.invoiceInfoSummary?.notes && (
                <div className="my-2">
                  <p className="font-semibold text-blue-600">Additional notes:</p>
                  <p className="font-regular text-gray-800">
                    {invoiceSummary?.invoiceInfoSummary?.notes}
                  </p>
                </div>
              )}
              {invoiceSummary?.invoiceInfoSummary?.terms && (
                <div className="my-2">
                  <p className="font-semibold text-blue-600">Payment terms:</p>
                  <p className="font-regular text-gray-800">
                    {invoiceSummary?.invoiceInfoSummary?.terms}
                  </p>
                </div>
              )}
              {details.payments?.paymentMethod === 'online' ? (
                <div className="my-2 flex flex-col gap-2">
                  <span className="font-semibold text-md text-gray-800">Please pay online</span>
                  <form action={`/api/checkout_sessions?slug=${slug}`} method="POST">
                    <button type="submit" role="link" className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                      <span className="order-2">Pay Now</span>
                      <span className="relative only:-mx-5">
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.226 5.385c-.584 0-.937.164-.937.593 0 .468.607.674 1.36.93 1.228.415 2.844.963 2.851 2.993C11.5 11.868 9.924 13 7.63 13a7.7 7.7 0 0 1-3.009-.626V9.758c.926.506 2.095.88 3.01.88.617 0 1.058-.165 1.058-.671 0-.518-.658-.755-1.453-1.041C6.026 8.49 4.5 7.94 4.5 6.11 4.5 4.165 5.988 3 8.226 3a7.3 7.3 0 0 1 2.734.505v2.583c-.838-.45-1.896-.703-2.734-.703" />
                        </svg>
                      </span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="my-2">
                  <span className="font-semibold text-md text-gray-800">
                    Please send the payment to this address
                    <p className="text-sm">Bank: {details.payments?.bankName}</p>
                    <p className="text-sm">Account name: {details.payments?.accountName}</p>
                    <p className="text-sm">Account no: {details.payments?.accountNumber}</p>
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              If you have any questions concerning this invoice, use the following contact
              information:
            </p>
            <div>
              <p className="block text-sm font-medium text-gray-800">{billingFrom?.email}</p>
              <p className="block text-sm font-medium text-gray-800">{billingFrom?.phone}</p>
            </div>
          </div>

          {/* Signature */}
          {invoiceSummary?.invoiceInfoSummary?.signature && (
            <Media
              resource={invoiceSummary?.invoiceInfoSummary?.signature}
              className="w-36 h-24"
              priority
              alt={`Signature of ${billingFrom?.name}`}
            />
          )}
        </div>
      </section>
    </>
  )
}

export default InvoiceTheme1
