<template>
  <div class="mobile-events-page">
    <!-- 事件列表 -->
    <EventList :category="selectedCategory" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EventList from "@/components/EventList.vue";

const categories = [
  { key: "academic", label: "Academic", icon: "academic.svg" },
  { key: "club", label: "Club", icon: "club.svg" },
  { key: "sports", label: "Sports", icon: "sports.svg" },
  { key: "games", label: "Games", icon: "games.svg" },
  { key: "culture", label: "Culture", icon: "culture.svg" },
  { key: "interest", label: "Interest", icon: "interest.svg" },
  { key: "hfs", label: "HFS", icon: "hfs.svg" },
];

const selectedCategory = ref("");

function selectCategory(key: string) {
  selectedCategory.value = selectedCategory.value === key ? "" : key;
}
</script>

<style scoped>
.mobile-events-page {
  padding-top: 1.4rem; /* 留出顶部导航栏空间 */
  background: #f5f5f5;
  min-height: 100vh;
}
</style>