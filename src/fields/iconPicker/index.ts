import { Field } from 'payload'
import { TextField } from 'payload'
import deepMerge from '@/utilities/deepMerge'
import { PartialRequired } from '@/utilities/partialRequired'

type IconPicker = (
  /**
   * Slug field overrides
   */
  overrides: PartialRequired<TextField, 'name'>,
) => Field[]

export const IconPickerField: IconPicker = (overrides) => {

  const alertBoxField = deepMerge<TextField, Partial<TextField>>(
    {
      name: 'IconPickerField',
      type: 'text',
      admin: {
        components: {
          Field: {
            path: '@/fields/iconPicker/IconPickerComponent',
          },
        },
      },
    },
    overrides,
  )

  const fields = [alertBoxField]

  return fields
}
