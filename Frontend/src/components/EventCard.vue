<template>
  <div class="card event-card" @click="$emit('open-card', event)">
    <img :src="event.imageUrl || '/images/wavingdog.jpg'" alt="Event Image" />
    <div class="event-card-content">
      <!-- 左侧内容 -->
      <div class="event-card-left">
        <h3 class="event-title">{{ event.title }}</h3>
        <p class="description">{{ event.description }}</p>
        <div v-if="event.link" class="event-link">
          <a :href="event.link" target="_blank" rel="noopener noreferrer">Learn More</a>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="event-card-right">
        <p class="event-time">{{ formatEventSchedule(event) }}</p>
        <p class="event-location">Location: {{ event.location }}</p>
        <el-button
          v-if="String(event.organizerId) === String(currentUserId)"
          @click.stop="handleDelete"
          type="primary"
          round
          size="small"
          class="delete-btn purple-btn"
          style="margin-top: 1rem;"
        >
          Delete
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from 'vue';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEventStore } from '../stores/event';
// import { useEventDialogStore } from '../stores/eventDialog';
import { formatEventSchedule, type Event } from '../types/event';
import '../assets/eventcard.css';
import { ElButton } from 'element-plus';
import 'element-plus/es/components/button/style/css';

const props = defineProps<{
  event: Event;
  currentUserId?: string | number;
}>();

const { event } = toRefs(props);
const eventStore = useEventStore();
// const eventDialogStore = useEventDialogStore();

const handleCardClick = () => {
  // eventDialogStore.openDialog(props.event);
  eventStore.selectEvent(props.event);
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

<style scoped>
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(128, 0, 255, 0.08);
  background: #7c3aed !important; /* purple-600 */
  border-color: #7c3aed !important;
  color: #fff !important;
  transition: background 0.2s, box-shadow 0.2s;
}
.delete-btn:hover {
  background: #a78bfa !important; /* purple-300 */
  border-color: #a78bfa !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(128, 0, 255, 0.15);
}
.delete-btn-text {
  width: 100%;
  text-align: center;
  display: block;
}
</style>
