import { defineStore } from 'pinia'
import axios from 'axios'

interface UserState {
  user: any | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false
  }),
  
  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        // 这里添加登录逻辑
        this.isAuthenticated = true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async logout() {
      try {
        // 这里添加登出逻辑
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        console.error('Logout failed:', error)
        throw error
      }
    },

    async fetchUserProfile() {
      try {
        const response = await axios.get('/api/users/profile')
        this.user = response.data
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        throw error
      }
    }
  },

  getters: {
    userProfile: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  }
}) 