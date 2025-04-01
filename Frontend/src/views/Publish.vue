<template>
  <div class="publish-container">
    <h2>Publish New Event</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="publish-form">
      <el-form-item label="Event Title" prop="title">
        <el-input v-model="form.title" placeholder="Enter event title" />
      </el-form-item>

      <el-form-item label="Date" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="Select date"
        />
      </el-form-item>

      <el-form-item label="Time" prop="time">
        <el-time-picker
          v-model="form.time"
          placeholder="Select time"
        />
      </el-form-item>

      <el-form-item label="Location" prop="location">
        <el-input v-model="form.location" placeholder="Enter event location" />
      </el-form-item>

      <el-form-item label="Category" prop="category">
        <el-select v-model="form.category" placeholder="Select a category">
          <el-option label="Student Organization" value="student-org" />
          <el-option label="HFS" value="hfs" />
          <el-option label="Internship & Employment" value="internship" />
          <el-option label="International Students" value="international" />
        </el-select>
      </el-form-item>

      <el-form-item label="Description" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="Enter event description"
        />
      </el-form-item>

      <el-form-item label="Event Image" prop="image">
        <el-upload
          class="image-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
        >
          <img v-if="form.image" :src="form.image" class="preview-image" />
          <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="submit-btn" @click="submitForm">Publish Event</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()
const db = getFirestore()
const auth = getAuth()

const form = reactive({
  title: '',
  date: null as Date | null,
  time: null as Date | null,
  location: '',
  category: '',
  description: '',
  image: ''
})

const rules = reactive<FormRules>({
  title: [
    { required: true, message: 'Please enter event title', trigger: 'blur' },
    { min: 3, max: 50, message: 'Length should be 3 to 50 characters', trigger: 'blur' }
  ],
  date: [
    { required: true, message: 'Please select date', trigger: 'change' }
  ],
  time: [
    { required: true, message: 'Please select time', trigger: 'change' }
  ],
  location: [
    { required: true, message: 'Please enter location', trigger: 'blur' }
  ],
  category: [
    { required: true, message: 'Please select a category', trigger: 'change' }
  ],
  description: [
    { required: true, message: 'Please enter description', trigger: 'blur' },
    { min: 10, max: 500, message: 'Length should be 10 to 500 characters', trigger: 'blur' }
  ]
})

onMounted(() => {
  const user = auth.currentUser
  if (!user) {
    ElMessage.error('Please login first to publish an event!')
    router.push('/events')
  }
})

const handleImageSuccess = (response: any) => {
  form.image = response.url
}

const beforeImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('Only image files are allowed!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Image size should be less than 2MB!')
    return false
  }
  return true
}

const submitForm = async () => {
  if (!formRef.value) return
  
  const user = auth.currentUser
  if (!user) {
    ElMessage.error('Please login first to publish an event!')
    router.push('/login')
    return
  }
  
  await formRef.value.validate(async (valid) => {
    if (valid && form.date && form.time) {
      try {
        const eventDate = new Date(form.date)
        const eventTime = new Date(form.time)
        eventDate.setHours(eventTime.getHours())
        eventDate.setMinutes(eventTime.getMinutes())

        await addDoc(collection(db, 'events'), {
          ...form,
          date: eventDate.toISOString(),
          createdBy: user.uid,
          createdByName: user.displayName,
          timestamp: serverTimestamp()
        })
        
        ElMessage.success('Event published successfully!')
        router.push('/events')
      } catch (error) {
        console.error('Failed to publish event:', error)
        ElMessage.error('Failed to publish event, please try again')
      }
    }
  })
}
</script>

<style scoped>
.publish-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  color: #4b2e83;
  text-align: center;
  margin-bottom: 30px;
}

.publish-form {
  margin-top: 20px;
}

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-uploader:hover {
  border-color: #4b2e83;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  text-align: center;
  line-height: 200px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.submit-btn {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.submit-btn:hover {
  background: #45a049;
}
</style> 