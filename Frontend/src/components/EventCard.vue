<template>
  <div class="card event-card" @click="handleCardClick">
    <!-- <img :src="event.imageUrl ? event.imageUrl : '/images/default-event.jpg'" alt="event.title" /> -->
    <h3>{{ event.title }}</h3>
    <p class="event-time">
      Starts at {{ formatDate(event.startime) }}<br>
      Ends at {{ formatDate(event.endtime) }}
    </p>
    <p>Location: {{ event.location }}</p>
    <p class="description">{{ event.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { useEventDialogStore } from '../stores/eventDialog';
import type { Event } from '../types/event';

const props = defineProps<{
  event: Event;
}>();

const eventDialogStore = useEventDialogStore();

// 只显示年月日和小时分钟
const formatDate = (ts: any) => {
  if (!ts) return '';
  const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
  // 获取时间和日期部分
  const time = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const day = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return `${time} ${day}`;
};

const handleCardClick = () => {
  eventDialogStore.openDialog(props.event);
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 15px;
  width: 300px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.event-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.event-card h3 {
  margin: 10px 0;
  color: #333;
  font-size: 1.2em;
}

.event-card p {
  color: #666;
  margin: 8px 0;
  font-size: 0.9em;
}

.event-time {
  font-size: 1.05em;
  font-weight: bold;
  color: #2a4d8f;
  margin: 10px 0 6px 0;
  line-height: 1.5;
}

.event-card .description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  height: 4.5em; /* Adjust based on font size and line height */
}
</style>