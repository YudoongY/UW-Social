<template>
  <div>
    <NavBar></NavBar>
    <!-- 仅在首页渲染 Welcome -->
    <div v-if="$route.path === '/'" class="welcome-container">
      <Welcome />
      <!-- 大搜索框 -->
      <div class="home-search-bar">
        <input
          v-model="homeSearch"
          @keyup.enter="handleHomeSearch"
          type="text"
          placeholder="Find any campus events you like..."
          class="home-search-input"
          title="search by event title, tag, or organizer"
        />
        <button @click="handleHomeSearch" class="home-search-btn">🔍</button>
      </div>
    </div>
    <div class="events-section">
      <h2>Latest Events</h2>
      <EventList />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/Navbar.vue'; // 确保路径正确
import Welcome from '@/components/Welcome.vue';
import EventList from '@/components/EventList.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const homeSearch = ref('');
const router = useRouter();

function handleHomeSearch() {
  if (homeSearch.value.trim()) {
    router.push({ path: '/events', query: { q: homeSearch.value.trim() } });
    homeSearch.value = '';
  }
}
</script>

<style scoped>
.home-page, .welcome-container {
  margin: 0;
  padding: 0;
  }
  
.home-page {
  min-height: calc(100vh - 100px);
}

.events-section {
  padding: 1rem;
  background: #f5f5f5;
}

.events-section h2 {
  text-align: center;
  color: #333;
  margin-bottom: -0.5rem;
  font-size: 1.5rem;
}

.home-search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0 24px 0;
}
.home-search-input {
  width: 420px;
  max-width: 90vw;
  padding: 1.1rem 1.5rem;
  font-size: 1.2rem;
  border-radius: 32px 0 0 32px;
  border: 1.5px solid #b388eb;
  outline: none;
  transition: border 0.2s;
}
.home-search-input:focus {
  border: 2px solid #6c63ff;
}
.home-search-btn {
  padding: 1.1rem 1.5rem;
  font-size: 1.2rem;
  border-radius: 0 32px 32px 0;
  border: 1.5px solid #b388eb;
  border-left: none;
  background: #b388eb;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.home-search-btn:hover {
  background: #6c63ff;
}
</style>