<template>
  <div class="main">
    <div class="main-container" ref="containerRef">
      <MainHeader :show-back-top="showBackTop" @scroll-to-top="scrollToTop" />
      <main class="py-16px px-40px pt-72px">
        <router-view v-slot="{ Component }">
          <keep-alive :include="['TabHot', 'TabRealtime', 'TabRadio']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MainHeader from "@/pages/layout/MainHeader.vue";

const route = useRoute();
const router = useRouter();

// 返回顶部功能
const containerRef = ref<HTMLElement>();
const showBackTop = ref(false);

// 监听滚动事件
const handleScroll = () => {
  if (containerRef.value) {
    showBackTop.value = containerRef.value.scrollTop > 50;
  }
};

// 返回顶部
const scrollToTop = () => {
  if (containerRef.value) {
    containerRef.value?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

// 组件挂载时添加滚动监听
onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener("scroll", handleScroll);
  }
  // 跳转
  nextTick(() => {
    if (route.path === "/") {
      router.push({
        path: "/tab/hot",
      });
    }
  });
});

// 组件卸载时移除滚动监听

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener("scroll", handleScroll);
  }
});
</script>
<style scoped lang="less">
.main {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(
    circle at bottom center,
    #f871714d 0%,
    transparent 70%
  );
  color: var(--td-text-color-primary);

  .main-container {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
