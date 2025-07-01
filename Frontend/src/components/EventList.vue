<template>
  <div class="event-list">
    <div v-if="filteredEvents.length === 0" class="loading">No events found. You may need a VPN.</div>
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
import { useRoute } from 'vue-router';

const props = defineProps<{ category?: string }>();
const eventStore = useEventStore();
const route = useRoute();

const filteredEvents = computed(() => {
  let events = !props.category
    ? eventStore.events
    : eventStore.events.filter(e => e.category === props.category);

  // 搜索过滤
  const q = (route.query.q as string || '').toLowerCase();
  if (q) {
    events = events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.tags && e.tags.join(',').toLowerCase().includes(q)) ||
      (e.organizerName && e.organizerName.toLowerCase().includes(q))
    );
    //考虑更精细的筛选，比如按时间，比如tags selection，比如直接输入09/25搜索09月25日的活动
  }

  // 只显示未过期活动
  const now = new Date();
  events = events.filter(e => {
    const end = typeof e.endtime?.toDate === 'function'
      ? e.endtime.toDate()
      : new Date(e.endtime);
    return end > now;
  });

  // Revert to this if using unsorted ordering
  //   if (!props.category) return eventStore.events;
  // return eventStore.events.filter(e => e.category === props.category);

  // 按开始时间倒序
  return events.slice().sort((a, b) => {
    const aTime = typeof a.startime?.toDate === 'function' ? a.startime.toDate() : new Date(a.startime);
    const bTime = typeof b.startime?.toDate === 'function' ? b.startime.toDate() : new Date(b.startime);
    return aTime.getTime() - bTime.getTime();
  });
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
