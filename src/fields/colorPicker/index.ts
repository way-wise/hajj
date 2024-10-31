import { Field } from 'payload'
import { TextField } from 'payload'
import { PartialRequired } from '@/utilities/partialRequired'
import deepMerge from '@/utilities/deepMerge'

export type Config = {
  type: 'hex' | 'hexA' | 'rgb' | 'rgbA' | 'hsl' | 'hslA'
  expanded?: boolean
  showPreview?: boolean
}

type ColorPicker = (
  /**
   * Slug field overrides
   */
  overrides: PartialRequired<TextField, 'name'>,
  config?: Config,
) => Field[]

export const ColorPickerField: ColorPicker = (overrides, config = { type: 'hex' }) => {
  const custom = deepMerge<Config, Partial<Config>>(
    {
      type: 'hex',
      expanded: false,
      showPreview: false,
    },
    config,
  )

  const alertBoxField = deepMerge<TextField, Partial<TextField>>(
    {
      name: 'ColorPickerField',
      type: 'text',
      admin: {
        components: {
          Field: {
            path: '@/fields/colorPicker/ColorPickerComponent',
            clientProps: {
              custom,
            },
          },
        },
      },
    },
    overrides,
  )

  const fields = [alertBoxField]

  return fields
}
