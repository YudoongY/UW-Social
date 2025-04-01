<template>
  <div class="publish-page">
    <EventForm />
  </div>
</template>

<script setup lang="ts">
import EventForm from '../components/EventForm.vue';
</script>

<style scoped>
.publish-page {
  padding: 2rem;
  margin-top: 100px;
  min-height: calc(100vh - 100px);
  background: #f5f5f5;
}
</style> 