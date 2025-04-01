import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userProfile = ref<User | null>(null)
  const auth = getAuth()

  // 初始化用户状态
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
    userProfile.value = user
  })

  // Google 登录
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      userProfile.value = result.user
      isLoggedIn.value = true
      return result.user
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      await signOut(auth)
      userProfile.value = null
      isLoggedIn.value = false
    } catch (error) {
      console.error('退出失败:', error)
      throw error
    }
  }

  return {
    isLoggedIn,
    userProfile,
    loginWithGoogle,
    logout
  }
}) 