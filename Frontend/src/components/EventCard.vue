<template>
  <div class="card event-card" @click="handleCardClick">
    <!-- <img :src="event.imageUrl ? event.imageUrl : '/images/default-event.jpg'" alt="event.title" /> -->
    <h3 :class="['event-title', `category-${event.category}`]">{{ event.title }}</h3>
    <p class="event-time">
      {{ formatEventSchedule(event) }}
    </p>
    <p>Location: {{ event.location }}</p>
    <p class="description">{{ event.description }}</p>
        <p v-if="event.link" class="event-link">
      <a :href="event.link" target="_blank" rel="noopener noreferrer">{{ event.link }}</a>
    </p>
    <button
      v-if="event.organizerId === currentUserId"
      @click.stop="handleDelete"
      class="delete-btn"
    >
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from 'vue';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEventStore } from '../stores/event';
import { useEventDialogStore } from '../stores/eventDialog';
import { formatEventSchedule, type Event } from '../types/event';
import '../assets/eventcard.css';

const props = defineProps<{
  event: Event;
  currentUserId?: string;
}>();

const { event } = toRefs(props);
const eventStore = useEventStore();
const eventDialogStore = useEventDialogStore();

const handleCardClick = () => {
  eventDialogStore.openDialog(props.event);
};

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this event?')) return;
  try {
    await deleteDoc(doc(db, 'events', props.event.id));
    alert('Event deleted.');
    await eventStore.fetchEvents();
  } catch (e) {
    alert('Failed to delete event.');
  }
};
</script>
