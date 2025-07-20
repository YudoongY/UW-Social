<template>
  <div class="login-container">
    <div class="login-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
    
    <div class="login-content">
      <div class="login-card">
        <div class="login-header">
          <img src="/images/logo1.png" alt="UW Social Logo" class="login-logo">
          <h1>Welcome to UW Social</h1>
          <p>Connect with your campus community</p>
        </div>
        
        <div class="login-form">
          <button @click="handleGoogleLogin" class="google-login-btn" :disabled="isLoading">
            <div class="google-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span v-if="!isLoading">Continue with Google</span>
            <span v-else>Signing in...</span>
          </button>
          
          <div class="login-divider">
            <span>or</span>
          </div>
          
          <div class="guest-option">
            <p>Just browsing? <router-link to="/" class="guest-link">Continue as guest</router-link></p>
          </div>
        </div>
        
        <div class="login-footer">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const isLoading = ref(false)

const handleGoogleLogin = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    await userStore.loginWithGoogle()
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 30%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.login-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
}

.login-form {
  margin-bottom: 2rem;
}

.google-login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.google-login-btn:hover:not(:disabled) {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.google-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: #a0aec0;
  font-size: 0.9rem;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.login-divider span {
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.95);
}

.guest-option {
  text-align: center;
}

.guest-option p {
  color: #718096;
  margin: 0;
}

.guest-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.guest-link:hover {
  color: #764ba2;
}

.login-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.login-footer p {
  color: #a0aec0;
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 576px) {
  .login-content {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
  
  .login-header h1 {
    font-size: 1.75rem;
  }
  
  .login-logo {
    width: 60px;
    height: 60px;
  }
}
</style>