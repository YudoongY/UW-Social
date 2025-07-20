<template>
  <div class="event-form-container">
    <div class="form-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="header-icon">🚀</div>
        <h1>Create Amazing Event</h1>
        <p>Share your event with the UW community and bring people together</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="bento-form">
      <!-- Main Content Grid -->
      <div class="bento-grid">
        <!-- Event Title Card -->
        <div class="bento-card title-card">
          <div class="card-header">
            <div class="card-icon">✨</div>
            <h3>Event Title</h3>
          </div>
          <div class="card-content">
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              placeholder="Give your event an exciting title..."
              class="bento-input title-input"
            >
          </div>
        </div>

        <!-- Description Card -->
        <div class="bento-card description-card">
          <div class="card-header">
            <div class="card-icon">📝</div>
            <h3>Description</h3>
          </div>
          <div class="card-content">
            <textarea
              id="description"
              v-model="formData.description"
              required
              :placeholder="descriptionPlaceholder"
              rows="4"
              class="bento-textarea"
            ></textarea>
          </div>
        </div>

        <!-- Schedule Card -->
        <div class="bento-card schedule-card">
          <div class="card-header">
            <div class="card-icon">📅</div>
            <h3>Schedule</h3>
          </div>
          <div class="card-content">
            <div class="schedule-type">
              <label for="recurrenceType" class="schedule-label">Event Type</label>
              <select id="recurrenceType" v-model="formData.recurrenceType" required class="bento-select">
                <option :value="RecurrenceType.ONE_TIME">One-time Event</option>
                <option :value="RecurrenceType.DAILY">Daily Recurring</option>
                <option :value="RecurrenceType.WEEKLY">Weekly Recurring</option>
                <option :value="RecurrenceType.MONTHLY">Monthly Recurring</option>
              </select>
            </div>

            <!-- One-time event fields -->
            <div v-if="formData.recurrenceType === RecurrenceType.ONE_TIME" class="schedule-fields">
              <div class="date-time-grid">
                <div class="date-group">
                  <label>Start</label>
                  <div class="datetime-row">
                    <input v-model="formData.startDate" type="date" required class="bento-input date-input">
                    <input v-model="formData.startTime" type="time" required class="bento-input time-input">
                  </div>
                </div>
                <div class="date-group">
                  <label>End</label>
                  <div class="datetime-row">
                    <input v-model="formData.endDate" type="date" required class="bento-input date-input">
                    <input v-model="formData.endTime" type="time" required class="bento-input time-input">
                  </div>
                </div>
              </div>
            </div>

            <!-- Daily recurring event fields -->
            <div v-if="formData.recurrenceType === RecurrenceType.DAILY" class="schedule-fields">
              <div class="date-time-grid">
                <div class="date-group">
                  <label>Start Date</label>
                  <input v-model="formData.startDate" type="date" required class="bento-input">
                </div>
                <div class="date-group">
                  <label>End Date (Optional)</label>
                  <input v-model="formData.endDate" type="date" class="bento-input">
                </div>
                <div class="date-group">
                  <label>Start Time</label>
                  <input v-model="formData.startTime" type="time" required class="bento-input">
                </div>
                <div class="date-group">
                  <label>End Time</label>
                  <input v-model="formData.endTime" type="time" required class="bento-input">
                </div>
              </div>
            </div>

            <!-- Weekly recurring event fields -->
            <div v-if="formData.recurrenceType === RecurrenceType.WEEKLY" class="schedule-fields">
              <div class="date-time-grid">
                <div class="date-group">
                  <label>Start Date</label>
                  <input v-model="formData.startDate" type="date" required class="bento-input">
                </div>
                <div class="date-group">
                  <label>End Date (Optional)</label>
                  <input v-model="formData.endDate" type="date" class="bento-input">
                </div>
                <div class="date-group">
                  <label>Start Time</label>
                  <input v-model="formData.startTime" type="time" required class="bento-input">
                </div>
                <div class="date-group">
                  <label>End Time</label>
                  <input v-model="formData.endTime" type="time" required class="bento-input">
                </div>
              </div>
              <div class="days-selection">
                <label class="schedule-label">Days of Week</label>
                <div class="days-grid">
                  <label v-for="(day, idx) in weekDays" :key="idx" class="day-checkbox">
                    <input type="checkbox" :value="idx" v-model="formData.daysOfWeek">
                    <span class="day-label">{{ day }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Monthly recurring event fields -->
            <div v-if="formData.recurrenceType === RecurrenceType.MONTHLY" class="schedule-fields">
              <div class="date-time-grid">
                <div class="date-group">
                  <label>Start Date</label>
                  <input v-model="formData.startDate" type="date" required class="bento-input">
                </div>
                <div class="date-group">
                  <label>End Date (Optional)</label>
                  <input v-model="formData.endDate" type="date" class="bento-input">
                </div>
                <div class="date-group">
                  <label>Start Time</label>
                  <input v-model="formData.startTime" type="time" required class="bento-input">
                </div>
                <div class="date-group">
                  <label>End Time</label>
                  <input v-model="formData.endTime" type="time" required class="bento-input">
                </div>
              </div>
              <div class="monthly-days">
                <label class="schedule-label">Days of Month</label>
                <input 
                  type="text" 
                  v-model="formData.daysOfMonthInput" 
                  placeholder="e.g., 1, 15, 31"
                  class="bento-input"
                >
                <small class="input-hint">Enter days separated by commas (1-31)</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Location & Category Card -->
        <div class="bento-card location-category-card">
          <div class="card-header">
            <div class="card-icon">📍</div>
            <h3>Location & Category</h3>
          </div>
          <div class="card-content">
            <div class="location-category-grid">
              <div class="input-group">
                <label for="location">Location</label>
                <input
                  id="location"
                  v-model="formData.location"
                  type="text"
                  required
                  placeholder="Where will your event take place?"
                  class="bento-input"
                >
              </div>
              <div class="input-group">
                <label for="category">Category</label>
                <select id="category" v-model="formData.category" required class="bento-select">
                  <option value="">Select category</option>
                  <option value="Academic">📚 Academic</option>
                  <option value="Club">🎭 Club</option>
                  <option value="Sports">🏃‍♂️ Sports</option>
                  <option value="Games">🎮 Games</option>
                  <option value="Culture">🎨 Culture</option>
                  <option value="Interest">💡 Interest</option>
                  <option value="HFS">🏠 HFS</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Details Card -->
        <div class="bento-card details-card">
          <div class="card-header">
            <div class="card-icon">⚙️</div>
            <h3>Additional Details</h3>
          </div>
          <div class="card-content">
            <div class="details-grid">
              <div class="input-group">
                <label for="maxParticipants">Max Participants</label>
                <input
                  id="maxParticipants"
                  v-model="formData.maxParticipants"
                  type="number"
                  min="1"
                  placeholder="No limit if empty"
                  class="bento-input"
                >
              </div>
              <div class="input-group">
                <label for="link">Event Link</label>
                <input
                  id="link"
                  v-model="formData.link"
                  type="url"
                  placeholder="https://your-event-link.com"
                  class="bento-input"
                >
              </div>
            </div>
            <div class="input-group full-width">
              <label for="tags">Tags</label>
              <input
                id="tags"
                v-model="tagsInput"
                type="text"
                placeholder="Add tags separated by commas (e.g., study, social, networking)"
                class="bento-input"
              >
              <small class="input-hint">Help people discover your event with relevant tags</small>
            </div>
          </div>
        </div>

        <!-- Submit Card -->
        <div class="bento-card submit-card">
          <div class="card-content submit-content">
            <div class="submit-info">
              <h3>Ready to publish?</h3>
              <p>Your event will be visible to all UW students immediately after publishing.</p>
            </div>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span class="btn-icon">🚀</span>
              <span v-if="!isSubmitting">Publish Event</span>
              <span v-else>Publishing...</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useEventStore } from '../stores/event';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import type { Event } from '../types/event';
