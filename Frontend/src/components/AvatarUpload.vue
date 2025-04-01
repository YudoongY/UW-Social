<template>
  <div class="avatar-upload">
    <div class="avatar-preview">
      <img :src="userAvatar" alt="用户头像" class="avatar-image">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const defaultAvatar = '/images/default-avatar.png';

const userAvatar = computed(() => {
  return userStore.userProfile?.photoURL || defaultAvatar;
});
</script>

<style scoped>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #b388eb;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 