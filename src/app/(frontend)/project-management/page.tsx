'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'

// Add date formatting functions
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

interface Project {
  id: string;
  country: string;
  client: string;
  name: string;
  assigned: string;
  budget: string;
  paidAmount: string;
  milestone: string;
  status: string;
  completion: number;
  remarks: string;
  startDate: string;
  endDate: string;
  estimatedTime: string;
  isActive: boolean;
  projectType: 'ai' | 'non-ai' | 'ui-ux' | 'digital-marketing';
  isArchived: boolean;
  updatedAt?: string;
}

const statusColors: Record<string, string> = {
  Waiting: 'bg-yellow-400 text-white',
  Active: 'bg-green-400 text-white',
  Completed: 'bg-blue-400 text-white',
  Cancelled: 'bg-red-400 text-white',
};

interface ProjectFormData {
  country: string;
  client: string;
  name: string;
  assigned: string;
  budget: string | number;
  paidAmount: string | number;
  milestone: string;
  status: 'Waiting' | 'Active' | 'Completed' | 'Cancelled';
  completion: number;
  remarks: string;
  startDate: string;
  endDate: string;
  estimatedTime: string;
  isActive: boolean;
  projectType: 'ai' | 'non-ai' | 'ui-ux' | 'digital-marketing';
}

