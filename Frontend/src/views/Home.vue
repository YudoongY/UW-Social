<template>
  <div class="home-page">
    <div class="hero-section">
      <h1>欢迎来到 UW Social</h1>
      <p>发现精彩活动，结识新朋友</p>
      <router-link to="/publish" class="cta-button">
        <span class="icon">🚀</span>
        发布新活动
      </router-link>
    </div>

    <div class="events-section">
      <h2>最新活动</h2>
      <EventList />
    </div>
  </div>
</template>

<script setup lang="ts">
import EventList from '../components/EventList.vue';
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 100px);
  margin-top: 100px;
}

.hero-section {
  background: linear-gradient(135deg, #b388eb 0%, #9c6ad6 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #b388eb;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.icon {
  font-size: 1.2rem;
}

.events-section {
  padding: 4rem 2rem;
  background: #f5f5f5;
}

.events-section h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}
</style> 