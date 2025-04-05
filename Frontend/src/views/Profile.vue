<template>
  <div class="profile-layout">
    <!-- 左侧：个人信息 + 侧边菜单 -->
    <aside class="profile-sidebar">
      <div class="profile-card">
        <AvatarUpload />
        <h2>👤 {{ userStore.userProfile?.displayName || 'User' }}</h2>
      </div>

      <div class="profile-menu">
        <ul>
          <li><a href="#" @click="showSection('default')">🏠 Profile Home</a></li>
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
        </div>

        <!-- 个人爱好 -->
        <div class="profile-hobbies">
          <h3>🎯 Personal Hobbies</h3>
          <ul>
            <li>🎵 Music</li>
            <li>🏀 Basketball</li>
            <li>📖 Reading</li>
          </ul>
          <button class="edit-btn" @click="goToEditProfile">✏️ Edit Profile</button>
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
import { reactive } from 'vue';
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import AvatarUpload from '../components/AvatarUpload.vue'

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

const state = reactive({
  currentSection: 'default',  // 默认显示个人主页
});

function goToEditProfile() {
  router.push('/profile/edit');
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
  gap: 2rem;
  padding: 2rem;
  margin-top: 50px;
}

.profile-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.profile-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.profile-card h2 {
  margin-top: 1rem;
  color: #333;
  font-size: 1.2rem;
}

.profile-menu {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-menu li {
  margin: 0.5rem 0;
}

.profile-menu a {
  display: block;
  padding: 0.8rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.profile-menu a:hover {
  background-color: #f0f0f0;
}

.profile-main {
  flex-grow: 1;
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-info {
  margin-top: 20px;
  margin-bottom: 2rem;
}

.profile-info h3,
.profile-tags h3,
.profile-hobbies h3 {
  color: #333;
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.profile-info p {
  margin: 0.5rem 0;
  color: #666;
}

.profile-tags ul,
.profile-hobbies ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.profile-tags li,
.profile-hobbies li {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.edit-btn {
  margin-top: 1rem;
  margin-bottom: 2rem;
  background: #b388eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background: #9c6ad6;
}

.achievements {
  margin-top: 2rem;
}

.achievement-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
}

.achievement-badge img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.achievement-badge p {
  margin: 0;
  color: #666;
}

.profile-section {
  padding: 1rem;
}

.event-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
}

.event-card h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.event-card p {
  margin: 0.25rem 0;
  color: #666;
}
</style> 