<template>
  <div class="card event-card" @click="handleCardClick">
    <!-- <img :src="event.imageUrl ? event.imageUrl : '/images/default-event.jpg'" alt="event.title" /> -->
    <h3 :class="['event-title', `category-${event.category}`]">{{ event.title }}</h3>
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
import '../assets/eventcard.css';

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
