'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

const TotalAmountField: React.FC = () => {
  const { value, setValue } = useField({})
  const [total, setTotal] = useState<number>(0)
  const amount:any = useFormFields(([fields]) => fields.total_cost_of_package)
  const charge:any = useFormFields(([fields]) => fields.waywise_service_fee)

  useEffect(() => {
    let totalValue = 0
    if (typeof amount?.value !== 'undefined' && typeof charge?.value !== 'undefined') {
      totalValue = amount?.value + charge?.value
      if (total !== totalValue) {
        setTotal(totalValue)
        setValue(totalValue)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, charge])

  return (
    <div className="field-type number" style={{ width: '33%' }}>
      <label className="field-label">Grand Total</label>
      <div className="field-type__wrap">
        <input value={(total as number) || 0} readOnly={true} />
      </div>
    </div>
  )
}

export default TotalAmountField
