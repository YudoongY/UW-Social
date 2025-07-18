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
          <li><a href="#" @click.prevent="showSection('default')">🏠 Profile Home</a></li>
          <!-- <li><a href="#" @click="showSection('friends')">👥 My Friends</a></li>
          <li><a href="#" @click="showSection('recommendations')">✨ People You May Know</a></li> -->
          <li><a href="#" @click.prevent="showSection('published')">📅 Published Events</a></li>
          <!-- <li><a href="#" @click="showSection('participated')">🎯 Participated Events</a></li> -->
          <li><a href="#" @click.prevent="showSection('achievements')">🏆 Your Achievement</a></li>
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
        <div class="event-list-horizontal">
          <div
            v-for="event in publishedEvents"
            :key="event.id"
            class="event-card-horizontal"
            @click="openDetail(event)"
            style="cursor: pointer;"
          >
            <h4>{{ event.title }}</h4>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ formatEventSchedule(event) }}</span>
              <span>{{ event.location }}</span>
            </div>
          </div>
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

      <ElDialog v-model="isDialogOpen" title="Event Details" class="custom-dialog">
        <DetailCard v-if="selectedEvent" :event="selectedEvent" />
      </ElDialog>
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
import DetailCard from '../components/DetailCard.vue';
import '../assets/profile.css';
import { formatEventSchedule, type Event } from '../types/event';

const userStore = useUserStore()
const router = useRouter()
const currentSection = ref('default')
const db = getFirestore()

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
    router.push('/login');
    return;
  }

  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('organizerId', '==', userStore.userProfile?.uid));
    const querySnapshot = await getDocs(q);
    publishedEvents.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        location: data.location || '',
        category: data.category || '',
        tags: data.tags || [],
        schedule: data.schedule,
        maxParticipants: data.maxParticipants ?? null,
        organizerId: data.organizerId || '',
        organizerName: data.organizerName || '',
        organizerAvatar: data.organizerAvatar || '',
        createdAt: data.createdAt || '',
        participants: data.participants || [],
        link: data.link || '',
      };
    });
  } catch (error) {
    console.error('获取发布的活动失败:', error);
  }
});

const publishedEvents = ref<Event[]>([]);
const participatedEvents = ref([]);
const isDialogOpen = ref(false);
const selectedEvent = ref<Event | null>(null);

function openDetail(event: Event | null) {
  selectedEvent.value = event;
  isDialogOpen.value = true;
}
</script>