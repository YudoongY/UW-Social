<template>
  <div class="event-list">
    <div v-if="filteredEvents.length === 0" class="loading">No events found.</div>
    <div v-else class="events-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @open-card="$emit('open-card', event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useEventStore } from '../stores/event';
import EventCard from './EventCard.vue';

const props = defineProps<{ category?: string }>();
const eventStore = useEventStore();

const filteredEvents = computed(() => {
  if (!props.category) return eventStore.events;
  return eventStore.events.filter(e => e.category === props.category);
});

onMounted(() => {
  if (eventStore.events.length === 0) {
    eventStore.fetchEvents();
  }
});
</script>

<style scoped>
.event-list {
  padding: 2rem;
}

.loading,
.no-events {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 固定3列 */
  gap: 2rem;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 0;
}

@media (max-width: 900px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>