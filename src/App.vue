<template>
  <div class="main">
    <div class="main-container" ref="containerRef">
      <header class="main-header">
        <div class="logo">NewsNow</div>
        <navigator />
        <div>
          <t-button 
            theme="primary"
            variant="text" 
            shape="square"
            @click="scrollToTop"
            class="back-top-btn"
            :style="{opacity: showBackTop ? 1 : 0}"
          >
            <template #icon>
              <backtop-icon />
            </template>
          </t-button>
        </div>
      </header>
      <main>
        <router-view/>
      </main>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useUtoolsColorMode} from "@/hooks/ColorMode";
import {BacktopIcon} from "tdesign-icons-vue-next";
import { ref, onMounted, onUnmounted } from 'vue';

// 颜色模式
useUtoolsColorMode();

// 返回顶部功能
const containerRef = ref<HTMLElement | null>(null);
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
      behavior: 'smooth'
    });
  }
};

// 组件挂载时添加滚动监听
onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll);
  }
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll);
  }
});
</script>
<style scoped lang="less">
.main {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: radial-gradient(ellipse 80% 80% at 50% -30%, #f871714d, #fff0);
  background-color: var(--td-bg-color-container);

  .main-container {
    padding: 0 40px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    
    .back-top-btn {
      transition: opacity 0.3s ease;
      opacity: 1;
    }

    .main-header {
      backdrop-filter: blur(12px);
      display: flex;
      justify-content: space-between;
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      padding: 8px 0;
      align-items: center;
      z-index: 100;
      margin: 0 8px;

      .main-header-tab {
        .main-header-tab__tag {
          box-shadow: var(--td-shadow-1);
          padding: 8px;
          border-radius: var(--td-radius-large);
        }
      }
    }

  }
}
</style>
