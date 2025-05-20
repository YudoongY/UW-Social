<template>
  <nav>
    <ul class="navbar">
      <div class="nav-items">
        <div class="left-link">
          <div class="nav-left">
            <li>
              <router-link to="/">
                <img src="/images/logo1.png" alt="UW Social Logo" class="logo">
              </router-link>
            </li>
            <li><router-link to="/">🏠 Home</router-link></li>
            <li><router-link to="/events">🎪 Events</router-link></li>
            <li><router-link to="/publish">🚀 Publish New</router-link></li>
            <li v-if="userStore.isLoggedIn && userStore.userProfile?.displayName">
              <router-link to="/profile">👨‍🎓 Profile</router-link>
            </li>
          </div>
        </div>

        <div class="right-link">
          <div class="user-profile">
            <template v-if="userStore.isLoggedIn && userStore.userProfile?.displayName">
              <span class="welcome-text">Welcome, {{ userStore.userProfile.displayName }}!</span>
              <a href="#" @click.prevent="handleLogout" class="logout-link">Logout</a>
            </template>
            <template v-else>
              <router-link to="/login" class="login-btn">Login</router-link>
            </template>
          </div>
        </div>
      </div>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import '../assets/navbar.css';
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>