'use client'

import { useField } from '@payloadcms/ui'
import { TextFieldClientComponent } from 'payload'
import { useEffect, useState } from 'react'
import { icons } from './icons'
import './index.scss'

const IconPickerComponent: TextFieldClientComponent = ({ path }) => {
  const { setValue, value } = useField<string>({ path })
  const [term, setTerm] = useState<string>('')
  const [viewIcon, setViewIcon] = useState<boolean>(false)
  const [bicons, setBicons] = useState(icons)

  useEffect(() => {
    if (term !== '') {
      const newIcons = icons.filter((el) => el.name.toLowerCase().indexOf(term) > -1)
      setBicons(newIcons)
    } else {
      setBicons(icons)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term])

  return (
    <div className="field-type number">
      <label className="field-label">Icon Picker</label>
      <div className="field-type__wrap">
        <div className="iconBtn" onClick={() => setViewIcon(true)}>
          <i className={`bi bi-${value || 'alarm'}`}></i>
        </div>

        {viewIcon && (
          <div className='iconContainer'>
            <div className="iconHeading">
              <h3>Select Icon</h3>
              <span style={{cursor: 'pointer'}} onClick={() => setViewIcon(false)}>
                <i className="bi bi-x" style={{ fontSize: '2.5em', color: 'red' }} />
              </span>
            </div>
            <input type="text" value={term} onChange={(e) => setTerm(e.target.value)} />
            <div className="iconWrap">
              {bicons &&
                bicons.map((icon, index) => (
                  <span key={index} onClick={() => setValue(icon.name)}>
                    <i className={`bi bi-${icon.name}`}></i>
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IconPickerComponent
