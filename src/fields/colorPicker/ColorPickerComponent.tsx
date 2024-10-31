'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { extend } from 'colord'
import namesPlugin from 'colord/plugins/names'
import type { TextFieldClientProps } from 'payload'
import {
  HexColorPicker,
  HexAlphaColorPicker,
  HslaStringColorPicker,
  HslStringColorPicker,
  RgbaStringColorPicker,
  RgbStringColorPicker,
} from 'react-colorful'
import { Config } from '.'
import './index.scss'
import { FieldDescription, FieldLabel, useField, useFieldProps } from '@payloadcms/ui'

extend([namesPlugin])
const defaultColor = '#9A9A9A'

type Props = {
  path: string
  placeholder?: string
  className?: string
  custom: Config
} & TextFieldClientProps

const ColourComponents: Record<Config['type'], any> = {
  hex: HexColorPicker,
  hexA: HexAlphaColorPicker,
  hsl: HslStringColorPicker,
  hslA: HslaStringColorPicker,
  rgb: RgbStringColorPicker,
  rgbA: RgbaStringColorPicker,
}

const ColourPickerComponent: React.FC<Props> = props => {
  const { field, custom } = props

  const { label, admin } = field
  const { path, readOnly: readOnlyFromProps } = useFieldProps()

  const beforeInput = admin?.components?.beforeInput
  const afterInput = admin?.components?.afterInput
  const isReadonly = Boolean(admin?.readOnly)

  const inputRef = useRef<HTMLInputElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  const { value = '', setValue } = useField<string>({
    path,
  })

  const isExpanded = Boolean(custom.expanded)

  const [color, setColor] = useState<string|undefined>(value ?? defaultColor)
  const [isAdding, setIsAdding] = useState(isExpanded)

  const Picker = useMemo(() => {
    return ColourComponents[custom.type]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddColorViaPicker = useCallback(
    (val?: string) => {
      if (val !== color && !isReadonly) {
        setColor(val)
        if (inputRef.current) {
          inputRef.current.value = val ?? ''
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setIsAdding, inputRef, isReadonly],
  )

  const handleAddColor = useCallback(
    (val?: string) => {
      if (val !== color && !isReadonly) {
        setColor(val)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setIsAdding, isReadonly],
  )

  useEffect(() => {
      if (color !== value && !isReadonly) {
        setValue(color)
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdding])

  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setIsAdding(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className={`bfColourPickerFieldWrapper`}>
      {Array.isArray(beforeInput) && beforeInput.map((Component:any, i) => <Component key={i} />)}
      <FieldLabel
        htmlFor={`bfColourPickerField-${path.replace(/\./gi, '__')}`}
        label={label}
        field={field}
      />
      {(isExpanded || isAdding) && (
        <div ref={colorPickerRef}>
          <div
            className={['colourPickerWrapper', isReadonly && 'readOnly'].filter(Boolean).join(' ')}
            // @ts-expect-error
            inert={isReadonly ? '' : null}
          >
            <Picker
              onChange={handleAddColorViaPicker}
              color={value}
              onBlur={(e: FocusEvent) => {
                if (e.relatedTarget === null) {
                  setIsAdding(false)
                }
              }}
              onKeyDown={(e: KeyboardEvent) =>
                (e.key === 'Enter' || e.key === 'Escape') && setIsAdding(false)
              }
            />
          </div>

          <input
            id={`bfColourPickerField-${path.replace(/\./gi, '__')}`}
            ref={inputRef}
            onChange={({ currentTarget }) => {
              handleAddColor(currentTarget.value)
            }}
            defaultValue={value}
            readOnly={isReadonly}
            className={`manual-field-input`}
            style={{backgroundColor: color}}
          />
        </div>
      )}
      {!isExpanded && !isAdding && (
        <div className="buttonContainer">
          <button
            type="button"
            className={`chip chip--clickable`}
            style={{ backgroundColor: value, height: '40px', width: '40px', border: 'none', borderRadius: '3px 0 0 3px' }}
            aria-label={color}
            onClick={() => {
              setIsAdding(!isAdding)
            }}
          />
          {custom.showPreview && (
            <>
              <label
                htmlFor={`bfColourPickerField-previewField-${path.replace(/\./gi, '__')}`}
                className="srOnly"
              >
                Preview
              </label>
              <div className='field-type__wrap'>
                <input
                  id={`bfColourPickerField-previewField-${path.replace(/\./gi, '__')}`}
                  className="previewField"
                  disabled
                  value={value}
                  style={{ height: '40px', width: 'auto' }}
                  />
              </div>
            </>
          )}
        </div>
      )}
      <FieldDescription
        className={`field-description-${path.replace(/\./g, '__')}`}
        field={field}
      />
      {Array.isArray(afterInput) && afterInput.map((Component:any, i) => <Component key={i} />)}
    </div>
  )
}
export default ColourPickerComponent
