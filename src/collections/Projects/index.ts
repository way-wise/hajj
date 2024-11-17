import type { CollectionConfig } from 'payload'
import { submitProjectQueries } from './endpoints/submitProjectQueries'
import { checkRole } from '../Users/checkRole'

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    defaultColumns: [
      'client_id',
      'starting_date',
      'deadline',
      'estimated_budget',
      'paid_amount',
      'due_amount',
    ],
    useAsTitle: 'title',
    hidden: ({ user }) => !checkRole(['admin'], user as any),
  },
  endpoints: [
    {
      path: '/projectQueries',
      method: 'post',
      handler: submitProjectQueries,
    },
  ],

  fields: [
    {
      type: 'row',
      fields: [
        {
          label: 'Project Title',
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            width: '75%',
          },
        },
        {
          label: 'Project Status',
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            {
              label: 'Pending',
              value: 'pending',
            },
            {
              label: 'Approved',
              value: 'approved',
            },
            {
              label: 'Decline',
              value: 'decline',
            },
            {
              label: 'On Going',
              value: 'ongoing',
            },
            {
              label: 'Complete',
              value: 'complete',
            },
          ],
        },
      ],
    },
    {
      label: 'Project Description',
      name: 'description',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Project Deadline',
          name: 'deadline',
          type: 'date',
        },
        {
          label: 'Starting Date',
          name: 'starting_date',
          type: 'date',
        },
        {
          label: 'Completion Date',
          name: 'completion_date',
          type: 'date',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Estimated Budget',
          name: 'estimated_budget',
          type: 'number',
        },
        {
          label: 'Payable Amount',
          name: 'payable_amount',
          type: 'number',
        },
        {
          label: 'Paid Amount',
          name: 'paid_amount',
          type: 'number',
        },
        {
          label: 'Due Amount',
          name: 'due_amount',
          type: 'number',
        },
      ],
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'progress',
      type: 'number',
      defaultValue:0,
      min: 0,
      max: 100,
    },
    {
      type: 'array',
      name: 'projectFeatures',
      fields:[
        {
          type: 'row',
          fields: [
            {
              name: 'featureName',
              type: 'text',
              required: true
            },
            {
              name: 'featureProgress',
              type: 'number',
            },
            {
              name: 'isComplete',
              type: 'checkbox',
              defaultValue: false
            }
          ]
        }
      ]
    }
  ],
  timestamps: true,
}

export default Projects
