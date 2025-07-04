<template>
	<div class="card">
		<h2 class="card-title">{{ event.title }}</h2>
		<p class="event-time">
			{{ formatDate(event.startime) }}--{{ formatDate(event.endtime) }}
		</p>
		<p class="card-location"> Location: {{ event.location }}</p>
		<p class="card-category">📂 {{ event.category }}</p>
		<p v-if="event.maxParticipants" class="card-max">👥 Max: {{ event.maxParticipants }}</p>
		<p v-if="event.tags && event.tags.length" class="card-tags">🏷️ {{ event.tags.join(', ') }}</p>
		<p class="card-description" v-html="formatDescription(event.description)"></p>
				<p v-if="event.link" class="card-link">
		  <a :href="event.link" target="_blank" rel="noopener noreferrer">{{ event.link }}</a>
		</p>
		<!-- Edit button and delete button should be here. -->
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
    // 获取小时、分钟和 AM/PM
    let [time, ampm] = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).split(' ');
    ampm = ampm?.toLowerCase() || '';
    // 获取月和日
    const day = date.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
    });
    return `${time}${ampm} ${day}`;
};

const formatDescription = (desc: string) => {
    if (!desc) return '';
    return desc.replace(/\n/g, '<br>');
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

@media (max-width: 576px) {
  .card {
    width: 90vw;         /* Almost full viewport width */
    max-width: 98vw;
    margin-left: auto;
    margin-right: auto;
    padding: 10px;
  }
  .el-dialog, .custom-dialog {
    width: 98vw !important;
    max-width: 98vw !important;
    min-width: unset !important;
    margin: 0 auto !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    border-radius: 0 !important;
    padding: 0 !important;
  }
  .el-dialog__body {
    padding: 10px !important;
  }
}
</style>