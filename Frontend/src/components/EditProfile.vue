<template>
  <div class="edit-page">
    <h2>Edit Profile</h2>

    <!-- 基本信息 -->
    <div class="section">
      <h3>📄 Basic Information</h3>
      <div class="input-group">
        <input v-model="name" placeholder="Enter your name" class="input-box" />
        <input v-model="age" placeholder="Enter your age" type="number" class="input-box" />
        <input v-model="major" placeholder="Enter your major" class="input-box" />
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
        <label v-for="tag in availableTags" :key="tag" class="tag-item">
          <input type="checkbox" v-model="selectedTags" :value="tag" /> {{ tag }}
        </label>
      </div>
    </div>

    <!-- 兴趣编辑 -->
    <div class="section">
      <h3>🎯 Personal Hobbies</h3>
      <div class="input-group">
        <input v-model="newHobby" placeholder="Add a custom hobby" class="input-box" />
        <button @click="addHobby" class="add-btn">Add</button>
      </div>
      <div class="tag-list">
        <label v-for="hobby in availableHobbies" :key="hobby" class="tag-item">
          <input type="checkbox" v-model="selectedHobbies" :value="hobby" /> {{ hobby }}
        </label>
      </div>
    </div>

    <!-- 保存按钮 -->
    <button @click="saveProfile" class="save-btn">Save</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('Yuqing Ye');
const age = ref(21);
const major = ref('Computer Science & Math');
const contact = ref('yye9@uw.edu');

const availableTags = ref(['Computer Science & Math', 'Dorm: McCarty Hall', 'Drama Club']);
const selectedTags = ref([]);
const newTag = ref('');

const availableHobbies = ref(['Music', 'Basketball', 'Reading']);
const selectedHobbies = ref([]);
const newHobby = ref('');

function addTag() {
  if (newTag.value && !availableTags.value.includes(newTag.value)) {
    availableTags.value.push(newTag.value);
    newTag.value = '';
  }
}

function addHobby() {
  if (newHobby.value && !availableHobbies.value.includes(newHobby.value)) {
    availableHobbies.value.push(newHobby.value);
    newHobby.value = '';
  }
}

function saveProfile() {
  console.log('Profile saved:', {
    name: name.value,
    age: age.value,
    major: major.value,
    contact: contact.value,
    tags: selectedTags.value,
    hobbies: selectedHobbies.value,
  });
  alert('Profile updated!');
  router.push('/profile');
}
</script>

<style scoped>
.edit-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.section {
  margin: 1rem 0;
  text-align: center;
}

.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.input-box {
  margin: 0.5rem;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  outline: none;
  width: 200px;
}

.add-btn {
  padding: 0.5rem 1rem;
  background-color: #a78bfa;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #7c3aed;
}

.tag-list {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 0.5rem 0;
}

.tag-item {
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.save-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #45a049;
}
</style>