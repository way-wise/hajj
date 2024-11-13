import type { CollectionConfig } from 'payload'

import { checkRole } from '../Users/checkRole'
import { admins } from '@/access/admins'

const HajjQuery: CollectionConfig = {
  slug: 'haj-jquery',
  access: {
    create: ({ req: { user } }) => checkRole(['admin', 'operation'], user),
    read: ({ req: { user } }) => checkRole(['admin', 'operation'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'operation'], user),
    delete: admins,
  },
  admin: {
    useAsTitle: 'package_type',
    components: {
      views: {
        edit: {
          DownloadView: {
            path: '/download',
            Component: '@/collections/HajjQuery/ui/DownloadView',
            tab: {
              label: 'Download',
              href: '/download',
            },
          },
        },
      },
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          label: 'Salutation',
          name: 'salutation',
          type: 'radio',
          required: true,
          defaultValue: 'Mr',
          options: ['Mr', 'Mrs'],
          admin:{
            width: '10%'
          }
        },
        {
          label: 'Name of Candidate',
          name: 'name',
          type: 'text',
          required: true,
          admin:{
            width: '45%'
          }
        },
        {
          label: 'Address',
          name: 'address',
          type: 'text',
          admin:{
            width: '44%'
          }
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Package Type',
          name: 'package_type',
          type: 'radio',
          required: true,
          defaultValue: 'Hajj',
          options: ['Hajj', 'Umrah'],
          admin:{
            width: '10%'
          }
        },
        {
          label: 'Name of the Package',
          name: 'package_name',
          type: 'text',
          admin: {
            condition: (data, siblingData, { user }) => {
              return siblingData.package_type === 'Hajj'
            },
            width: '45%'
          },
        },
        {
          label: 'Is Food Included',
          name: 'is_food_included',
          type: 'checkbox',
          admin: {
            condition: (data, siblingData, { user }) => {
              return siblingData.package_type === 'Hajj'
            },
            width: '44%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Package proposed Date',
          name: 'proposed_date',
          type: 'date',
          required: true,
        },
        {
          label: 'Proposed Time of Umrah',
          name: 'proposed_time',
          type: 'text',
          required: true,
        },
        {
          label: 'Duration in Makkah (Days)',
          name: 'makka_duration',
          type: 'number',
          required: true,
        },
        {
          label: 'Duration in Madina (Days)',
          name: 'madina_duration',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Total estimated cost of Package',
          name: 'total_cost_of_package',
          type: 'number',
          required: true,
          admin:{
            width: '33%'
          }
        },
        {
          label: 'Waywise service charge',
          name: 'waywise_service_fee',
          type: 'number',
          required: true,
          admin:{
            width: '33%'
          }
        },
        {
          label: 'Grand Total',
          name: 'grand_total',
          type: 'number',
          min: 0,
          admin: {
            readOnly: true,
            components: {
              Field: '@/collections/HajjQuery/ui/TotalAmountField',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Flight Reference',
          name: 'flight_reference',
          type: 'text',
          required: true,
          admin:{
            width: '33%'
          }
        },
        {
          label: 'Occupancy type in hotel room',
          name: 'occupancy_type',
          type: 'text',
          required: true,
          admin:{
            width: '33%'
          }
        },
        {
          label: 'Transport Service',
          name: 'transport_service',
          type: 'text',
          required: true,
          admin:{
            width: '34%'
          }
        },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Hotel Type & distance from Makkah',
          name: 'makka_hotel_type',
          type: 'text',
          required: true,
        },
        {
          label: 'Hotel Type & distance from Madina',
          name: 'madina_hotel_type',
          type: 'text',
          required: true,
        },
      ]
    },
  ],
}

export default HajjQuery
