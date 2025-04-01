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
  margin-top: 100px;
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