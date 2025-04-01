import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData: any[];
  refreshToken: string;
  tenantId: string | null;
}

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userProfile = ref<UserProfile | null>(null)
  const auth = getAuth()

  // 初始化用户状态
  onAuthStateChanged(auth, async (user) => {
    isLoggedIn.value = !!user
    if (user) {
      // 获取用户额外信息
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        userProfile.value = {
          ...user,
          ...userDoc.data()
        } as UserProfile
      } else {
        userProfile.value = user as UserProfile
      }
    } else {
      userProfile.value = null
    }
  })

  // Google 登录
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      userProfile.value = result.user as UserProfile
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

  // 更新用户资料
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!userProfile.value?.uid) return

    try {
      const userRef = doc(db, 'users', userProfile.value.uid)
      await updateDoc(userRef, profile)
      
      // 更新本地状态
      userProfile.value = {
        ...userProfile.value,
        ...profile
      }
    } catch (error) {
      console.error('更新用户资料失败:', error)
      throw error
    }
  }

  return {
    isLoggedIn,
    userProfile,
    loginWithGoogle,
    logout,
    updateUserProfile
  }
}) 