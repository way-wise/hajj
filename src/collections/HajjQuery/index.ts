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
          label: 'Package Type',
          name: 'package_type',
          type: 'radio',
          required: true,
          defaultValue: 'Hajj',
          options: ['Hajj', 'Umrah'],
        },
        {
          label: 'Is Food Included',
          name: 'is_food_included',
          type: 'checkbox',
          admin: {
            condition: (data, siblingData, { user }) => {
              return siblingData.package_type === 'Hajj'
            },
          },
        },
        {
          label: 'Name of the Package',
          name: 'package_name',
          type: 'text',
          admin: {
            condition: (data, siblingData, { user }) => {
              return siblingData.package_type === 'Hajj'
            },
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
      ],
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Duration in Makkah',
          name: 'makka_duration',
          type: 'number',
          required: true,
        },
        {
          label: 'Duration in Madina',
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
        },
        {
          label: 'Waywise service charge',
          name: 'waywise_service_fee',
          type: 'number',
          required: true,
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
      label: 'Flight Reference',
      name: 'flight_reference',
      type: 'text',
      required: true,
    },
    {
      label: 'Occupancy type in hotel room',
      name: 'occupancy_type',
      type: 'text',
      required: true,
    },
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
    {
      label: 'Transport Service',
      name: 'transport_service',
      type: 'text',
      required: true,
    },
  ],
}

export default HajjQuery
