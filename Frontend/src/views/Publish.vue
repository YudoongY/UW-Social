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
  padding: 1rem;
  margin-top: 35px;
  min-height: calc(100vh - 100px);
  background: #f5f5f5;
}
</style> 