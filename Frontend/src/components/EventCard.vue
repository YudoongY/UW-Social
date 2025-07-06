<template>
  <div class="card event-card" @click="handleCardClick">
    <!-- <img :src="event.imageUrl ? event.imageUrl : '/images/default-event.jpg'" alt="event.title" /> -->
    <h3 :class="['event-title', `category-${event.category}`]">{{ event.title }}</h3>
    <p class="event-time">
      {{ formatSchedule(event.schedule) }}
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


// Format the event schedule for display
const formatSchedule = (schedule: any) => {
  if (!schedule) return '';
  if (schedule.type === 'ONE_TIME') {
    const start = new Date(schedule.startDatetime);
    const end = new Date(schedule.endDatetime);
    const format = (d: Date) => {
      let [time, ampm] = d.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).split(' ');
      ampm = ampm?.toLowerCase() || '';
      const day = d.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
      });
      return `${time}${ampm} ${day}`;
    };
    return `${format(start)} -- ${format(end)}`;
  }
  // TODO: Add formatting for recurring events
  return 'Recurring event';
};

const handleCardClick = () => {
  eventDialogStore.openDialog(props.event);
};
</script>
