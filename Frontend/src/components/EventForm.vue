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

      <div class="form-group">
        <label for="recurrenceType">Recurrence</label>
        <select id="recurrenceType" v-model="formData.recurrenceType" required>
          <!-- <option :value="RecurrenceType.ONE_TIME">One-time</option> -->
          <option :value="RecurrenceType.DAILY">Daily</option>
          <option :value="RecurrenceType.WEEKLY">Weekly</option>
          <option :value="RecurrenceType.MONTHLY">Monthly</option>
        </select>
      </div>

      <!-- One-time event fields -->
      <div v-if="formData.recurrenceType === RecurrenceType.ONE_TIME">
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input id="startDate" v-model="formData.startDate" type="date" required>
          </div>
          <div class="form-group">
            <label for="startTime">Start Time</label>
            <input id="startTime" v-model="formData.startTime" type="time" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input id="endDate" v-model="formData.endDate" type="date" required>
          </div>
          <div class="form-group">
            <label for="endTime">End Time</label>
            <input id="endTime" v-model="formData.endTime" type="time" required>
          </div>
        </div>
      </div>

      <!-- Daily recurring event fields -->
      <div v-if="formData.recurrenceType === RecurrenceType.DAILY">
        <div class="form-row">
          <div class="form-group">
            <label for="dailyStartDate">Start Date</label>
            <input id="dailyStartDate" v-model="formData.startDate" type="date" required>
          </div>
          <div class="form-group">
            <label for="dailyEndDate">End Date (optional)</label>
            <input id="dailyEndDate" v-model="formData.endDate" type="date">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="dailyStartTime">Start Time</label>
            <input id="dailyStartTime" v-model="formData.startTime" type="time" required>
          </div>
          <div class="form-group">
            <label for="dailyEndTime">End Time</label>
            <input id="dailyEndTime" v-model="formData.endTime" type="time" required>
          </div>
        </div>
      </div>

      <!-- Weekly recurring event fields -->
      <div v-if="formData.recurrenceType === RecurrenceType.WEEKLY">
        <div class="form-row">
          <div class="form-group">
            <label for="weeklyStartDate">Start Date</label>
            <input id="weeklyStartDate" v-model="formData.startDate" type="date" required>
          </div>
          <div class="form-group">
            <label for="weeklyEndDate">End Date (optional)</label>
            <input id="weeklyEndDate" v-model="formData.endDate" type="date">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="weeklyStartTime">Start Time</label>
            <input id="weeklyStartTime" v-model="formData.startTime" type="time" required>
          </div>
          <div class="form-group">
            <label for="weeklyEndTime">End Time</label>
            <input id="weeklyEndTime" v-model="formData.endTime" type="time" required>
          </div>
        </div>
        <div class="form-group">
          <label>Days of Week</label>
          <div class="checkbox-group">
            <label v-for="(day, idx) in weekDays" :key="idx">
              <input type="checkbox" :value="idx" v-model="formData.daysOfWeek"> {{ day }}
            </label>
          </div>
        </div>
      </div>

      <!-- Monthly recurring event fields -->
      <div v-if="formData.recurrenceType === RecurrenceType.MONTHLY">
        <div class="form-row">
          <div class="form-group">
            <label for="monthlyStartDate">Start Date</label>
            <input id="monthlyStartDate" v-model="formData.startDate" type="date" required>
          </div>
          <div class="form-group">
            <label for="monthlyEndDate">End Date (optional)</label>
            <input id="monthlyEndDate" v-model="formData.endDate" type="date">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="monthlyStartTime">Start Time</label>
            <input id="monthlyStartTime" v-model="formData.startTime" type="time" required>
          </div>
          <div class="form-group">
            <label for="monthlyEndTime">End Time</label>
            <input id="monthlyEndTime" v-model="formData.endTime" type="time" required>
          </div>
        </div>
        <div class="form-group">
          <label>Days of Month</label>
          <input type="text" v-model="formData.daysOfMonthInput" placeholder="e.g., 1, 15, 31">
          <small>Enter days separated by commas (1-31)</small>
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
          <option value="Academic">Academic</option>
          <option value="Club">Club</option>
          <option value="Sports">Sports</option>
          <option value="Games">Games</option>
          <option value="Culture">Culture</option>
          <option value="Interest">Interest</option>
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

      <div class="form-group">
        <label for="image">Event Image (Optional)</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
        >
      </div>

      <div class="form-group">
        <label for="link">Event Link (Optional)</label>
        <input
          id="link"
          v-model="formData.link"
          type="url"
          placeholder="e.g., https://meeting.com/your-event"
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
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // 引入 Firebase Storage 方法
import type { Event } from '../types/event';
import { RecurrenceType } from '../types/event';
import { getAuth } from 'firebase/auth';

const router = useRouter();
const userStore = useUserStore();
const eventStore = useEventStore();
const isSubmitting = ref(false);
const db = getFirestore();
const storage = getStorage(); // 初始化 Firebase Storage

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
  tags: [] as string[],
  link: '',
  recurrenceType: RecurrenceType.ONE_TIME,
  daysOfWeek: [] as number[],
  daysOfMonthInput: '',
  imageUrl: '', // 新增字段，用于存储图片的下载 URL
});

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

