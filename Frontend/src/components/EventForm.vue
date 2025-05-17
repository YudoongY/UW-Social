<template>
  <div class="event-form">
    <h2>Publish New Event</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Event Title</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="Enter event title"
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          type="text"
          required
          :placeholder="descriptionPlaceholder"
          rows="3"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input
            id="startDate"
            v-model="formData.startDate"
            type="date"
            required
          >
        </div>
        <div class="form-group">
          <label for="startTime">Start Time</label>
          <input
            id="startTime"
            v-model="formData.startTime"
            type="time"
            required
          >
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="endDate">End Date</label>
          <input
            id="endDate"
            v-model="formData.endDate"
            type="date"
            required
          >
        </div>
        <div class="form-group">
          <label for="endTime">End Time</label>
          <input
            id="endTime"
            v-model="formData.endTime"
            type="time"
            required
          >
        </div>
      </div>

      <div class="form-group">
        <label for="location">Location</label>
        <input
          id="location"
          v-model="formData.location"
          type="text"
          required
          placeholder="Event location"
        >
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="formData.category" required>
          <option value="">Select category</option>
          <option value="academic">Academic</option>
          <option value="club">Club</option>
          <option value="sports">Sports</option>
          <option value="games">Games</option>
          <option value="culture">Culture</option>
          <option value="interest">Interest</option>
          <option value="HFS">HFS</option>
          <!-- <option value="other">Other</option> -->
        </select>
      </div>

      <div class="form-group">
        <label for="maxParticipants">Max Participants (Optional)</label>
        <input
          id="maxParticipants"
          v-model="formData.maxParticipants"
          type="number"
          min="1"
          placeholder="No limit if not set"
        >
      </div>

      <div class="form-group">
        <label for="tags">Tags (comma separated)</label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          placeholder="e.g., study, social, sports"
        >
      </div>

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? 'Publishing...' : 'Publish!' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useEventStore } from '../stores/event';
import { collection, addDoc,Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Event } from '../types/event';

const router = useRouter();
const userStore = useUserStore();
const eventStore = useEventStore();
const isSubmitting = ref(false);

const formData = ref({
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  category: '',
  maxParticipants: null as number | null,
  tags: [] as string[]
});

const tagsInput = computed({
  get: () => formData.value.tags.join(', '),
  set: (value) => {
    formData.value.tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
  }
});

// 新增：动态 placeholder
const descriptionPlaceholder = computed(() =>
  formData.value.title
    ? `Come and enjoy ${formData.value.title}!`
    : 'Describe your event here...'
);

const handleSubmit = async () => {
  if (!userStore.userProfile) {
    alert('Please log in to publish an event!');
    return;
  }

  isSubmitting.value = true;
  try {
    const start = new Date(`${formData.value.startDate}T${formData.value.startTime}`);
    const end = new Date(`${formData.value.endDate}T${formData.value.endTime}`);
    if (start >= end) {
      alert('End time must be after start time.');
      return;
    }
    // Prepare eventData with maxParticipants as number or undefined
    const {
      maxParticipants,
      ...restFormData
    } = formData.value;

    const eventData: Omit<Event, 'id'> = {
      title: formData.value.title,
      description: formData.value.description,
      location: formData.value.location,
      category: formData.value.category,
      tags: formData.value.tags,
      startime: Timestamp.fromDate(start),
      endtime: Timestamp.fromDate(end),
      maxParticipants: formData.value.maxParticipants,
      organizerId: userStore.userProfile.uid,
      organizerName: userStore.userProfile.displayName || 'Anonymous',
      organizerAvatar: userStore.userProfile.photoURL || '',
      createdAt: new Date().toISOString(),
      participants: [],
    };

    await addDoc(collection(db, 'events'), eventData);
    alert('Successfully published!');

    // 更新全局事件列表
    await eventStore.fetchEvents();

    router.push('/events');
  } catch (error) {
    console.error('Failed to publish event:', error);
    alert('Failed to publish event.');
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

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 500;
}
#description::placeholder {
  font-weight: 500;
}
#title,
#description,
#location {
  /* font-weight: 600; */
  border-width: 2px;
}

</style>