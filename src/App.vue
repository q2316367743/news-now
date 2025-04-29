<template>
  <div class="main">
    <div class="main-container" ref="containerRef">
      <header class="main-header">
        <div class="logo flex">
          <img alt="logo" src="/logo.png" class="w-36px h-36px"/>
          <div class="ml-4px">
            <span>您的</span>
            <br/>
            <span style="color: var(--td-error-color)">专属</span>
            <span>资讯管家</span>
          </div>
        </div>
        <navigator/>
        <t-space size="small">
          <t-button
            theme="primary"
            variant="text"
            shape="circle"
            @click="scrollToTop"
            class="back-top-btn"
            :style="{opacity: showBackTop ? 1 : 0}"
          >
            <template #icon>
              <backtop-icon/>
            </template>
          </t-button>
          <t-dropdown placement="bottom" trigger="click">
            <t-button theme="primary" variant="text" shape="circle" style="margin-bottom: 7px;">
              <template #icon>
                <moon-icon v-if="isDark"/>
                <sunny-icon v-else/>
              </template>
            </t-button>
            <t-dropdown-menu>
              <t-dropdown-item @click="toggleColorMode('dark')">
                <template #prefix-icon>
                  <moon-icon/>
                </template>
                暗黑
              </t-dropdown-item>
              <t-dropdown-item @click="toggleColorMode('light')">
                <template #prefix-icon>
                  <sunny-icon/>
                </template>
                明亮
              </t-dropdown-item>
              <t-dropdown-item @click="toggleColorMode('auto')">
                跟随系统
              </t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
          <t-dropdown placement="bottom-right" trigger="click" :min-column-width="144">
            <t-button
              theme="primary"
              variant="text"
              shape="circle"
              class="back-top-btn"
            >
              <template #icon>
                <more-icon/>
              </template>
            </t-button>
            <t-dropdown-menu>
              <t-dropdown-item>
                <template #prefix-icon>
                  <logo-github-icon/>
                </template>
                Star on Github
              </t-dropdown-item>
              <t-dropdown-item>
                <template #prefix-icon>
                  <heart-icon style="color: var(--td-error-color
                  )"/>
                </template>
                赏赞
              </t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
        </t-space>
      </header>
      <main class="py-16px">
        <router-view/>
      </main>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {BacktopIcon, HeartIcon, LogoGithubIcon, MoonIcon, MoreIcon, SunnyIcon} from "tdesign-icons-vue-next";
import {isDark, toggleColorMode} from '@/store'


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

const options = []
</script>
<style scoped lang="less">
.main {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: radial-gradient(ellipse 80% 80% at 50% -30%, #f871714d, var(--td-bg-color-container));
  background-color: var(--td-bg-color-container);
  color: var(--td-text-color-primary);

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
      background-color: var(--nn-app-header-bg);

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