import { RecurrenceType } from '../types/event';

const router = useRouter();
const userStore = useUserStore();
const eventStore = useEventStore();
const isSubmitting = ref(false);
const db = getFirestore();

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
});

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const tagsInput = computed({
  get: () => formData.value.tags.join(', '),
  set: (value) => {
    formData.value.tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
  }
});

const descriptionPlaceholder = computed(() =>
  formData.value.title
    ? `Come and enjoy ${formData.value.title}! Tell people what to expect, what to bring, and why they should join.`
    : 'Describe your event here... What will happen? What should people expect?'
);

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
    };

    await addDoc(collection(db, 'events'), eventData);
    alert('Successfully published!');

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
.event-form-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
}

.form-header {
  position: relative;
  padding: 4rem 2rem 3rem;
  text-align: center;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.95;
}

.header-content {
  position: relative;
  z-index: 2;
  color: white;
}

.header-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.header-content h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.bento-form {
  max-width: 1200px;
  margin: -2rem auto 0;
  padding: 0 2rem 4rem;
  position: relative;
  z-index: 3;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  grid-template-areas:
    "title title title title desc desc desc desc desc desc desc desc"
    "schedule schedule schedule schedule schedule schedule location location location details details details"
    "submit submit submit submit submit submit submit submit submit submit submit submit";
}

