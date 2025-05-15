import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { checkRole } from '../Users/checkRole'

const UpworkProjects: CollectionConfig = {
  slug: 'upwork-projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => !checkRole(['admin'], user as any),
  },
  fields: [
    {
      name: 'country',
      type: 'text',
      required: true,
      label: 'Client Country',
    },
    {
      name: 'client',
      type: 'text',
      required: true,
      label: 'Client Name',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Project Name',
    },
    {
      name: 'assigned',
      type: 'text',
      required: true,
      label: 'Assigned To',
    },
    {
      name: 'tech',
      type: 'text',
      required: true,
      label: 'Tech Stack',
    },
    {
      name: 'budget',
      type: 'text',
      required: true,
      label: 'Budget',
    },
    {
      name: 'milestone',
      type: 'text',
      required: true,
      label: 'Milestone',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Waiting',
          value: 'Waiting',
        },
        {
          label: 'Active',
          value: 'Active',
        },
        {
          label: 'Completed',
          value: 'Completed',
        },
        {
          label: 'Cancelled',
          value: 'Cancelled',
        },
      ],
      defaultValue: 'Waiting',
    },
    {
      name: 'completion',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      label: 'Completion %',
    },
    {
      name: 'remarks',
      type: 'textarea',
      required: true,
      label: 'Remarks',
    },
    {
      name: 'start',
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    {
      name: 'end',
      type: 'date',
      required: true,
      label: 'End Date',
    },
    {
      name: 'next',
      type: 'textarea',
      required: true,
      label: 'Next Action',
    },
    {
      name: 'isActive',
      label: 'Is Active',
      type: 'checkbox',
      defaultValue: true
    },
    {
      name: 'isArchived',
      label: 'Is Archived',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'projectType',
      label: 'Project Type',
      type: 'select',
      options: [
        {
          label: 'AI',
          value: 'ai',
        },
        {
          label: 'NON AI',
          value: 'non-ai',
        },
        {
          label: 'UI/UX & Digital Marketing',
          value: 'ui-ux-marketing',
        },
      ],
      defaultValue: 'non-ai',
    },
    {
      name: 'estimatedTime',
      type: 'text',
      required: false,
      label: 'Estimated Time',
    },
  ],
}

export default UpworkProjects
