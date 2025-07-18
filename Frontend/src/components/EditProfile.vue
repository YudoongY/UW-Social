<template>
  <div class="edit-page">
    <h2>Edit Profile</h2>

    <!-- 基本信息 -->
    <div class="section">
      <h3>📄 Basic Information</h3>
      <div class="input-group">
        <input v-model="name" placeholder="Enter your name" class="input-box" />
        <select v-model="grade" class="form-select">
          <option value="" disabled>Select grade</option>
          <option value="freshman">Freshman</option>
          <option value="sophomore">Sophomore</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>
        <select v-model="major" class="form-select">
          <option value="" disabled>Select major</option>
          <option v-for="tag in academicTags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
        <input v-model="contact" placeholder="Enter your contact info" class="input-box" />
      </div>
    </div>

    <!-- 标签编辑 -->
    <div class="section">
      <h3>📑 Personal Tags</h3>
      <div class="input-group">
        <input v-model="newTag" placeholder="Add a custom tag" class="input-box" />
        <button @click="addTag" class="add-btn">Add</button>
      </div>
      <div class="tag-list">
        <label v-for="tag in dormTags" :key="tag" class="tag-item">
          <input type="checkbox" v-model="selectedTags" :value="tag" /> {{ tag }}
        </label>
      </div>
    </div>

    <!-- 保存按钮 -->
    <button @click="saveProfile" class="save-btn">Save</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { allTags, academicTags, dormTags } from '../stores/tags';
import '../assets/editprofile.css';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const name = ref('');
const contact = ref('');
const grade = ref('');
const major = ref('');
const availableTags = ref([...allTags]);
const selectedTags = ref<string[]>([]);
const newTag = ref('');

// 自动填充用户信息
watchEffect(() => {
  if (userStore.userProfile) {
    name.value = userStore.userProfile.displayName || '';
    contact.value = userStore.userProfile.email || '';
    grade.value = userStore.userProfile.grade || '';
    major.value = userStore.userProfile.major || '';
    // 如果你还想同步标签
    // selectedTags.value = userStore.userProfile.tags || [];
  }
});

function addTag() {
  if (newTag.value && !availableTags.value.includes(newTag.value)) {
    availableTags.value.push(newTag.value);
    newTag.value = '';
  }
}

function saveProfile() {
  userStore.updateUserProfile({
    displayName: name.value,
    grade: grade.value,
    major: major.value,
    email: contact.value,
    tags: selectedTags.value,
  });
  alert('Profile updated!');
  router.push('/profile');
}
</script>

<style scoped>
</style>