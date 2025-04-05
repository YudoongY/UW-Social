<template>
  <div class="app-container">
    <Navbar />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue';
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.app-container {
  padding-top: 100px; /* 让出导航栏的空间 */
  min-height: calc(var(--vh, 1vh) * 100); /* 保持全屏 */
  box-sizing: border-box;
}

.content {
  padding: 10px; /* 正文和边缘的距离 */
}
</style>