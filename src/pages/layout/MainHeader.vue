<template>
  <header class="main-header">
    <div class="logo flex">
      <img alt="logo" src="/logo.png" class="w-36px h-36px" />
      <div class="ml-4px">
        <span>您的</span>
        <br />
        <span style="color: var(--td-error-color)">专属</span>
        <span>资讯管家</span>
      </div>
    </div>
    <main-navigator />
    <t-space size="small">
      <t-button
        theme="primary"
        variant="text"
        shape="circle"
        @click="$emit('scrollToTop')"
        class="back-top-btn"
        :style="{ opacity: showBackTop ? 1 : 0 }"
      >
        <template #icon>
          <backtop-icon />
        </template>
      </t-button>
      <t-dropdown placement="bottom" trigger="click">
        <t-button
          theme="primary"
          variant="text"
          shape="circle"
          style="margin-bottom: 7px"
        >
          <template #icon>
            <moon-icon v-if="isDark" />
            <sunny-icon v-else />
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="toggleColorMode('dark')">
            <template #prefix-icon>
              <moon-icon />
            </template>
            暗黑
          </t-dropdown-item>
          <t-dropdown-item @click="toggleColorMode('light')">
            <template #prefix-icon>
              <sunny-icon />
            </template>
            明亮
          </t-dropdown-item>
          <t-dropdown-item @click="toggleColorMode('auto')">
            跟随系统
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <t-dropdown
        placement="bottom-right"
        trigger="click"
        :min-column-width="144"
      >
        <t-button
          theme="primary"
          variant="text"
          shape="circle"
          class="back-top-btn"
        >
          <template #icon>
            <setting-icon />
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item @click="clickSettingNews">
            <template #prefix-icon>
              <article-icon />
            </template>
            新闻管理
          </t-dropdown-item>
          <t-dropdown-item @click="clickSettingBase">
            <template #prefix-icon>
              <setting1-icon />
            </template>
            基础设置
          </t-dropdown-item>
          <t-dropdown-item @click="openGithub">
            <template #prefix-icon>
              <logo-github-icon />
            </template>
            Github
          </t-dropdown-item>
          <t-dropdown-item @click="openRewardDialog">
            <template #prefix-icon>
              <heart-icon style="color: var(--td-error-color)" />
            </template>
            赏赞
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </t-space>
  </header>
</template>
<script lang="ts" setup>
import { isDark, toggleColorMode } from "@/store";
import { openRewardDialog } from "@/pages/components/RewardDialog";
import {
  ArticleIcon,
  BacktopIcon,
  HeartIcon,
  LogoGithubIcon,
  MoonIcon,
  Setting1Icon,
  SettingIcon,
  SunnyIcon,
} from "tdesign-icons-vue-next";
import MainNavigator from "@/pages/layout/MainNavigator.vue";

defineProps({
  showBackTop: Boolean,
});
defineEmits(["scrollToTop"]);

const router = useRouter();

const openGithub = () =>
  utools.shellOpenExternal("https://github.com/q2316367743/utools-news-now");

const clickSettingNews = () => {
  router.push({ path: "/setting/news" });
};
const clickSettingBase = () => {
  router.push({ path: "/setting/base" });
};
</script>
<style scoped lang="less">
.main-header {
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px 40px;
  align-items: center;
  z-index: 100;
  background-color: var(--nn-app-header-bg);

  .back-top-btn {
    transition: opacity 0.3s ease;
    opacity: 1;
  }

  .main-header-tab {
    .main-header-tab__tag {
      box-shadow: var(--td-shadow-1);
      padding: 8px;
      border-radius: var(--td-radius-large);
    }
  }
}
</style>
