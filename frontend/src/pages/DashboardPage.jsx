import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010'

export default function DashboardPage() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/api/applications`)
      setApplications(response.data.applications || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const createNewApp = async () => {
    try {
      setIsCreating(true)
      const newApp = {
        name: `New Application ${applications.length + 1}`,
        slug: `app-${Date.now()}`,
        description: 'A new BuildEasy application'
      }

      const response = await axios.post(`${API_URL}/api/applications`, newApp)
      setApplications([response.data.application, ...applications])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create application')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteApp = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      await axios.delete(`${API_URL}/api/applications/${id}`)
      setApplications(applications.filter(app => app.id !== id))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete application')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-2 text-gray-600">
          Build and manage your no-code applications
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Button */}
      <div className="mb-6">
        <button
          onClick={createNewApp}
          disabled={isCreating}
          className="btn btn-primary disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : '+ New Application'}
        </button>
      </div>

      {/* Applications Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-4">Create your first application to get started</p>
          <button onClick={createNewApp} className="btn btn-primary">
            Create First App
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  app.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  app.status === 'published' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {app.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                {app.description || 'No description'}
              </p>

              <div className="text-xs text-gray-500 mb-4">
                Created {new Date(app.created_at).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/builder/${app.id}`}
                  className="btn btn-primary flex-1 text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteApp(app.id)}
                  className="btn btn-secondary"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">{applications.length}</div>
          <div className="text-gray-600 mt-2">Total Applications</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">
            {applications.filter(a => a.status === 'published').length}
          </div>
          <div className="text-gray-600 mt-2">Published</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-600">
            {applications.filter(a => a.status === 'draft').length}
          </div>
          <div className="text-gray-600 mt-2">Drafts</div>
        </div>
      </div>
    </div>
  )
}