export default function ProjectManagementPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('NON AI Projects');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>('asc');
  const [formData, setFormData] = useState<ProjectFormData>({
    country: '',
    client: '',
    name: '',
    assigned: '',
    budget: '',
    paidAmount: '',
    milestone: '',
    status: 'Waiting',
    completion: 0,
    remarks: '',
    startDate: '',
    endDate: '',
    estimatedTime: '',
    isActive: true,
    projectType: 'non-ai'
  });

  // Helper function to reset form data
  const resetFormData = () => {
    setFormData({
      country: '',
      client: '',
      name: '',
      assigned: '',
      budget: '',
      paidAmount: '',
      milestone: '',
      status: 'Waiting',
      completion: 0,
      remarks: '',
      startDate: '',
      endDate: '',
      estimatedTime: '',
      isActive: true,
      projectType: 'non-ai'
    });
  };

  // Add sorting function
  const handleSort = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else if (sortOrder === 'desc') {
      setSortOrder('asc');
    }
  };

  // Add function to handle archiving projects
  const handleArchiveProject = async (project: Project) => {
    if (!user) {
      alert('Please log in to archive a project');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upwork-projects/${project.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...project,
          isArchived: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive project');
      }

      await fetchProjects(); // Refresh the projects list
    } catch (error) {
      console.error('Error archiving project:', error);
      alert(`Failed to archive project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Modify getFilteredProjects to include archive filtering
  const getFilteredProjects = () => {
    if (!projects) return [];

    let filteredProjects;
    switch (activeTab) {
      case 'AI Projects':
        filteredProjects = projects.filter(project =>
          project.projectType === 'ai' &&
          !project.isArchived &&
          project.status !== 'Cancelled'
        );
        break;
      case 'NON AI Projects':
        filteredProjects = projects.filter(project =>
          project.projectType === 'non-ai' &&
          !project.isArchived &&
          project.status !== 'Cancelled'
        );
        break;
      case 'UI/UX Projects':
        filteredProjects = projects.filter(project =>
          project.projectType === 'ui-ux' &&
          !project.isArchived &&
          project.status !== 'Cancelled'
        );
        break;
      case 'Digital Marketing':
        filteredProjects = projects.filter(project =>
          project.projectType === 'digital-marketing' &&
          !project.isArchived &&
          project.status !== 'Cancelled'
        );
        break;
      case 'Completed Projects':
        filteredProjects = projects.filter(project => project.isArchived);
        break;
      case 'Future Prospects':
        filteredProjects = projects.filter(project =>
          project.status === 'Cancelled' &&
          !project.isArchived
        );
        break;
      case 'All Projects':
        filteredProjects = projects.filter(project =>
          !project.isArchived &&
          project.status !== 'Cancelled'
        );
        break;
      default:
        filteredProjects = projects.filter(project =>
          !project.isArchived &&
          project.status !== 'Cancelled'
        );
    }

    // Apply sorting if sortOrder is set
    if (sortOrder) {
      filteredProjects = [...filteredProjects].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.completion - b.completion;
        } else {
          return b.completion - a.completion;
        }
      });
    }

    return filteredProjects;
  };

    useEffect(() => {
    if(!user) {
      router.push('/signin')
    }
  }, [user, router])

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upwork-projects?limit=1000`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      const projects = data.docs;
      console.log('Raw fetched projects:', projects);

      // Validate each project has required fields
      const validProjects = projects.filter(project => {
        const isValid = project &&
          typeof project === 'object' &&
          'country' in project &&
          'client' in project &&
          'name' in project;

        if (!isValid) {
          console.warn('Invalid project data:', project);
        }
        return isValid;
      });

      // Normalize project type field
      const processedProjects = validProjects.map(project => {
        // Handle both old and new field names
        let projectType = project.projectType || project['projectType '] || 'non-ai';
        projectType = projectType.trim().toLowerCase();

        // Migrate old 'ui-ux-marketing' to 'ui-ux' (you can manually change to 'digital-marketing' if needed)
        if (projectType === 'ui-ux-marketing') {
          projectType = 'ui-ux'; // Default migration to UI/UX
        }

        return {
          ...project,
          projectType
        };
      });

      console.log('Processed projects with normalized types:', processedProjects);
      setProjects(processedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Convert numeric inputs to numbers
    let processedValue: string | number | boolean = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add a project');
      return;
    }

            // Validate required fields
    const requiredFields = [
      'country', 'client', 'name', 'assigned',
      'budget', 'paidAmount', 'milestone', 'status', 'completion',
      'startDate', 'endDate', 'estimatedTime', 'projectType'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof ProjectFormData];
      // Handle numeric fields (completion can be 0, which is valid)
      if (field === 'completion') {
        return value === '' || value === null || value === undefined;
      }
      // Handle other numeric fields that can be 0
      if (field === 'budget' || field === 'paidAmount') {
        return value === '' || value === null || value === undefined;
      }
      // For string fields, check if empty or just whitespace
      return !value || (typeof value === 'string' && value.trim() === '');
    });



    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

        try {
      // Prepare data with default values for removed fields and proper type conversion
      const createData = {
        ...formData,
        // Convert numbers to strings where API expects text
        budget: String(formData.budget),
        paidAmount: Number(formData.paidAmount),
        completion: Number(formData.completion),
        // Add default values for removed fields
        tech: 'Not specified',
        next: 'No action specified',
        // Ensure boolean fields are properly set
        isActive: formData.isActive ?? true,
        isArchived: false,
      };

      console.log('Sending form data:', createData);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upwork-projects`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Add failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to add project: ${response.statusText}`);
      }

      // Reset form and close modal
      resetFormData();
      setShowAddProjectModal(false);

      // Refresh the projects list
      await fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      alert(`Failed to add project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      country: project.country,
      client: project.client,
      name: project.name,
      assigned: project.assigned,
      budget: project.budget,
      paidAmount: project.paidAmount !== undefined && project.paidAmount !== null ? project.paidAmount : (project.milestone || ''), // Handle backward compatibility
      milestone: project.milestone,
      status: project.status as 'Waiting' | 'Active' | 'Completed' | 'Cancelled',
      completion: project.completion,
      remarks: project.remarks,
      startDate: project.startDate || '', // Handle backward compatibility
      endDate: project.endDate || '', // Handle backward compatibility
      estimatedTime: project.estimatedTime,
      isActive: project.isActive ?? true,
      projectType: project.projectType
    });
    setShowEditModal(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !user) {
      alert('Please log in to update a project');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data with backward compatibility for old required fields and proper type conversion
      const updateData = {
        ...formData,
        // Convert numbers to strings where API expects text
        budget: String(formData.budget),
        paidAmount: Number(formData.paidAmount),
        completion: Number(formData.completion),
        // Add default values for removed fields to maintain compatibility
        tech: (selectedProject as any).tech || 'Not specified',
        next: (selectedProject as any).next || 'No action specified',
        // Ensure milestone is handled correctly for backward compatibility
        milestone: formData.milestone || selectedProject.milestone || 'No milestone',
        // Ensure boolean fields are properly set
        isActive: formData.isActive ?? true,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upwork-projects/${selectedProject.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Update failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to update project: ${response.statusText}`);
      }

      const updatedProject = await response.json();
      console.log('Project updated successfully:', updatedProject);

      // Reset form and close modal
      resetFormData();
      setShowEditModal(false);
      setSelectedProject(null);
      await fetchProjects(); // Refresh the projects list
    } catch (error) {
      console.error('Error updating project:', error);
      alert(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to handle showing project details
  const handleShowDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  // Add function to calculate total paid amount
  const calculateTotalPaidAmount = () => {
    const filteredProjects = getFilteredProjects();
    console.log('Calculating total for projects:', filteredProjects.length);

        const total = filteredProjects.reduce((total, project) => {
      // Handle different formats of paidAmount data (with backward compatibility)
      let paidAmount = 0;
      const amountField = project.paidAmount !== undefined && project.paidAmount !== null ? project.paidAmount : project.milestone;
      if (typeof amountField === 'number') {
        paidAmount = amountField;
      } else if (typeof amountField === 'string') {
        // Remove any currency symbols, commas, and spaces, then parse
        const cleanAmount = amountField.replace(/[$,€£¥₹\s]/g, '');
        paidAmount = parseFloat(cleanAmount) || 0;
      }

      console.log(`Project: ${project.name}, Paid Amount: ${amountField}, Parsed: ${paidAmount}`);
      return total + paidAmount;
    }, 0);

    console.log('Total calculated:', total);
    return total;
  };

  // Add function to calculate total budget
  const calculateTotalBudget = () => {
    const filteredProjects = getFilteredProjects();
    console.log('Calculating total budget for projects:', filteredProjects.length);

    const total = filteredProjects.reduce((total, project) => {
      // Handle different formats of budget data
      let budgetAmount = 0;
      if (typeof project.budget === 'number') {
        budgetAmount = project.budget;
      } else if (typeof project.budget === 'string') {
        // Remove any currency symbols, commas, and spaces, then parse
        const cleanAmount = project.budget.replace(/[$,€£¥₹\s]/g, '');
        budgetAmount = parseFloat(cleanAmount) || 0;
      }

      console.log(`Project: ${project.name}, Budget: ${project.budget}, Parsed: ${budgetAmount}`);
      return total + budgetAmount;
    }, 0);

    console.log('Total budget calculated:', total);
    return total;
  };

  // Add function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management Dashboard</h1>
                <button
          onClick={() => {
            resetFormData();
            setShowAddProjectModal(true);
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Project
        </button>
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Project</h2>
                            <button
                onClick={() => {
                  resetFormData();
                  setShowAddProjectModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Name</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <input
                    type="text"
                    name="assigned"
                    value={formData.assigned}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="Waiting">Waiting</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Type</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="ai">AI</option>
                    <option value="non-ai">NON AI</option>
                    <option value="ui-ux">UI/UX</option>
                    <option value="digital-marketing">Digital Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Completion %</label>
                  <input
                    type="number"
                    name="completion"
                    value={formData.completion}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Start Date</label>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    placeholder="e.g., January 15, 2024"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project End Date</label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    placeholder="e.g., March 30, 2024"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Milestone</label>
                  <input
                    type="text"
                    name="milestone"
                    value={formData.milestone}
                    onChange={handleInputChange}
                    placeholder="e.g., First phase completed, MVP delivered"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Estimated Time</label>
                  <input
                    type="text"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 months, 6 weeks"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows={2}
                  placeholder="Any additional notes or comments"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    resetFormData();
                    setShowAddProjectModal(false);
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Project</h2>
                            <button
                onClick={() => {
                  resetFormData();
                  setShowEditModal(false);
                  setSelectedProject(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Name</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <input
                    type="text"
                    name="assigned"
                    value={formData.assigned}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="Waiting">Waiting</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Type</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="ai">AI</option>
                    <option value="non-ai">NON AI</option>
                    <option value="ui-ux">UI/UX</option>
                    <option value="digital-marketing">Digital Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Completion %</label>
                  <input
                    type="number"
                    name="completion"
                    value={formData.completion}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Start Date</label>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    placeholder="e.g., January 15, 2024"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project End Date</label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    placeholder="e.g., March 30, 2024"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Milestone</label>
                  <input
                    type="text"
                    name="milestone"
                    value={formData.milestone}
                    onChange={handleInputChange}
                    placeholder="e.g., First phase completed, MVP delivered"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Estimated Time</label>
                  <input
                    type="text"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 months, 6 weeks"
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows={2}
                  placeholder="Any additional notes or comments"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    resetFormData();
                    setShowEditModal(false);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['All Projects', 'AI Projects', 'NON AI Projects', 'UI/UX Projects', 'Digital Marketing', 'Future Prospects', 'Completed Projects'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-purple-500 text-white' : 'bg-white text-black border'} font-medium`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      {/* <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Project Filters</span>
          <div className="flex gap-2">
            <button
              className="border px-3 py-1 rounded hover:bg-gray-100"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button className="border px-3 py-1 rounded hover:bg-gray-100">Reset</button>
          </div>
        </div>
        {showFilters && (
          <div className="mt-4 text-gray-500">No filters implemented yet.</div>
        )}
      </div> */}

      {/* Projects Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Projects Overview</h2>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left">Client Country</th>
                <th className="px-4 py-2 text-left">Client Name</th>
                <th className="px-4 py-2 text-left">Project Name</th>
                <th className="px-4 py-2 text-left">Assigned To</th>
                <th className="px-4 py-2 text-left">Budget</th>
                <th className="px-4 py-2 text-left">Paid Amount</th>
                <th className="px-4 py-2 text-left">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={handleSort}>
                    Completion %
                    <span className="text-gray-400">
                      {sortOrder === 'asc' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : sortOrder === 'desc' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
                <th className="px-4 py-2 text-left">Start/End Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Loading projects...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : !Array.isArray(projects) || getFilteredProjects().length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                getFilteredProjects().map((proj, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{proj.country}</td>
                    <td className="px-4 py-2 text-gray-900 uppercase">{proj.client}</td>
                    <td className="px-4 py-2 text-purple-700">{proj.name}</td>
                    <td className="px-4 py-2 text-gray-900">{proj.assigned}</td>
                    <td className="px-4 py-2 text-gray-900">${proj.budget}</td>
                    <td className="px-4 py-2 text-gray-900">${proj.paidAmount !== undefined && proj.paidAmount !== null ? proj.paidAmount : (proj.milestone || 0)}</td>
                    <td className="px-4 py-2 w-40">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded h-2">
                          <div
                            className="h-2 rounded bg-purple-500"
                            style={{ width: `${proj.completion}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{proj.completion}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      <div>From: {proj.startDate || 'N/A'} {proj.estimatedTime ? `(${proj.estimatedTime})` : ''}</div>
                      <div>To: {proj.endDate || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          className="border p-1 rounded text-gray-900 hover:bg-gray-100"
                          title="View Details"
                          onClick={() => handleShowDetails(proj)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          className="border p-1 rounded text-gray-900 hover:bg-gray-100"
                          title="Edit"
                          onClick={() => handleEditClick(proj)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
                          </svg>
                        </button>
                        {proj.completion === 100 && !proj.isArchived && (
                          <button
                            className="border p-1 rounded text-gray-900 hover:bg-yellow-50 text-yellow-600 border-yellow-200"
                            title="Archive Project"
                            onClick={() => handleArchiveProject(proj)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total Paid Amount Summary */}
        {!isLoading && !error && getFilteredProjects().length > 0 && (
          <div className="mt-6 bg-white rounded shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
                <p className="text-sm text-gray-600">Total projects: {getFilteredProjects().length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(calculateTotalBudget())}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Paid Amount</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(calculateTotalPaidAmount())}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {showDetailsModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
                <p className="text-gray-500 mt-1">Project Details</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Client Information</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-medium text-gray-900">{selectedProject.country}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Client Name:</span>
                      <span className="font-medium text-gray-900">{selectedProject.client}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Information</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="font-medium text-gray-900">{selectedProject.assigned}</span>
                    </p>

                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Details</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-gray-900">${selectedProject.budget}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Paid Amount:</span>
                      <span className="font-medium text-gray-900">${selectedProject.paidAmount !== undefined && selectedProject.paidAmount !== null ? selectedProject.paidAmount : (selectedProject.milestone || 0)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Milestone:</span>
                      <span className="font-medium text-gray-900">{selectedProject.milestone || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Status</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white`}>
                        {selectedProject.status}
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-gray-600">Completion:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded h-2">
                          <div
                            className="h-2 rounded bg-purple-500"
                            style={{ width: `${selectedProject.completion}%` }}
                          />
                        </div>
                        <span className="font-medium text-gray-900">{selectedProject.completion}%</span>
                      </div>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Project Type:</span>
                      <span className="font-medium text-gray-900">
                        {selectedProject.projectType === 'ai' ? 'AI' :
                         selectedProject.projectType === 'non-ai' ? 'NON AI' :
                         selectedProject.projectType === 'ui-ux' ? 'UI/UX' :
                         selectedProject.projectType === 'digital-marketing' ? 'Digital Marketing' :
                         selectedProject.projectType}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Timeline</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium text-gray-900">{selectedProject.startDate || 'N/A'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium text-gray-900">{selectedProject.endDate || 'N/A'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium text-gray-900">{selectedProject.estimatedTime || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600 mb-1">Remarks:</p>
                      <p className="font-medium bg-white p-2 rounded border text-gray-900">{selectedProject.remarks}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 mb-1">Last Edited:</p>
                      <p className="font-medium bg-white p-2 rounded border text-gray-900">
                        {selectedProject.updatedAt ? formatDateForDisplay(selectedProject.updatedAt) : 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedProject.completion === 100 && !selectedProject.isArchived && (
                <button
                  onClick={() => {
                    handleArchiveProject(selectedProject);
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Archive Project
                </button>
              )}
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditClick(selectedProject);
                }}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Edit Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
