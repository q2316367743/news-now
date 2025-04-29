<template>
  <div class="navigator">
    <div class="nav-items">
      <div 
        v-for="option in options" 
        :key="option.value"
        class="nav-item"
        :class="{ 'nav-item--active': activeKey === option.value }"
        @click="handleNavClick(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const activeKey = ref("/tab/hot");

const options = [
  { label: "关注", value: "/tab/focus" },
  { label: "最热", value: "/tab/hot" },
  { label: "实时", value: "/tab/realtime" },
  { label: "RSS", value: "/tab/rss" },
];

// 处理导航点击事件
const handleNavClick = (value: string) => {
  activeKey.value = value;
  // 路由跳转
  router.push(value);
};

// 监听路由变化，更新选中状态
watch(
  () => route.path,
  (newPath) => {
    // 查找匹配的选项
    const matchedOption = options.find(option => newPath.includes(option.value));
    if (matchedOption) {
      activeKey.value = matchedOption.value;
    }
  },
  { immediate: true }
);

// 组件挂载时，根据当前路由设置选中状态
onMounted(() => {
  const currentPath = route.path;
  const matchedOption = options.find(option => currentPath.includes(option.value));
  if (matchedOption) {
    activeKey.value = matchedOption.value;
  }
})
</script>

<style scoped lang="less">
.navigator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  
  .nav-items {
    display: flex;
    gap: 16px;
    background-color: var(--td-font-white-4);
    border-radius: var(--td-radius-large);
    padding: 4px 8px;
    box-shadow: var(--td-shadow-1);
  }
  
  .nav-item {
    padding: 6px 8px;
    border-radius: var(--td-radius-default);
    cursor: pointer;
    font-size: var(--td-font-size-body-medium);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      background-color: var(--td-bg-color-container-active);
      color: var(--td-brand-color);
    }
    
    &--active {
      color: var(--td-brand-color);
      font-weight: 500;
    }
  }
}
</style>
