import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

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
  const isLoggedIn = ref(false);
  const userProfile = ref<UserProfile | null>(null);
  const auth = getAuth();

  let hasInitialized = false;

  // Promise to ensure components can await user loading
  const loadUser = async (): Promise<void> => {
    if (hasInitialized) return;
    hasInitialized = true;

    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user: User | null) => {
        isLoggedIn.value = !!user;

        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              userProfile.value = {
                ...user,
                ...userDoc.data()
              } as UserProfile;
            } else {
              const plainUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous,
                metadata: {
                  creationTime: user.metadata?.creationTime,
                  lastSignInTime: user.metadata?.lastSignInTime,
                },
                providerData: user.providerData ?? [],
                refreshToken: user.refreshToken,
                tenantId: user.tenantId,
              };
              userProfile.value = plainUser as UserProfile;
            }
          } catch (err) {
            console.error('[UserStore] Failed to load user document:', err);
          }
        } else {
          userProfile.value = null;
        }

        resolve();
      });
    });
  };

  // Google 登录
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      userProfile.value = result.user as UserProfile;
      isLoggedIn.value = true;
      return result.user;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  // 退出登录
  const logout = async () => {
    try {
      await signOut(auth);
      userProfile.value = null;
      isLoggedIn.value = false;
    } catch (error) {
      console.error('退出失败:', error);
      throw error;
    }
  };

  // 更新用户资料
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!userProfile.value?.uid) return;

    try {
      const userRef = doc(db, 'users', userProfile.value.uid);
      await updateDoc(userRef, profile);

      userProfile.value = {
        ...userProfile.value,
        ...profile
      };
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw error;
    }
  };

  // 判断是否为当前用户
  const isOwner = (uid: string) => {
    return userProfile.value?.uid === uid;
  };

  return {
    isLoggedIn,
    userProfile,
    loginWithGoogle,
    logout,
    updateUserProfile,
    loadUser,
    isOwner
  };
});
