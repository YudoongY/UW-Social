<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h2>个人资料</h2>
        </div>
      </template>
      
      <div v-if="userStore.isLoggedIn" class="user-info">
        <el-avatar :size="100" :src="userStore.userProfile?.photoURL || ''"></el-avatar>
        <h3>{{ userStore.userProfile?.displayName }}</h3>
        <p>{{ userStore.userProfile?.email }}</p>
        <el-button type="danger" @click="handleLogout">退出登录</el-button>
      </div>
      
      <div v-else>
        <p>请先登录</p>
        <el-button type="primary" @click="$router.push('/login')">去登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出失败:', error)
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.profile-card {
  width: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  text-align: center;
}

.user-info h3 {
  margin: 20px 0 10px;
  color: #333;
}

.user-info p {
  color: #666;
  margin-bottom: 20px;
}
</style> 