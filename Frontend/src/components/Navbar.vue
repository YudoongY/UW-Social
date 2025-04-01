<template>
  <nav>
    <ul class="navbar">
      <div class="nav-items">
        <li>
          <router-link to="/">
            <img src="/images/logo1.png" alt="UW Social Logo" class="logo">
          </router-link>
        </li>
        <li><router-link to="/">🏠 HOME</router-link></li>
        <li><router-link to="/events">🎪 Events</router-link></li>
        <li><router-link to="/publish">🚀 Publish New</router-link></li>

        <div v-if="!userStore.isLoggedIn" class="auth-buttons">
          <router-link to="/login" class="login-link">🔑 Login</router-link>
        </div>

        <div v-else class="user-profile">
          <router-link to="/profile">👨‍🎓 Profile</router-link>
          <div class="user-info">
            Welcome, {{ userStore.userProfile?.displayName }}!
            <a href="#" @click.prevent="handleLogout" class="logout-link">Logout</a>
          </div>
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
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.logo {
  height: 50px;
  width: auto;
}

a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  color: #f0f0f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.logout-link {
  color: #ffeb3b;
}

.logout-link:hover {
  color: #ffd700;
}
</style> 