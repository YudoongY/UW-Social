<template>
  <div class="event-form">
    <h2>发布新活动</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">活动标题</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="输入活动标题"
        >
      </div>

      <div class="form-group">
        <label for="description">活动描述</label>
        <textarea
          id="description"
          v-model="formData.description"
          required
          placeholder="详细描述你的活动"
          rows="4"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="date">日期</label>
          <input
            id="date"
            v-model="formData.date"
            type="date"
            required
          >
        </div>

        <div class="form-group">
          <label for="time">时间</label>
          <input
            id="time"
            v-model="formData.time"
            type="time"
            required
          >
        </div>
      </div>

      <div class="form-group">
        <label for="location">地点</label>
        <input
          id="location"
          v-model="formData.location"
          type="text"
          required
          placeholder="活动地点"
        >
      </div>

      <div class="form-group">
        <label for="category">类别</label>
        <select id="category" v-model="formData.category" required>
          <option value="">选择类别</option>
          <option value="academic">学术</option>
          <option value="social">社交</option>
          <option value="sports">运动</option>
          <option value="cultural">文化</option>
          <option value="other">其他</option>
        </select>
      </div>

      <div class="form-group">
        <label for="maxParticipants">最大参与人数（可选）</label>
        <input
          id="maxParticipants"
          v-model="formData.maxParticipants"
          type="number"
          min="1"
          placeholder="不设置则无限制"
        >
      </div>

      <div class="form-group">
        <label for="tags">标签（用逗号分隔）</label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          placeholder="例如：学习,社交,运动"
        >
      </div>

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? '发布中...' : '发布活动' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Event } from '../types/event';

const router = useRouter();
const userStore = useUserStore();
const isSubmitting = ref(false);

const formData = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: '',
  maxParticipants: undefined as number | undefined,
  tags: [] as string[]
});

const tagsInput = computed({
  get: () => formData.value.tags.join(', '),
  set: (value) => {
    formData.value.tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
  }
});

const handleSubmit = async () => {
  if (!userStore.userProfile) {
    alert('请先登录');
    return;
  }

  isSubmitting.value = true;
  try {
    const eventData: Omit<Event, 'id'> = {
      ...formData.value,
      organizerId: userStore.userProfile.uid,
      organizerName: userStore.userProfile.displayName || '匿名用户',
      organizerAvatar: userStore.userProfile.photoURL || '',
      createdAt: new Date().toISOString(),
      participants: []
    };

    await addDoc(collection(db, 'events'), eventData);
    alert('活动发布成功！');
    router.push('/events');
  } catch (error) {
    console.error('发布活动失败:', error);
    alert('发布活动失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.event-form {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 500;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #b388eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background: #9c6ad6;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 