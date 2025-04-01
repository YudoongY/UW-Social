<template>
  <nav>
    <ul class="navbar">
      <div class="nav-items">
        <div class="nav-left">
          <li>
            <router-link to="/">
              <img src="/images/logo1.png" alt="UW Social Logo" class="logo">
            </router-link>
          </li>
          <li><router-link to="/">🏠 Home</router-link></li>
          <li><router-link to="/events">🎪 Events</router-link></li>
          <li><router-link to="/publish">🚀 Publish New</router-link></li>
        </div>

        <div class="user-profile">
          <router-link to="/profile">👨‍🎓 Profile</router-link>
          <template v-if="userStore.isLoggedIn">
            <span class="welcome-text">Welcome, {{ userStore.userProfile?.displayName }}!</span>
            <a href="#" @click.prevent="handleLogout" class="logout-link">Logout</a>
          </template>
        </div>
      </div>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出失败:', error)
  }
}
</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #b388eb;
  padding: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  margin: 20px;
  padding: 0 20px;
  height: 100px;
  width: 96%;
  margin: auto;
  overflow: hidden;
}

.nav-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.logo {
  height: 50px;
  width: auto;
}

a, .welcome-text {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  color: #f0f0f0;
}

.logout-link {
  color: #ffeb3b;
  text-decoration: none;
  font-weight: bold;
}

.logout-link:hover {
  color: #ffd700;
}
</style> 