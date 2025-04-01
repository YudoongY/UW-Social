<template>
  <div class="main-content">
    <h1>Welcome to UW Social! 🎓</h1>
    <p>This is your social hub — find events, make friends, and share your ideas.</p>

    <div class="section-title">
      <h2>🔥 New Events!!</h2>
    </div>
    <section class="cards-container">
      <div v-for="event in events" :key="event.id" class="card">
        <img :src="event.image || '/images/default.jpg'" :alt="event.title" />
        <h3>{{ event.title }}</h3>
        <p>📅 Date: {{ event.date }}</p>
        <p>🏫 Location: {{ event.location }}</p>
        <p>{{ event.description }}</p>
        <button @click="joinEvent(event.id)">Quickly Join In</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image?: string
}

const userStore = useUserStore()
const events = ref<Event[]>([])
const db = getFirestore()

onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'events'))
    events.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event))
  } catch (error) {
    console.error('获取活动列表失败:', error)
  }
})

const joinEvent = (eventId: string) => {
  // TODO: 实现加入活动的逻辑
  console.log('加入活动:', eventId)
}
</script>

<style scoped>
.main-content {
  padding: 20px;
  margin-top: 60px; /* Add space for fixed navbar */
}

h1 {
  text-align: center;
  color: #4b2e83;
  margin-bottom: 20px;
}

p {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.section-title {
  text-align: center;
  margin: 30px 0;
}

.section-title h2 {
  color: #4b2e83;
  font-size: 2em;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  width: 300px;
  text-align: center;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
}

.card h3 {
  color: #4b2e83;
  margin-bottom: 10px;
}

.card p {
  color: #666;
  margin: 5px 0;
  text-align: left;
}

.card button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.card button:hover {
  background: #45a049;
}
</style> 