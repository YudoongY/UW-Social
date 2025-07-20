<template>
  <div class="edit-profile-container">
    <div class="edit-profile-card">
      <div class="profile-header">
        <div class="header-background"></div>
        <div class="profile-avatar-section">
          <AvatarUpload />
          <h2>{{ userStore.userProfile?.displayName || 'Edit Your Profile' }}</h2>
          <p>Customize your profile to connect with like-minded people</p>
        </div>
      </div>

      <div class="profile-form">
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="section-header">
            <h3>📄 Basic Information</h3>
            <p>Tell us about yourself</p>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input 
                id="name"
                v-model="name" 
                placeholder="Enter your full name" 
                class="form-input"
                type="text"
              />
            </div>
            
            <div class="form-group">
              <label for="grade">Grade Level</label>
              <select id="grade" v-model="grade" class="form-select">
                <option value="" disabled>Select your grade</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
                <option value="graduate">Graduate Student</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="major">Major</label>
              <div class="select-wrapper">
                <select id="major" v-model="major" class="form-select">
                  <option value="" disabled>Select your major</option>
                  <option v-for="majorOption in academicTags" :key="majorOption" :value="majorOption">
                    {{ majorOption }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="contact">Contact Information</label>
              <input 
                id="contact"
                v-model="contact" 
                placeholder="Email or preferred contact method" 
                class="form-input"
                type="text"
              />
            </div>
          </div>
        </div>

        <!-- Personal Tags Section -->
        <div class="form-section">
          <div class="section-header">
            <h3>🏷️ Personal Tags</h3>
            <p>Add tags that represent your interests, dorm, activities, and more</p>
          </div>
          
          <!-- Tag Search and Add -->
          <div class="tag-search-section">
            <div class="search-input-wrapper">
              <input
                v-model="tagSearchQuery"
                @input="handleTagSearch"
                @keyup.enter="addCustomTag"
                placeholder="Search for tags or add custom ones..."
                class="tag-search-input"
                type="text"
              />
              <button @click="addCustomTag" class="add-custom-btn" :disabled="!tagSearchQuery.trim()">
                <span>+</span>
              </button>
            </div>
            
            <!-- Search Results -->
            <div v-if="filteredTags.length > 0 && tagSearchQuery" class="tag-suggestions">
              <div class="suggestions-header">
                <span>Suggested tags:</span>
              </div>
              <div class="tag-grid">
                <button
                  v-for="tag in filteredTags.slice(0, 12)"
                  :key="tag"
                  @click="addTag(tag)"
                  :disabled="selectedTags.includes(tag)"
                  class="tag-suggestion"
                  :class="{ 'tag-disabled': selectedTags.includes(tag) }"
                >
                  {{ tag }}
                  <span v-if="selectedTags.includes(tag)" class="tag-check">✓</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Category Tags -->
          <div class="tag-categories">
            <div class="tag-category">
              <h4>🏠 Dorm & Housing</h4>
              <div class="tag-grid">
                <button
                  v-for="tag in dormTags.slice(0, 8)"
                  :key="tag"
                  @click="toggleTag(tag)"
                  class="tag-option"
                  :class="{ 'tag-selected': selectedTags.includes(tag) }"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <div class="tag-category">
              <h4>🎯 Interests & Hobbies</h4>
              <div class="tag-grid">
                <button
                  v-for="tag in interestTags.slice(0, 8)"
                  :key="tag"
                  @click="toggleTag(tag)"
                  class="tag-option"
                  :class="{ 'tag-selected': selectedTags.includes(tag) }"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <div class="tag-category">
              <h4>🏃‍♂️ Sports & Activities</h4>
              <div class="tag-grid">
                <button
                  v-for="tag in sportsTags.slice(0, 8)"
                  :key="tag"
                  @click="toggleTag(tag)"
                  class="tag-option"
                  :class="{ 'tag-selected': selectedTags.includes(tag) }"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>

          <!-- Selected Tags Display -->
          <div v-if="selectedTags.length > 0" class="selected-tags-section">
            <h4>Your Selected Tags ({{ selectedTags.length }})</h4>
            <div class="selected-tags">
              <div
                v-for="tag in selectedTags"
                :key="tag"
                class="selected-tag"
              >
                {{ tag }}
                <button @click="removeTag(tag)" class="remove-tag-btn">×</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button @click="saveProfile" class="save-btn" :disabled="isSaving">
            <span v-if="!isSaving">💾 Save Profile</span>
            <span v-else>Saving...</span>
          </button>
          <button @click="cancelEdit" class="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { allTags, academicTags, dormTags, interestTags, sportsTags } from '../stores/tags';
import { useUserStore } from '../stores/user';
import AvatarUpload from './AvatarUpload.vue';

const router = useRouter();
const userStore = useUserStore();

// Form data
const name = ref('');
const contact = ref('');
const grade = ref('');
const major = ref('');
const selectedTags = ref<string[]>([]);
const isSaving = ref(false);

// Tag search functionality
const tagSearchQuery = ref('');
const filteredTags = ref<string[]>([]);

// Auto-fill user information
watchEffect(() => {
  if (userStore.userProfile) {
    name.value = userStore.userProfile.displayName || '';
    contact.value = userStore.userProfile.email || '';
    grade.value = userStore.userProfile.grade || '';
    major.value = userStore.userProfile.major || '';
    selectedTags.value = userStore.userProfile.tags || [];
  }
});

// Tag search handler
const handleTagSearch = () => {
  const query = tagSearchQuery.value.toLowerCase().trim();
  if (!query) {
    filteredTags.value = [];
    return;
  }
  
  filteredTags.value = allTags.filter(tag => 
    tag.toLowerCase().includes(query) && !selectedTags.value.includes(tag)
  );
};

// Add tag from search or suggestions
const addTag = (tag: string) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
    tagSearchQuery.value = '';
    filteredTags.value = [];
  }
};

