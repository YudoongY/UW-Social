<template>
  <div class="box">
    <div class="top-part">
      <div class="search-bar-flex">
        <div class="search">
          <!-- 可加搜索图标 -->
          <!-- <img src="/images/search.svg" class="img" alt="search" /> -->
          <input
            class="label"
            type="text"
            v-model="mobileSearch"
            @keyup.enter="handleMobileSearch"
            placeholder="Search events..."
          />
        </div>
        <button class="profile-log-in" @click="handleProfileClick">
          <img
            :src="userAvatar"
            alt="avatar"
            class="avatar-img"
          />
        </button>
      </div>
    </div>
    <div class="category-bar">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="['category-btn', { active: selectedCategory === cat.key }]"
        @click="selectCategory(cat.key)"
      >
        <span class="category-icon">
          <img :src="`/svg/${cat.icon}`" alt="" class="category-svg" />
        </span>
        <span class="category-label">{{ cat.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
// 示例：你可以用自己的图标组件或图片
import { AcademicIcon, ClubIcon, SportsIcon, GameIcon, CultureIcon, InterestIcon, HFSIcon } from "@/components/mobile/icons";

const userStore = useUserStore();
const defaultAvatar = "/images/mob-default-avatar.jpg";
const userAvatar = computed(() => userStore.userProfile?.photoURL || defaultAvatar);

const mobileSearch = ref("");
const router = useRouter();

function handleMobileSearch() {
  if (mobileSearch.value.trim()) {
    router.push({ path: "/events", query: { q: mobileSearch.value.trim() } });
    mobileSearch.value = "";
  }
}

function handleProfileClick() {
  // 跳转到登录或个人中心
  if (userStore.isLoggedIn) {
    router.push("/profile");
  } else {
    router.push("/login");
  }
}

const categories = [
  { key: "academic", label: "Academic", icon: "academic.svg" },
  { key: "club", label: "Club", icon: "club.svg" },
  { key: "sports", label: "Sports", icon: "sports.svg" },
  { key: "games", label: "Games", icon: "games.svg" },
  { key: "culture", label: "Culture", icon: "culture.svg" },
  { key: "interest", label: "Interest", icon: "interest.svg" },
  { key: "hfs", label: "HFS", icon: "hfs.svg" },
];

const selectedCategory = ref(""); // 当前选中的分类

function selectCategory(key: string) {
  if (selectedCategory.value === key) {
    selectedCategory.value = "";
    router.push({ path: '/' }); // 取消筛选，跳转到全部
  } else {
    selectedCategory.value = key;
    router.push({ path: '/', query: { category: key } });
  }
}
</script>

<style>
.box {
  width: 100vw;
  max-width: 576px;
  min-width: 320px;
  background: #ad8ae6;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.top-part {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px;
  width: 100%;
  box-sizing: border-box;
}

.search-bar-flex {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.search {
  flex: 1;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  height: 34px;
  padding: 4px 10px 4px 8px;
  min-width: 0;
}

.search .label {
  background: transparent;
  border: none;
  color: #828282;
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  outline: none;
  padding: 0;
  margin: 0;
  display: block;
}

.profile-log-in {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #fcec61;
  border: none;
  padding: 0;
  margin-left: 8px;
  cursor: pointer;
  display: block;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.category-bar {
  display: flex;
  gap: 6px;
  padding: 0 8px 8px 8px;
  overflow-x: auto;
  background: #ad8ae6;
}

.category-btn {
  display: flex;
  align-items: center;
  background: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 10px;
  height: 33px;
  font-size: 14px;
  color: #222;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  gap: 6px;
  white-space: nowrap;
}

.category-btn .category-icon {
  display: flex;
  align-items: center;
  margin-right: 2px;
  font-size: 18px;
}

.category-btn.active,
.category-btn:active {
  background: #f8db00; /* 姑且用这个颜色 */
  color: #fff;
}

@media (max-width: 576px) {
  .top-part {
    padding-right: 16px; /* 保证右侧有间距 */
    padding-left: 8px;   /* 可适当缩小左侧 */
  }
}
</style>