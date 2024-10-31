import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'invoices',
        })

        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'paidBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'stripePaymentIntentID',
      type: 'text',
      admin: {
        components: {
          Field: '@/collections/Invoices/ui/LinkToPaymentIntent',
        },
        position: 'sidebar',
      },
      label: 'Stripe Payment Intent ID',
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'details',
          label: 'Invoice Details',
          fields: [
            {
              name: 'invoiceDetails',
              type: 'group',
              interfaceName: 'Invoice Info',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'number',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'issueDate',
                  type: 'date',
                  required: true,
                },
                {
                  name: 'dueDate',
                  type: 'date',
                  required: true,
                },
                {
                  name: 'theme',
                  type: 'select',
                  defaultValue: 'theme1',
                  label: 'Theme',
                  options: [
                    {
                      label: 'Theme1',
                      value: 'theme1',
                    },
                    {
                      label: 'Theme2',
                      value: 'theme2',
                    },
                  ],
                  required: true,
                },
              ],
            },
            {
              name: 'payments',
              type: 'group',
              interfaceName: 'Payment Info',
              fields: [
                {
                  name: 'paymentMethod',
                  type: 'radio',
                  options: [
                    {
                      label: 'Online',
                      value: 'online',
                    },
                    {
                      label: 'Mannual',
                      value: 'mannual',
                    },
                  ],
                  defaultValue: 'online',
                  admin: {
                    layout: 'horizontal',
                  },
                },
                {
                  name: 'bankName',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData, { user }) =>
                      siblingData.paymentMethod === 'mannual',
                  },
                },
                {
                  name: 'accountName',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData, { user }) =>
                      siblingData.paymentMethod === 'mannual',
                  },
                },
                {
                  name: 'accountNumber',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData, { user }) =>
                      siblingData.paymentMethod === 'mannual',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'billingAddress',
          label: 'Billing Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'billingFrom',
                  type: 'group',
                  interfaceName: 'billings From',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                    },
                    {
                      name: 'address',
                      type: 'text',
                    },
                    {
                      name: 'zip',
                      type: 'text',
                    },
                    {
                      name: 'city',
                      type: 'text',
                    },
                    {
                      name: 'country',
                      type: 'text',
                    },
                    {
                      name: 'email',
                      type: 'text',
                    },
                    {
                      name: 'phone',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'billingTo',
                  type: 'group',
                  interfaceName: 'billings To',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                    },
                    {
                      name: 'address',
                      type: 'text',
                    },
                    {
                      name: 'zip',
                      type: 'text',
                    },
                    {
                      name: 'city',
                      type: 'text',
                    },
                    {
                      name: 'country',
                      type: 'text',
                    },
                    {
                      name: 'email',
                      type: 'text',
                    },
                    {
                      name: 'phone',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'invoiceItems',
          label: 'Invoice Items',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'rate',
                      type: 'number',
                      min: 0,
                      required: true,
                      admin: {
                        width: '15%',
                      },
                    },
                    {
                      name: 'quantity',
                      type: 'number',
                      required: true,
                      min: 1,
                      hooks: {
                        beforeChange: [
                          ({ data, value, operation }) => {
                            if (data) {
                              data.total = value ? value : 0
                            }
                            return value
                          },
                        ],
                      },
                      admin: {
                        width: '10%',
                      },
                    },
                    {
                      name: 'total',
                      type: 'number',
                      min: 0,
                      admin: {
                        readOnly: true,
                        width: '25%',
                        components: {
                          Field: '@/collections/Invoices/ui/TotalField',
                        },
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: false,
                      admin: {
                        width: '50%',
                        placeholder: 'description',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'invoiceSummary',
          label: 'Invoice Summary',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'invoiceInfoSummary',
                  type: 'group',
                  fields: [
                    {
                      name: 'signature',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    {
                      name: 'notes',
                      label: 'Additional Notes',
                      type: 'textarea',
                    },
                    {
                      name: 'terms',
                      label: 'Payment Terms',
                      type: 'textarea',
                    },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'invoicePaymentSummary',
                  type: 'group',
                  fields: [
                    {
                      name: 'isDiscount',
                      type: 'checkbox',
                      label: 'Discount',
                      defaultValue: false,
                    },
                    {
                      name: 'isTax',
                      type: 'checkbox',
                      label: 'Tax',
                      defaultValue: false,
                    },
                    {
                      name: 'subTotalAmount',
                      type: 'number',
                      min: 0,
                      admin: {
                        components: {
                          Field: '@/collections/Invoices/ui/SubTotalAmountField',
                        },
                      },
                    },
                    {
                      name: 'discount',
                      label: 'Discount',
                      type: 'number',
                      admin: {
                        condition: (data, siblingData, { user }) => siblingData.isDiscount,
                      },
                    },
                    {
                      name: 'tax',
                      label: 'Tax (in percent)',
                      type: 'number',
                      admin: {
                        condition: (data, siblingData, { user }) => siblingData.isTax,
                      },
                    },
                    {
                      name: 'totalAmount',
                      type: 'number',
                      min: 0,
                      admin: {
                        width: '70%',
                        components: {
                          Field: '@/collections/Invoices/ui/TotalAmountField',
                        },
                      },
                    },
                    {
                      name: 'inWord',
                      type: 'checkbox',
                      label: 'Include Total in Words?',
                      defaultValue: true,
                    },
                  ],
                  admin: {
                    width: '45%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: false,
      // autosave: {
      //   interval: 100, // We set this interval for optimal live preview
      // },
    },
    maxPerDoc: 50,
  },
}
