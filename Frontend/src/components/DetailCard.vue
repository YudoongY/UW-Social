<template>
	<div class="card">
		<h2 class="card-title">{{ event.title }}</h2>
		<p class="event-time">
			Starts at {{ formatDate(event.startime) }}<br />
			Ends at {{ formatDate(event.endtime) }}
		</p>
		<p class="card-location"> Location: {{ event.location }}</p>
		<p class="card-category">📂 {{ event.category }}</p>
		<p v-if="event.maxParticipants" class="card-max">👥 Max: {{ event.maxParticipants }}</p>
		<p v-if="event.tags && event.tags.length" class="card-tags">🏷️ {{ event.tags.join(', ') }}</p>
		<p class="card-description">{{ event.description }}</p>
				<p v-if="event.link" class="card-link">
		  <a :href="event.link" target="_blank" rel="noopener noreferrer">{{ event.link }}</a>
		</p>
	</div>
</template>

<script setup lang="ts">
import type { Event } from '../types/event';
import { computed } from 'vue';

const props = defineProps<{
    event: Event;
}>();

// 格式化时间：只显示小时:分钟 AM/PM 和年月日
const formatDate = (ts: any) => {
    if (!ts) return '';
    const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
    const time = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const day = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return `${time} ${day}`;
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
	z-index: 1050; /* 设置 z-index 值 */
	position: relative; /* 确保 z-index 生效 */
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
</style>