'use client'

import { useDebounce } from '@/utilities/useDebounce'
import { useField } from '@payloadcms/ui'
import { TextFieldClientComponent } from 'payload'
import { useEffect, useState } from 'react'

const ColorPickerComponent: TextFieldClientComponent = ({ path }) => {
  const { setValue, value } = useField<string>({ path })
  const [color, setColor] = useState<string>(value)
  const debouncedValue = useDebounce(color)
  useEffect(() => {
    setValue(debouncedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <div className="field-type number" style={{width: '300px'}}>
      <label className="field-label">Color Picker</label>
      <div className="field-type__wrap" style={{display: 'flex'}}>
      <input
          type="text"
          value={value}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => setColor(e.target.value)}
          style={{ padding: '0', width: '50px' }}
        />
      </div>
    </div>
  )
}

export default ColorPickerComponent