.bento-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.bento-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.bento-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.title-card {
  grid-area: title;
}

.description-card {
  grid-area: desc;
}

.schedule-card {
  grid-area: schedule;
}

.location-category-card {
  grid-area: location;
}

.details-card {
  grid-area: details;
}

.submit-card {
  grid-area: submit;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-card::before {
  display: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.card-content {
  flex: 1;
}

.bento-input,
.bento-textarea,
.bento-select {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  box-sizing: border-box;
}

.bento-input:focus,
.bento-textarea:focus,
.bento-select:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.title-input {
  font-size: 1.2rem;
  font-weight: 600;
}

.bento-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.schedule-type {
  margin-bottom: 1.5rem;
}

.schedule-label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.schedule-fields {
  margin-top: 1.5rem;
}

.date-time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.date-group label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.datetime-row {
  display: flex;
  gap: 0.5rem;
}

.date-input,
.time-input {
  flex: 1;
}

.days-selection,
.monthly-days {
  margin-top: 1rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.day-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.day-checkbox:hover {
  background: #e2e8f0;
}

.day-checkbox input:checked + .day-label {
  font-weight: 600;
  color: #667eea;
}

.day-checkbox:has(input:checked) {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

.day-label {
  font-size: 0.9rem;
  user-select: none;
}

.location-category-grid,
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.input-hint {
  color: #718096;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.submit-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.submit-info h3 {
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.submit-info p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 16px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 180px;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-areas:
      "title title title title title title title title title title title title"
      "desc desc desc desc desc desc desc desc desc desc desc desc"
      "schedule schedule schedule schedule schedule schedule schedule schedule schedule schedule schedule schedule"
      "location location location location location location details details details details details details"
      "submit submit submit submit submit submit submit submit submit submit submit submit";
  }
}

@media (max-width: 768px) {
  .event-form-container {
    padding: 0;
  }
  
  .form-header {
    padding: 3rem 1rem 2rem;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .header-content p {
    font-size: 1rem;
  }
  
  .bento-form {
    padding: 0 1rem 3rem;
  }
  
  .bento-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "title"
      "desc"
      "schedule"
      "location"
      "details"
      "submit";
  }
  
  .bento-card {
    padding: 1.5rem;
  }
  
  .date-time-grid,
  .location-category-grid,
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .submit-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .submit-btn {
    width: 100%;
  }
  
  .days-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .header-icon {
    font-size: 3rem;
  }
  
  .header-content h1 {
    font-size: 1.75rem;
  }
  
  .bento-card {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .card-header {
    margin-bottom: 1rem;
  }
  
  .card-header h3 {
    font-size: 1.1rem;
  }
  
  .days-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>