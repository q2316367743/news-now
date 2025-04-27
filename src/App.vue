<template>
  <div class="main">
    <div class="main-container">
      <header class="main-header">
        <div class="logo">NewsNow</div>
        <div class="main-header-tab flex justify-center items-center">
          <div class="main-header-tab__tag">
            <t-check-tag-group v-model="activeKey" :options="options" :checked-props="checkedProps"
                               :unchecked-props="uncheckedProps"/>
          </div>
        </div>
        <div>操作</div>
      </header>
      <main>
        <router-view/>
      </main>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useUtoolsColorMode} from "@/hooks/ColorMode";
import {useRoute, useRouter} from "vue-router";
import {TdTagProps} from "tdesign-vue-next";

const route = useRoute();
const router = useRouter();

const activeKey = ref(['/tab/hot']);
const checkedProps: TdTagProps = {
  theme: 'primary',
};
const uncheckedProps: TdTagProps = {
  theme: 'default',
  variant: 'outline',
};

const options = [
  {label: '关注', value: '/tab/focus'},
  {label: '最热', value: '/tab/hot'},
  {label: '实时', value: '/tab/now'},
  {label: 'RSS', value: '/tab/rss'},
];

// 颜色模式
useUtoolsColorMode();


</script>
<style scoped lang="less">
.main {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: radial-gradient(ellipse 80% 80% at 50% -30%, #f871714d, #fff0);
  background-color: rgb(228 228 231 / 1);

  .main-container {
    padding: 0 40px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .main-header {
      backdrop-filter: blur(12px);
      display: flex;
      justify-content: space-between;
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      padding-top: 8px;
      align-items: center;

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
