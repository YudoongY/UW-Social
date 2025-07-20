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
  padding: 0;
  margin-top: 70px;
  min-height: calc(100vh - 100px);
  background: transparent;
}
</style> 