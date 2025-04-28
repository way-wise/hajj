"use client"

import { useForm } from "react-hook-form"

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

const ProjectForm = ({ isOpen, onClose, onSubmit, isSubmitting }: ProjectFormProps) => {
  const { register, handleSubmit, reset } = useForm()

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Error submitting project:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input
                {...register('title', { required: true })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project Status</label>
              <select
                {...register('status')}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="ongoing">On Going</option>
                <option value="complete">Complete</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Starting Date</label>
              <input
                {...register('starting_date')}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                type="date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                {...register('deadline')}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                type="date"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Budget</label>
              <input
                {...register('estimated_budget')}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payable Amount</label>
              <input
                {...register('payable_amount')}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                type="number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectForm 