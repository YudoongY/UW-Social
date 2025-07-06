<template>
  <div class="card event-card" @click="handleCardClick">
    <!-- <img :src="event.imageUrl ? event.imageUrl : '/images/default-event.jpg'" alt="event.title" /> -->
    <h3 :class="['event-title', `category-${event.category}`]">{{ event.title }}</h3>
    <p class="event-time">
      {{ formatEventSchedule(event.schedule) }}
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
import { formatEventSchedule, type Event } from '../types/event';
import '../assets/eventcard.css';

const props = defineProps<{
  event: Event;
}>();

const eventDialogStore = useEventDialogStore();

const handleCardClick = () => {
  eventDialogStore.openDialog(props.event);
};
</script>
