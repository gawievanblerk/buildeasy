import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:4000'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login with auth server
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axios.post(`${AUTH_SERVER_URL}/api/auth/login`, {
            email,
            password
          })

          // Response structure: { success, message, data: { user, organization, licenses, accessToken } }
          const { data } = response.data
          const { user, organization, licenses, accessToken } = data
          const refreshToken = data.refreshToken || null

          // Check if user has BuildEasy access from licenses
          const hasBuildeasyLicense = licenses && licenses.buildeasy

          // For now, allow all authenticated users to access BuildEasy
          // TODO: Uncomment this when BuildEasy licenses are set up
          // if (!hasBuildeasyLicense) {
          //   throw new Error('You do not have access to BuildEasy. Please contact support.')
          // }

          set({
            user: { ...user, organization },
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

          // Configure axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

          return { success: true }
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Login failed'
          set({ isLoading: false, error: errorMessage, isAuthenticated: false })
          return { success: false, error: errorMessage }
        }
      },

      // Logout
      logout: async () => {
        const { refreshToken } = get()

        try {
          await axios.post(`${AUTH_SERVER_URL}/api/auth/logout`, { refreshToken })
        } catch (error) {
          console.error('Logout error:', error)
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        })

        delete axios.defaults.headers.common['Authorization']
      },

      // Refresh token
      refreshAccessToken: async () => {
        const { refreshToken } = get()

        if (!refreshToken) {
          return false
        }

        try {
          const response = await axios.post(`${AUTH_SERVER_URL}/api/auth/refresh`, {
            refreshToken
          })

          const { accessToken } = response.data
          set({ accessToken })
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

          return true
        } catch (error) {
          console.error('Token refresh failed:', error)
          get().logout()
          return false
        }
      },

      // Verify token and get user profile
      verifyAuth: async () => {
        const { accessToken } = get()

        if (!accessToken) {
          return false
        }

        try {
          const response = await axios.get(`${AUTH_SERVER_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })

          set({ user: response.data.user, isAuthenticated: true })
          return true
        } catch (error) {
          // Try to refresh token
          return await get().refreshAccessToken()
        }
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'buildeasy-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Configure axios interceptor for automatic token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const success = await useAuthStore.getState().refreshAccessToken()

      if (success) {
        return axios(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)
