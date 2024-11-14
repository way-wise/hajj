import type { CollectionConfig } from 'payload'

import { checkRole } from '../Users/checkRole'
import { admins } from '@/access/admins'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { anyone } from '@/access/anyone'

const HajjQuery: CollectionConfig = {
  slug: 'hajj-queries',
  access: {
    create: ({ req: { user } }) => checkRole(['admin', 'operation'], user),
    read: anyone,
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
            Component: '@/collections/HajjQueries/ui/DownloadView',
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
      label: 'Salutation',
      name: 'salutation',
      type: 'radio',
      required: true,
      defaultValue: 'Mr',
      options: ['Mr', 'Mrs'],
    },
    {
      label: 'Name of Candidate',
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      label: 'Mobile',
      name: 'mobile',
      type: 'text',
      required: true,
    },
    {
      label: 'Address',
      name: 'address',
      type: 'text',
    },
    {
      label: 'Package Type',
      name: 'package_type',
      type: 'radio',
      required: true,
      defaultValue: 'Hajj',
      options: ['Hajj', 'Umrah'],
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
      label: 'Proposed Departure Date from Dhaka',
      name: 'proposed_date',
      type: 'date',
      required: true,
    },
    {
      label: 'Proposed Time of Umrah/Hajj',
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
      label: 'Discount',
      name: 'discount',
      type: 'number',
      required: false,
    },
    {
      label: 'Grand Total',
      name: 'grand_total',
      type: 'number',
      min: 0,
      admin: {
        readOnly: true,
        components: {
          Field: '@/collections/HajjQueries/ui/TotalAmountField',
        },
      },
    },
  ],
}

export default HajjQuery
