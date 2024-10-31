'use client'

import { useAllFormFields, useField } from '@payloadcms/ui'
import { getSiblingData } from 'payload/shared'
import { useEffect, useState } from 'react'

const TotalAmountField: React.FC = () => {
  const { value, setValue } = useField({})
  const [fields, dispatchFields] = useAllFormFields()
  const invoiceItems = getSiblingData(fields, 'invoiceItems.items')
  const [items, setItems] = useState()

  useEffect(() => {
    const data = invoiceItems.items
    if (JSON.stringify(items) !== JSON.stringify(data)) {
      let subTotalValue = 0
      setItems(data)
      if (data && data.length > 0) {
        const prices = data.map((item) => item.total)
        subTotalValue = prices.reduce((acc, curr) => acc + curr)
      }
      if (value !== subTotalValue) {
        setValue(subTotalValue)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceItems])

  return (
    <div className="field-type number" style={{ width: '100%' }}>
      <label className="field-label">Sub Total</label>
      <div className="field-type__wrap">
        <input value={(value as number) || 0} readOnly={true} />
      </div>
    </div>
  )
}

export default TotalAmountField
