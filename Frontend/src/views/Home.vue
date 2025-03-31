<template>
  <div class="home">
    <el-container>
      <el-header>
        <h1>欢迎来到 UW Social</h1>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card class="feed-card">
              <template #header>
                <div class="card-header">
                  <span>动态列表</span>
                  <el-button type="primary">发布新动态</el-button>
                </div>
              </template>
              <!-- 动态列表将在这里显示 -->
              <div class="feed-item" v-for="i in 5" :key="i">
                <el-card shadow="hover">
                  <h3>示例动态 {{ i }}</h3>
                  <p>这是一条示例动态内容...</p>
                  <div class="feed-actions">
                    <el-button type="text">点赞</el-button>
                    <el-button type="text">评论</el-button>
                    <el-button type="text">分享</el-button>
                  </div>
                </el-card>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="user-card">
              <template #header>
                <div class="card-header">
                  <span>个人信息</span>
                </div>
              </template>
              <div class="user-info" v-if="userStore.isLoggedIn">
                <el-avatar :size="64" src="https://placeholder.com/150"></el-avatar>
                <h3>{{ userStore.userProfile?.name || '用户名' }}</h3>
                <p>这里是个人简介...</p>
              </div>
              <div v-else>
                <el-button type="primary" @click="$router.push('/login')">登录</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.el-header {
  text-align: center;
  padding: 20px 0;
}

.feed-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feed-item {
  margin-bottom: 20px;
}

.feed-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.user-card {
  position: sticky;
  top: 20px;
}

.user-info {
  text-align: center;
}

.user-info h3 {
  margin: 10px 0;
}
</style> 