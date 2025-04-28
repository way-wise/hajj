'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/Auth'

// Add date formatting functions
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
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
  tech: string;
  budget: string;
  milestone: string;
  status: string;
  completion: number;
  remarks: string;
  start: string;
  end: string;
  next: string;
  isActive: boolean;
  projectType: 'ai' | 'non-ai';
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
  tech: string;
  budget: string;
  milestone: string;
  status: 'Waiting' | 'Active' | 'Completed' | 'Cancelled';
  completion: number;
  remarks: string;
  start: string;
  end: string;
  next: string;
  isActive: boolean;
  projectType: 'ai' | 'non-ai';
}

export default function ProjectManagementPage() {
  const { user } = useAuth()
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
    tech: '',
    budget: '',
    milestone: '',
    status: 'Waiting',
    completion: 0,
    remarks: '',
    start: '',
    end: '',
    next: '',
    isActive: true,
    projectType: 'non-ai'
  });

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
        filteredProjects = projects.filter(project => project.projectType === 'ai' && !project.isArchived);
        break;
      case 'NON AI Projects':
        filteredProjects = projects.filter(project => (project.projectType === 'non-ai' || !project.projectType) && !project.isArchived);
        break;
      case 'Archived Projects':
        filteredProjects = projects.filter(project => project.isArchived);
        break;
      case 'All Projects':
        filteredProjects = projects.filter(project => !project.isArchived);
        break;
      default:
        filteredProjects = projects.filter(project => !project.isArchived);
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
        const projectType = project.projectType || project['projectType '] || 'non-ai';
        return {
          ...project,
          projectType: projectType.trim().toLowerCase()
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add a project');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upwork-projects`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      setFormData({
        country: '',
        client: '',
        name: '',
        assigned: '',
        tech: '',
        budget: '',
        milestone: '',
        status: 'Waiting',
        completion: 0,
        remarks: '',
        start: '',
        end: '',
        next: '',
        isActive: true,
        projectType: 'non-ai'
      });
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
      tech: project.tech,
      budget: project.budget,
      milestone: project.milestone,
      status: project.status as 'Waiting' | 'Active' | 'Completed' | 'Cancelled',
      completion: project.completion,
      remarks: project.remarks,
      start: formatDateForInput(project.start),
      end: formatDateForInput(project.end),
      next: project.next,
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upwork-projects/${selectedProject.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management Dashboard</h1>
        <button 
          onClick={() => setShowAddProjectModal(true)}
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
                onClick={() => setShowAddProjectModal(false)}
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
                  <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
                  <input
                    type="text"
                    name="tech"
                    value={formData.tech}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Milestone</label>
                  <input
                    type="text"
                    name="milestone"
                    value={formData.milestone}
                    onChange={handleInputChange}
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
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="start"
                    value={formData.start}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="end"
                    value={formData.end}
                    onChange={handleInputChange}
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
                  rows={3}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next Action</label>
                <textarea
                  name="next"
                  value={formData.next}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows={2}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
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
                  <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
                  <input
                    type="text"
                    name="tech"
                    value={formData.tech}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Milestone</label>
                  <input
                    type="text"
                    name="milestone"
                    value={formData.milestone}
                    onChange={handleInputChange}
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
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="start"
                    value={formData.start}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="end"
                    value={formData.end}
                    onChange={handleInputChange}
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
                  rows={3}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next Action</label>
                <textarea
                  name="next"
                  value={formData.next}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-2 py-1 !rounded-[5px] border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows={2}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
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
        {['All Projects', 'AI Projects', 'NON AI Projects', 'Archived Projects'].map(tab => (
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
                <th className="px-4 py-2 text-left">Tech Stack</th>
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
                <th className="px-4 py-2 text-left">Remarks</th>
                <th className="px-4 py-2 text-left">Start/End Date</th>
                <th className="px-4 py-2 text-left">Next Action</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    Loading projects...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : !Array.isArray(projects) || getFilteredProjects().length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                getFilteredProjects().map((proj, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{proj.country}</td>
                    <td className="px-4 py-2 text-gray-900">{proj.client}</td>
                    <td className="px-4 py-2 text-purple-700">{proj.name}</td>
                    <td className="px-4 py-2 text-gray-900">{proj.assigned}</td>
                    <td className="px-4 py-2 text-gray-900">{proj.tech}</td>
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
                    <td className="px-4 py-2 text-gray-900">{proj.remarks}</td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      <div>From: {formatDateForDisplay(proj.start)}</div>
                      <div>To: {formatDateForDisplay(proj.end)}</div>
                    </td>
                    <td className="px-4 py-2 text-gray-900">{proj.next}</td>
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
                    <p className="flex justify-between">
                      <span className="text-gray-600">Tech Stack:</span>
                      <span className="font-medium text-gray-900">{selectedProject.tech}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Details</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-gray-900">{selectedProject.budget}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Milestone:</span>
                      <span className="font-medium text-gray-900">{selectedProject.milestone}</span>
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
                      <span className="font-medium text-gray-900">{selectedProject.projectType === 'ai' ? 'AI' : 'NON AI'}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Timeline</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium text-gray-900">{formatDateForDisplay(selectedProject.start)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium text-gray-900">{formatDateForDisplay(selectedProject.end)}</span>
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
                      <p className="text-gray-600 mb-1">Next Action:</p>
                      <p className="font-medium bg-white p-2 rounded border text-gray-900">{selectedProject.next}</p>
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
