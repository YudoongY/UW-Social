<template>
  <nav>
    <ul class="navbar">
      <div class="nav-items">
        <div class="left-link">
          <div class="nav-left">
            <li>
              <router-link to="/">
                <img src="/svg/uw-social-logo1.svg" alt="UW Social Logo" class="logo">
                <img src="/svg/UW-SOCIAL.svg" alt="UW SOCIAL" class="logo-text">
              </router-link>
            </li>
            <div :class="{ active: $route.path === '/' }">
              <li><router-link to="/">HOME</router-link></li>
            </div>
            <div :class="{ active: $route.path === '/events' }">
              <li><router-link to="/events">EVENTS</router-link></li>
            </div>
            <div :class="{ active: $route.path === '/clubs' }">
              <li><router-link to="/clubs">CLUBS</router-link></li>
            </div>
            <div :class="{ active: $route.path === '/publish' }">
              <li><router-link to="/publish">PUBLISH NEW</router-link></li>
            </div>
            <div v-if="userStore.isLoggedIn && userStore.userProfile?.displayName" :class="{ active: $route.path === '/profile' }">
              <li><router-link to="/profile">PROFILE</router-link></li>
            </div>
          </div>
        </div>

        <div class="right-link">
          <!-- 搜索框放在右侧导航项前面 -->
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
import { useRouter } from 'vue-router';

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