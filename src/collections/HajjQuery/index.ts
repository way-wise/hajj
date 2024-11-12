import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
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
          name: 'package_type',
          type: 'radio',
          required: true,
          defaultValue: 'Hajj',
          options: ['Hajj', 'Umrah'],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'proposed_date',
          type: 'date',
          required: true,
        },
        {
          name: 'total_cost_of_package',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'proposed_time',
          type: 'text',
          required: true,
        },
        {
          name: 'waywise_service_fee',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'makka_duration',
          type: 'number',
          required: true,
        },
        {
          name: 'madina_duration',
          type: 'number',
          required: true,
        },
        {
          name: 'grand_total',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'flight_reference',
      type: 'text',
      required: true,
    },
    {
      name: 'occupancy_type',
      type: 'text',
      required: true,
    },
    {
      name: 'makka_hotel_type',
      type: 'text',
      required: true,
    },
    {
      name: 'madina_hotel_type',
      type: 'text',
      required: true,
    },
    {
      name: 'transport_service',
      type: 'text',
      required: true,
    },
  ],
}

export default HajjQuery
