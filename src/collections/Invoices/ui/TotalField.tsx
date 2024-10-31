'use client'

import { useAllFormFields, useField } from '@payloadcms/ui'
import { getSiblingData } from 'payload/shared'
import { useEffect, useState } from 'react'

const TotalField: React.FC = () => {
  const [rate, setRate] = useState<number | null>()
  const [quantity, setQuantity] = useState<number | null>()
  const { value, setValue, path } = useField({})
  const [fields, dispatchFields] = useAllFormFields()
  const invoiceItems = getSiblingData(fields, 'invoiceItems.items')

  useEffect(() => {
    let index = 0
    if (path) {
      const pathMatch = path.match(/\d+/)
      index = pathMatch ? parseInt(pathMatch[0]) : 0
    }
    const items = invoiceItems.items
    const rateValue = items[index] ? items[index].rate : 0
    const quantityValue = items[index] ? items[index].quantity : 0
    if (rate !== rateValue) {
      setRate(rateValue)
    }
    if (quantity !== quantityValue) {
      setQuantity(quantityValue)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceItems, path])

  useEffect(() => {
    if (rate && quantity) {
      const total = rate * quantity
      setValue(total || 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate, quantity])

  return (
    <div className="field-type number" style={{ width: '22%' }}>
      <label className="field-label">Total</label>
      <div className="field-type__wrap">
        <input value={value as number} readOnly={true} />
      </div>
    </div>
  )
}

export default TotalField
