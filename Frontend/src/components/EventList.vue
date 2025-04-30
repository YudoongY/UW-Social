<template>
  <div class="event-list">
    <div v-if="loading" class="loading">Loading events...</div>
    <div v-else-if="events.length === 0" class="no-events">No events found.</div>
    <div v-else class="events-grid">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import EventCard from './EventCard.vue';
import type { Event } from '../types/event';

const events = ref<Event[]>([]);
const loading = ref(true);

const fetchEvents = async () => {
  try {
    console.log('Fetching events...');
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(eventsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(eventsQuery);

    events.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];

    console.log('Fetched events:', events.value);
  } catch (error) {
    console.error('Failed to fetch events:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
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
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .events-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>