// Add custom tag
const addCustomTag = () => {
  const customTag = tagSearchQuery.value.trim();
  if (customTag && !selectedTags.value.includes(customTag)) {
    selectedTags.value.push(customTag);
    tagSearchQuery.value = '';
    filteredTags.value = [];
  }
};

// Toggle tag selection
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

// Remove tag
const removeTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  }
};

// Save profile
const saveProfile = async () => {
  isSaving.value = true;
  try {
    await userStore.updateUserProfile({
      displayName: name.value,
      grade: grade.value,
      major: major.value,
      email: contact.value,
      tags: selectedTags.value,
    });
    alert('Profile updated successfully!');
    router.push('/profile');
  } catch (error) {
    console.error('Failed to save profile:', error);
    alert('Failed to save profile. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

// Cancel editing
const cancelEdit = () => {
  router.push('/profile');
};
</script>

<style scoped>
.edit-profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
}

.edit-profile-card {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.profile-header {
  position: relative;
  padding: 3rem 2rem 2rem;
  text-align: center;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px 24px 0 0;
}

.profile-avatar-section {
  position: relative;
  z-index: 2;
}

.profile-avatar-section h2 {
  margin: 1rem 0 0.5rem;
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
}

.profile-avatar-section p {
  color: #718096;
  margin: 0;
  font-size: 1.1rem;
}

.profile-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 3rem;
}

.section-header {
  margin-bottom: 2rem;
  text-align: center;
}

.section-header h3 {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: #718096;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-wrapper {
  position: relative;
}

.tag-search-section {
  margin-bottom: 2rem;
}

.search-input-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag-search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tag-search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-custom-btn {
  padding: 12px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;
}

.add-custom-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.add-custom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tag-suggestions {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.suggestions-header {
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.tag-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tag-category h4 {
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.tag-option,
.tag-suggestion {
  padding: 8px 12px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
}

.tag-option:hover,
.tag-suggestion:hover {
  border-color: #667eea;
  transform: translateY(-1px);
}

.tag-selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.tag-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tag-check {
  margin-left: 4px;
  font-weight: bold;
}

.selected-tags-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
}

.selected-tags-section h4 {
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

.remove-tag-btn {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.remove-tag-btn:hover {
  background: rgba(255, 255, 255, 0.5);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.save-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 14px 32px;
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .edit-profile-container {
    padding: 1rem 0.5rem;
  }
  
  .profile-header {
    padding: 2rem 1rem 1.5rem;
  }
  
  .profile-form {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .tag-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>