<template>
  <div class="home-page">
    <div class="events-section">
      <h2>Latest Events</h2>
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
}

.events-section {
  padding: 1rem;
  background: #f5f5f5;
}

.events-section h2 {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}
</style> 