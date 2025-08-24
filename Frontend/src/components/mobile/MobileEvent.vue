<template>
  <div class="mobile-event-page">
    <!-- Search Bar -->
    <div class="search-container">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Event Name"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="filter-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Event List -->
    <div class="event-list-container">
      <div v-if="isLoading" class="loading">Loading events...</div>
      <div v-else-if="filteredEvents.length === 0" class="no-events">No events found</div>
      <div v-else class="events-list">
        <MobileEventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          @click="handleEventClick(event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '../../stores/event';
import { useUserStore } from '../../stores/user';
import Fuse from 'fuse.js';
import MobileEventCard from './MobileEventCard.vue';
import type { Event } from '../../types/event';

const eventStore = useEventStore();
const userStore = useUserStore();
const route = useRoute();

const searchQuery = ref('');
const isLoading = ref(true);
const events = ref<Event[]>([]);

// Load events from Firebase
onMounted(async () => {
  try {
    if (eventStore.events.length === 0) {
      await eventStore.fetchEvents();
    }
    
    // Filter to only show upcoming events
    const now = new Date();
    events.value = eventStore.events.filter((event: Event) => {
      const end = typeof event.endtime?.toDate === 'function' 
        ? event.endtime.toDate()
        : new Date(event.endtime);
      return end > now;
    });
    
    // Sort by start time (newest first)
    events.value.sort((a: Event, b: Event) => {
      const toDate = (val: any) =>
        typeof val?.toDate === 'function' ? val.toDate() : new Date(val);
      return toDate(b.startTime).getTime() - toDate(a.startTime).getTime();
    });
    
  } catch (error) {
    console.error('Error loading events:', error);
  } finally {
    isLoading.value = false;
  }
});

// Filter events based on search query
const filteredEvents = computed(() => {
  if (!searchQuery.value.trim()) {
    return events.value;
  }
  
  const fuse = new Fuse(events.value, {
    keys: ['title', 'description', 'location', 'tags', 'organizerName'],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  
  return fuse.search(searchQuery.value.trim()).map(result => result.item);
});

// Handle search functionality
const handleSearch = () => {
  // Search is handled by the computed filteredEvents
  console.log('Searching for:', searchQuery.value);
};

// Handle event click (can be used to navigate to event details)
const handleEventClick = (event: Event) => {
  console.log('Event clicked:', event);
  // TODO: Navigate to event details or show modal
};

// Watch for URL query changes to set initial search
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && typeof newQuery === 'string') {
      searchQuery.value = newQuery;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.mobile-event-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px; /* Space for bottom navigation if needed */
}

.search-container {
  padding: 16px;
  background-color: #ad8ae6;
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 25px;
  padding: 8px 16px;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

.filter-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.filter-button:hover {
  color: #ad8ae6;
}

.event-list-container {
  padding: 16px;
}

.loading,
.no-events {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 576px) {
  .mobile-event-page {
    padding-bottom: 60px;
  }
  
  .search-container {
    padding: 12px;
  }
  
  .event-list-container {
    padding: 12px;
  }
}
</style>