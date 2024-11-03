import type { CollectionConfig } from 'payload'

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
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          label: 'Project Title',
          name: 'title',
          type: 'text',
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
      name: 'clients',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

export default Projects
