'use client'

import { useAllFormFields, useField } from '@payloadcms/ui'
import { getSiblingData } from 'payload/shared'
import { useEffect, useState } from 'react'

const TotalAmountField: React.FC = () => {
  const { value, setValue } = useField({})
  const [fields, dispatchFields] = useAllFormFields()
  const invoiceSummary = getSiblingData(fields,  'invoiceSummary.invoicePaymentSummary')
  const [subTotal, setSubTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [tax, setTax] = useState<number>(0)
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const [isTax, setIsTax] = useState<boolean>(false)

  useEffect(() => {
    const invoiceData = invoiceSummary?.invoicePaymentSummary
    const subTotalData = invoiceData?.subTotalAmount
    const discountData = invoiceData?.discount
    const isDiscountData = invoiceData?.isDiscount
    const taxData = invoiceData?.tax
    const isTaxData = invoiceData?.isTax

    if(subTotal !== subTotalData) {
      setSubTotal(subTotalData)
    }
    if(discount !== discountData) {
      setDiscount(discountData)
    }
    if(isDiscount !== isDiscountData) {
      setIsDiscount(isDiscountData)
    }
    if(tax !== taxData) {
      setTax(taxData)
    }
    if(isTax !== isTaxData) {
      setIsTax(isTaxData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceSummary])

  useEffect(() => {
    let total: number = subTotal || 0;


    if (isDiscount && discount) {
      total = total - discount
    }
    if (isTax && tax) {
      const percent =  Math.round((tax / 100) * total)
      total = total - percent
    }
    setValue(total)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTotal, discount, isDiscount, isTax, tax])

  return (
    <div className="field-type number" style={{ width: '100%' }}>
      <label className="field-label">Total Amount</label>
      <div className="field-type__wrap">
        <input value={(value as number) || 0} readOnly={true} />
      </div>
    </div>
  )
}

export default TotalAmountField
