import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Event } from '../types/event';

export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([]);
  const selectedEvents = ref<Event[]>([]); // 存储选中的事件

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const eventsQuery = query(eventsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(eventsQuery);

      events.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const selectEvent = (event: Event) => {
    selectedEvents.value.push(event);
  };

  const clearSelectedEvents = () => {
    selectedEvents.value = [];
  };

  return {
    events,
    selectedEvents,
    fetchEvents,
    selectEvent,
    clearSelectedEvents,
  };
});