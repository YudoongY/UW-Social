<template>
  <div class="event-list">
    <div v-if="filteredEvents.length === 0" class="loading">No events found. You may need a VPN.</div>
    <div v-else class="events-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        :currentUserId="userStore.userProfile?.uid"
        @open-card="$emit('open-card', event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import Fuse from 'fuse.js';
import { useEventStore } from '../stores/event';
import EventCard from './EventCard.vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user'; // Add this

const props = defineProps<{ category?: string }>();
const eventStore = useEventStore();
const userStore = useUserStore(); // Add this
const route = useRoute();

const filteredEvents = computed(() => {
  let events = !props.category
    ? eventStore.events
    : eventStore.events.filter(e => e.category === props.category);

    // 只显示未过期活动
  const now = new Date();
  events = events.filter(e => {
    const end = typeof e.endtime?.toDate === 'function'
      ? e.endtime.toDate()
      : new Date(e.endtime);
    return end > now;
  });

  // 按开始时间倒序
  events = events.slice().sort((a, b) => {
    const aTime = typeof a.startime?.toDate === 'function' ? a.startime.toDate() : new Date(a.startime);
    const bTime = typeof b.startime?.toDate === 'function' ? b.startime.toDate() : new Date(b.startime);
    return bTime.getTime() - aTime.getTime();
  });

  const q = (route.query.q as string || '').trim();
  if (!q) return events;
  // Use Fuse.js for fuzzy search and relevance ranking
  const fuse = new Fuse(events, {
    keys: [
      'title',
      'description',
      'location',
      'tags',
      'organizerName',
    ],
    threshold: 0.4, // adjust as needed for fuzziness
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  return fuse.search(q).map(result => result.item);
});

onMounted(() => {
    if (eventStore.events.length === 0) {
        eventStore.fetchEvents();
    }
});
</script>

<style scoped>
.event-list {
    padding: 1rem;
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
    gap: 2.1rem 1.5rem;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 0;
}

@media (max-width: 900px) {
    .events-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 576px) {
    .event-list {
        padding: 0.2rem; /* 左右边距几乎为0 */
    }
    .events-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem 0.5rem;
        width: 100%;
        box-sizing: border-box;
        padding: 0.2rem 0;
    }
}
</style>
