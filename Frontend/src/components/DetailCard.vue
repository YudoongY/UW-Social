<template>
  <div class="card">
    <h2 class="card-title">{{ event.title }}</h2>
    <p class="event-time">
      {{ formatEventSchedule(event) }}
    </p>
    <p class="card-location">Location: {{ event.location }}</p>
    <p class="card-category">📂 {{ event.category }}</p>
    <p v-if="event.maxParticipants" class="card-max">👥 Max: {{ event.maxParticipants }}</p>
    <p v-if="event.tags && event.tags.length" class="card-tags">🏷️ {{ event.tags.join(', ') }}</p>
    <p class="card-description" v-html="formatDescription(event.description)"></p>
    <p v-if="event.link" class="card-link">
      <a :href="event.link" target="_blank" rel="noopener noreferrer">{{ event.link }}</a>
    </p>
    
    <!-- 删除按钮（仅对活动创建者可见） -->
    <el-button
      v-if="showDeleteButton"
      @click="handleDelete"
      type="primary"
      round
      size="small"
      class="delete-btn purple-btn"
      style="margin-top: 1rem;"
    >
      Delete
    </el-button>
    
    <!-- 调试信息（生产环境可移除） -->
    <p style="font-size:12px;color:#aaa;">
      organizerId: {{ event.organizerId }} | 
      currentUserId: {{ currentUserId }} |
      showDelete: {{ showDeleteButton }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatEventSchedule, type Event } from '../types/event';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEventStore } from '../stores/event';
// import { onMounted } from 'vue';

// onMounted(() => {
//   console.log('[DetailCard.vue] currentUserId prop:', props.currentUserId);
// });


const props = defineProps<{
  event: Event;
  currentUserId?: string | number;
}>();

const eventStore = useEventStore();

// 计算属性判断是否显示删除按钮
const showDeleteButton = computed(() => {
  console.log('[DetailCard] props:', props);
  return String(props.event.organizerId) === String(props.currentUserId);
});

const formatDescription = (desc: string) => {
  if (!desc) return '';
  return desc.replace(/\n/g, '<br>');
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
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 0.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  z-index: 1050;
  position: relative;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.card-description {
  font-size: 1rem;
  margin-bottom: 8px;
  color: #555;
}

.event-time {
  font-size: 1.05em;
  font-weight: bold;
  color: #8f2a2a;
  margin: 10px 0 6px 0;
  line-height: 1.5;
}

.card-location,
.card-category,
.card-max,
.card-tags {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 4px;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(128, 0, 255, 0.08);
  background: #7c3aed !important;
  border-color: #7c3aed !important;
  color: #fff !important;
  transition: background 0.2s, box-shadow 0.2s;
}

.delete-btn:hover {
  background: #a78bfa !important;
  border-color: #a78bfa !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(128, 0, 255, 0.15);
}
</style>