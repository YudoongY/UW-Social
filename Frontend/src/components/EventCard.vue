<template>
  <div class="card event-card" @click="handleCardClick">
    <!-- <img :src="event.imageUrl ? event.imageUrl : '/images/default-event.jpg'" alt="event.title" /> -->
    <h3 :class="['event-title', `category-${event.category}`]">{{ event.title }}</h3>
    <p class="event-time">
      {{ formatDate(event.startime) }}--{{ formatDate(event.endtime) }}
    </p>
    <p>Location: {{ event.location }}</p>
    <p class="description">{{ event.description }}</p>
        <p v-if="event.link" class="event-link">
      <a :href="event.link" target="_blank" rel="noopener noreferrer">{{ event.link }}</a>
    </p>
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
    // 获取小时、分钟和 AM/PM
    let [time, ampm] = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).split(' ');
    ampm = ampm?.toLowerCase() || '';
    // 获取月和日
    const day = date.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
    });
    return `${time}${ampm} ${day}`;
};

const handleCardClick = () => {
  eventDialogStore.openDialog(props.event);
};
</script>
