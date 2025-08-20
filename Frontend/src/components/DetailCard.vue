<template>
  <div class="detail-page">
    <el-card class="detail-card">
      <!-- 第一部分：图片和标题 -->
      <div class="detail-header">
        <img :src="event.imageUrl || '/images/default-event-image.jpg'" alt="Event Image" class="event-image" />
        <div class="event-info">
          <h2 class="event-title">{{ event.title }}</h2>
          <p class="event-location">📍 {{ event.location }}</p>
          <p class="event-time">⏰ {{ formatEventSchedule(event) }}</p>
        </div>
      </div>

      <!-- 第二部分：Google Map -->
      <div class="google-map">
        <p>Google Map</p>
        <!-- 嵌入 Google Map 的 API -->
      </div>

      <!-- 第三部分：描述、标签和链接 -->
      <div class="event-details">
        <p class="event-description" v-html="formatDescription(event.description)"></p>
        <p v-if="event.tags && event.tags.length" class="event-tags">🏷️ {{ event.tags.join(', ') }}</p>
        <p v-if="event.link" class="event-link">
          <a :href="event.link" target="_blank" rel="noopener noreferrer">{{ event.link }}</a>
        </p>
      </div>
    </el-card>
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

console.log('[DetailCard.vue] props.event:', props.event);
</script>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 区块之间的间距 */
  padding: 2rem;
  background-color: #f9f9f9;
}

.detail-card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-header {
  display: flex;
  gap: 1.5rem; /* 图片和信息之间的间距 */
  align-items: center;
}

.event-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.event-info {
  flex: 1;
}

.event-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.event-location,
.event-time {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.google-map {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.event-details {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

.event-tags {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
}

.event-link a {
  color: #1c6fc1;
  text-decoration: underline;
}

.event-link a:hover {
  color: #0a4fa3;
}
</style>