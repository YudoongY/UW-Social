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
            <!-- 下划线-->
            <!-- 搜索框放在左侧导航项后面 -->
            <div class="navbar-search">
              <input
                v-model="navbarSearch"
                @keyup.enter="handleNavbarSearch"
                type="text"
                placeholder="Search events..."
                class="navbar-search-input"
                title="type in event title, tag, or organizer's name"
              />
            </div>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const navbarSearch = ref('');

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

function handleNavbarSearch() {
  if (navbarSearch.value.trim()) {
    router.push({ path: '/events', query: { q: navbarSearch.value.trim() } });
    navbarSearch.value = '';
  }
}
</script>

<style scoped>
.navbar-search {
  display: inline-block;
  margin-right: 1.5rem;
}
.navbar-search-input {
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 160px;
  outline: none;
  transition: border 0.2s;
}
.navbar-search-input:focus {
  border: 1.5px solid #6c63ff;
}
</style>