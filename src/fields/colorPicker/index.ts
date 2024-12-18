import { Field } from 'payload'
import { TextField } from 'payload'
import deepMerge from '@/utilities/deepMerge'
import { PartialRequired } from '@/utilities/partialRequired'

type ColorPicker = (
  /**
   * Slug field overrides
   */
  overrides: PartialRequired<TextField, 'name'>,
) => Field[]

export const ColorPickerField: ColorPicker = (overrides) => {

  const alertBoxField = deepMerge<TextField, Partial<TextField>>(
    {
      name: 'ColorPickerField',
      type: 'text',
      admin: {
        components: {
          Field: {
            path: '@/fields/colorPicker/ColorPickerComponent',
          },
        },
      },
    },
    overrides,
  )

  const fields = [alertBoxField]

  return fields
}
