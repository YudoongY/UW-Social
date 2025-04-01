<template>
  <div class="profile-layout">
    <!-- 左侧：个人信息 + 侧边菜单 -->
    <aside class="profile-sidebar">
      <div class="profile-card">
        <img src="/images/uwdog.png" alt="User Avatar" class="avatar">
        <h2>👤 {{ userStore.userProfile?.displayName || 'User' }}</h2>
        <p>📍 UW Seattle</p>
      </div>

      <div class="profile-menu">
        <h3>📋 Personal Management</h3>
        <ul>
          <li><a href="#" @click="showSection('friends')">👥 My Friends</a></li>
          <li><a href="#" @click="showSection('recommendations')">✨ People You May Know</a></li>
          <li><a href="#" @click="showSection('published')">📅 Published Events</a></li>
          <li><a href="#" @click="showSection('participated')">🎯 Participated Events</a></li>
          <li><a href="#" @click="showSection('achievements')">🏆 Your Achievement</a></li>
        </ul>
      </div>
    </aside>

    <!-- 右侧：个人信息和社交动态 -->
    <main class="profile-main">
      <!-- 默认页面（基本信息 & 社交动态） -->
      <div v-show="currentSection === 'default'" id="default-content">
        <h2>👋 This is your profile!</h2>
        
        <!-- 个人信息 -->
        <div class="profile-info">
          <h3>📄 Basic Information</h3>
          <p>🎂 Age: 21</p>
          <p>🎓 Major: Computer Science & Math</p>
          <p>📞 Contact: {{ userStore.userProfile?.email }}</p>
        </div>

        <!-- 个人标签 -->
        <div class="profile-tags">
          <h3>🏷️ Personal Tags</h3>
          <ul>
            <li>💻 Computer Science & Math</li>
            <li>🏠 Dorm: McCarty Hall</li>
            <li>🎭 Organization: Drama Club</li>
          </ul>
          <button class="edit-btn">✏️ Edit Tags</button>
        </div>

        <!-- 个人爱好 -->
        <div class="profile-hobbies">
          <h3>🎯 Personal Hobbies</h3>
          <ul>
            <li>🎵 Music</li>
            <li>🏀 Basketball</li>
            <li>📖 Reading</li>
          </ul>
          <button class="edit-btn">✏️ Edit Hobbies</button>
        </div>

        <div class="achievements">
          <h2>🏆 Your Achievements</h2>
          <div class="achievement-badge">
            <img src="/images/logo.png" alt="UW Social Badge">
            <p>🎉 Congratulations! You have published 3 events!</p>
          </div>
          <div class="achievement-badge">
            <img src="/images/logo1.png" alt="UW Social Badge">
            <p>🤝 You have made 5 new friends!</p>
          </div>
        </div>
      </div>

      <!-- 其他动态页面 -->
      <div v-show="currentSection === 'friends'" class="profile-section">
        <h3>👥 My Friends</h3>
        <ul>
          <li>🧑‍💻 Alex (Computer Science)</li>
          <li>🎨 Emily (Designer)</li>
          <li>🎵 John (Music Club Member)</li>
        </ul>
      </div>

      <div v-show="currentSection === 'recommendations'" class="profile-section">
        <h3>✨ People You May Know</h3>
        <ul>
          <li>🔍 Sophia (Business School)</li>
          <li>🔍 David (International Student)</li>
          <li>🔍 Mia (Artificial Intelligence)</li>
        </ul>
      </div>

      <div v-show="currentSection === 'published'" class="profile-section">
        <h3>📅 Published Events</h3>
        <div v-for="event in publishedEvents" :key="event.id" class="event-card">
          <h4>{{ event.title }}</h4>
          <p>📅 {{ event.date }}</p>
          <p>📍 {{ event.location }}</p>
        </div>
      </div>

      <div v-show="currentSection === 'participated'" class="profile-section">
        <h3>🎯 Participated Events</h3>
        <div v-for="event in participatedEvents" :key="event.id" class="event-card">
          <h4>{{ event.title }}</h4>
          <p>📅 {{ event.date }}</p>
          <p>📍 {{ event.location }}</p>
        </div>
      </div>

      <div v-show="currentSection === 'achievements'" class="profile-section">
        <h3>🏆 Your Achievements</h3>
        <div class="achievement-badge">
          <img src="/images/logo.png" alt="UW Social Badge">
          <p>🎉 Congratulations! You have published 3 events!</p>
        </div>
        <div class="achievement-badge">
          <img src="/images/logo1.png" alt="UW Social Badge">
          <p>🤝 You have made 5 new friends!</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

interface Event {
  id: string
  title: string
  date: string
  location: string
}

const userStore = useUserStore()
const router = useRouter()
const currentSection = ref('default')
const db = getFirestore()

// 模拟数据
const publishedEvents = ref<Event[]>([
  {
    id: '1',
    title: 'Study Session',
    date: 'March 30th',
    location: 'Library 4th Floor'
  },
  {
    id: '2',
    title: 'Club Fair',
    date: 'April 1st',
    location: 'Student Center'
  }
])

const participatedEvents = ref<Event[]>([
  {
    id: '1',
    title: 'Basketball Game',
    date: 'March 25th',
    location: 'IMA'
  }
])

const showSection = (section: string) => {
  currentSection.value = section
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  // 获取用户发布的活动
  try {
    const eventsRef = collection(db, 'events')
    const q = query(eventsRef, where('createdBy', '==', userStore.userProfile?.uid))
    const querySnapshot = await getDocs(q)
    publishedEvents.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event))
  } catch (error) {
    console.error('获取发布的活动失败:', error)
  }
})
</script>

<style scoped>
.profile-layout {
  display: flex;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  padding: 20px;
  gap: 20px;
}

.profile-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.profile-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 15px;
}

.profile-card h2 {
  color: #4b2e83;
  margin-bottom: 10px;
}

.profile-menu {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.profile-menu h3 {
  color: #4b2e83;
  margin-bottom: 15px;
}

.profile-menu ul {
  list-style: none;
  padding: 0;
}

.profile-menu li {
  margin-bottom: 10px;
}

.profile-menu a {
  color: #666;
  text-decoration: none;
  display: block;
  padding: 8px;
  border-radius: 5px;
}

.profile-menu a:hover {
  background: #f5f5f5;
  color: #4b2e83;
}

.profile-main {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.profile-info, .profile-tags, .profile-hobbies {
  margin-bottom: 30px;
}

.profile-info h3, .profile-tags h3, .profile-hobbies h3 {
  color: #4b2e83;
  margin-bottom: 15px;
}

.profile-info p, .profile-tags ul, .profile-hobbies ul {
  color: #666;
  margin-bottom: 10px;
}

.edit-btn {
  background: #4b2e83;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.edit-btn:hover {
  background: #3a1f63;
}

.achievements {
  margin-top: 40px;
}

.achievement-badge {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.achievement-badge img {
  width: 50px;
  height: 50px;
  border-radius: 25px;
}

.profile-section {
  display: none;
}

.profile-section:not([v-show="false"]) {
  display: block;
}

.event-card {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
}

.event-card h4 {
  color: #4b2e83;
  margin-bottom: 10px;
}

.event-card p {
  color: #666;
  margin: 5px 0;
}
</style> 