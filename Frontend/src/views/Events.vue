<template>
  <div class="events-page">
    <div class="events-header">
      <h1>活动列表</h1>
      <router-link to="/publish" class="publish-btn">
        <span class="icon">🚀</span>
        发布新活动
      </router-link>
    </div>
    <EventList />
  </div>
</template>

<script setup lang="ts">
import EventList from '../components/EventList.vue';
</script>

<style scoped>
.events-page {
  padding: 2rem;
  margin-top: 100px;
  min-height: calc(100vh - 100px);
  background: #f5f5f5;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  color: #333;
  margin: 0;
  font-size: 2rem;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #b388eb;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.publish-btn:hover {
  background: #9c6ad6;
}

.icon {
  font-size: 1.2rem;
}
</style> 