const handleImageUpload = async (event: Event) => {
  const file = event.target.files[0];
  if (!file) return;

  const storagePath = `events/${Date.now()}_${file.name}`; // 生成唯一的存储路径
  const storageReference = storageRef(storage, storagePath);

  try {
    // 上传文件到 Firebase Storage
    const snapshot = await uploadBytes(storageReference, file);
    // 获取文件的下载 URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    formData.value.imageUrl = downloadURL; // 将下载 URL 保存到表单数据中
    alert('Image uploaded successfully!');
  } catch (error) {
    console.error('Failed to upload image:', error);
    alert('Failed to upload image.');
  }
};

const handleSubmit = async () => {
  if (!userStore.userProfile) {
    alert('Please log in to publish an event!');
    return;
  }

  isSubmitting.value = true;
  try {
    let schedule;
    const recurrenceType = formData.value.recurrenceType;
    if (recurrenceType === RecurrenceType.ONE_TIME) {
      const start = new Date(`${formData.value.startDate}T${formData.value.startTime}`);
      const end = new Date(`${formData.value.endDate}T${formData.value.endTime}`);
      if (start.toDateString() !== end.toDateString()) {
        alert('Start and end must be on the same day for a one-time event.');
        isSubmitting.value = false;
        return;
      }
      if (start >= end) {
        alert('End time must be after start time.');
        isSubmitting.value = false;
        return;
      }
      schedule = {
        type: RecurrenceType.ONE_TIME as const,
        startDatetime: start,
        endDatetime: end,
      };
    } else if (recurrenceType === RecurrenceType.DAILY) {
      if (!formData.value.startDate || !formData.value.startTime || !formData.value.endTime) {
        alert('Please fill in all required fields.');
        isSubmitting.value = false;
        return;
      }
      if (formData.value.endDate && new Date(formData.value.endDate) < new Date(formData.value.startDate)) {
        alert('End date must be after start date.');
        isSubmitting.value = false;
        return;
      }
      schedule = {
        type: RecurrenceType.DAILY as const,
        startDate: new Date(formData.value.startDate),
        endDate: formData.value.endDate ? new Date(formData.value.endDate) : undefined,
        startTimeOfDay: formData.value.startTime,
        endTimeOfDay: formData.value.endTime,
      };
    } else if (recurrenceType === RecurrenceType.WEEKLY) {
      if (!formData.value.startDate || !formData.value.startTime || !formData.value.endTime || formData.value.daysOfWeek.length === 0) {
        alert('Please fill in all required fields and select at least one day of week.');
        isSubmitting.value = false;
        return;
      }
      if (formData.value.endDate && new Date(formData.value.endDate) < new Date(formData.value.startDate)) {
        alert('End date must be after start date.');
        isSubmitting.value = false;
        return;
      }
      schedule = {
        type: RecurrenceType.WEEKLY as const,
        startDate: new Date(formData.value.startDate),
        endDate: formData.value.endDate ? new Date(formData.value.endDate) : undefined,
        startTimeOfDay: formData.value.startTime,
        endTimeOfDay: formData.value.endTime,
        daysOfWeek: formData.value.daysOfWeek.map(Number),
      };
    } else if (recurrenceType === RecurrenceType.MONTHLY) {
      if (!formData.value.startDate || !formData.value.startTime || !formData.value.endTime || !formData.value.daysOfMonthInput) {
        alert('Please fill in all required fields and enter days of month.');
        isSubmitting.value = false;
        return;
      }
      if (formData.value.endDate && new Date(formData.value.endDate) < new Date(formData.value.startDate)) {
        alert('End date must be after start date.');
        isSubmitting.value = false;
        return;
      }
      const daysOfMonth = formData.value.daysOfMonthInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 31);
      if (daysOfMonth.length === 0) {
        alert('Please enter valid days of month (1-31).');
        isSubmitting.value = false;
        return;
      }
      schedule = {
        type: RecurrenceType.MONTHLY as const,
        startDate: new Date(formData.value.startDate),
        endDate: formData.value.endDate ? new Date(formData.value.endDate) : undefined,
        startTimeOfDay: formData.value.startTime,
        endTimeOfDay: formData.value.endTime,
        daysOfMonth,
      };
    }

    if (!schedule) {
      alert('Invalid schedule.');
      isSubmitting.value = false;
      return;
    }
    const eventData: Omit<Event, 'id'> = {
      title: formData.value.title,
      description: formData.value.description,
      location: formData.value.location,
      category: formData.value.category,
      tags: formData.value.tags,
      schedule: schedule,
      maxParticipants: formData.value.maxParticipants,
      organizerId: userStore.userProfile.uid,
      organizerName: userStore.userProfile.displayName || 'Anonymous',
      organizerAvatar: userStore.userProfile.photoURL || '',
      createdAt: new Date().toISOString(),
      participants: [],
      link: formData.value.link,
      imageUrl: formData.value.imageUrl, // 保存图片的下载 URL
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