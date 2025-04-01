<template>
  <div class="events-layout">
    <!-- 左侧边栏 -->
    <aside class="sidebar">
      <h3>📂 Categories</h3>
      <ul>
        <li><a href="#">🎭 Student Organization</a></li>
        <li><a href="#">🏠 HFS</a></li>
        <li><a href="#">💼 Internship & Employment</a></li>
        <li><a href="#">🌏 International Students</a></li>
      </ul>
    </aside>
  
    <!-- 主要内容 -->
    <main class="events-main">
      <div class="section-title"><h2>🎯 All Events !!</h2></div>
  
      <section class="cards-container">
        <div v-for="event in events" :key="event.id" class="card event-card">
          <img :src="event.image || '/images/default.jpg'" :alt="event.title" />
          <div class="card-content">
            <h3>{{ event.title }}</h3>
            <p>📅 Date: {{ event.date }}</p>
            <p>📍 Location: {{ event.location }}</p>
            <p>{{ event.description }}</p>
          </div>
          <div class="button-container">
            <button class="join-btn" @click="joinEvent(event.id)">Quickly Join in</button>
            <button class="review-btn" @click="goToReview(event.id)">Review</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { useUserStore } from '../stores/user'

interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image?: string
}

const router = useRouter()
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
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  // TODO: 实现加入活动的逻辑
}

const goToReview = (eventId: string) => {
  if (!userStore.isLoggedIn) {
    alert('请先登录才能留下评论！')
    router.push('/login')
    return
  }
  router.push(`/review?eventId=${eventId}`)
}
</script>

<style scoped>
.events-layout {
  display: flex;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
}

.sidebar {
  width: 250px;
  padding: 20px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
}

.sidebar h3 {
  color: #4b2e83;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar a {
  color: #666;
  text-decoration: none;
  display: block;
  padding: 8px;
  border-radius: 5px;
}

.sidebar a:hover {
  background: #e0e0e0;
  color: #4b2e83;
}

.events-main {
  flex: 1;
  padding: 20px;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
}

.section-title h2 {
  color: #4b2e83;
  font-size: 2em;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.event-card {
  width: 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.event-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.event-card h3 {
  color: #4b2e83;
  margin: 15px;
}

.event-card p {
  color: #666;
  margin: 5px 15px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  gap: 10px;
}

.join-btn, .review-btn {
  flex: 1;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.join-btn {
  background: #4CAF50;
  color: white;
}

.review-btn {
  background: #2196F3;
  color: white;
}

.join-btn:hover {
  background: #45a049;
}

.review-btn:hover {
  background: #1976D2;
}
</style> 