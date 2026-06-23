<template>
  <div class="page-layout">
    <header class="page-header">
      <div class="page-header__left">
        <div class="page-header__title">
          <slot name="title" v-if="slots['title']"></slot>
          <span v-else-if="title">{{ title }}</span>
        </div>
      </div>
      <div class="page-header__right" v-if="slots['extra']">
        <slot name="extra"></slot>
      </div>
    </header>
    <div class="page-container">
      <slot />
    </div>
    <t-back-top container=".page-layout .page-container" />
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: String
})
const slots = defineSlots()
</script>
<style scoped lang="less">
.page-layout {
  position: relative;
  width: 100%;
  height: 100%;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    height: 56px;
    box-sizing: border-box;
    color: var(--td-text-color-primary);

    &__left {
      display: flex;
      align-items: center;
    }

    &__title {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .page-container {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
}
</style>
