<template>
  <div :style="{transformOrigin: '50% 50%', backgroundColor: source.primaryColor}"
       class="news-item">
    <div class="news-item-header">
      <div class="news-item-header__title">
        <a class="w-8 h-8 rounded-full bg-cover" target="_blank"
           :href="source.website"
           :style="{'background-image': `url(${source.logo})`}"></a>
        <span class="flex flex-col">
          <span class="flex items-center gap-2">
          <span class="text-xl font-bold">{{ source.title }}</span>
          <t-tag class="news-item-header__tag" v-if="source.tag"
                 :style="{color: source.tag.color}">{{
              source.tag.text
            }}</t-tag>
        </span>
        <span class="text-xs op-70">{{ date }}</span></span>
      </div>
      <div class="news-item-header__opt">
        <div class="btn">
          <refresh-icon size="16px" :class="{spin: loading}" @click="refresh"/>
        </div>
        <div class="btn">
          <star-icon size="16px"/>
        </div>
        <div class="btn drag">
          <menu-application-icon size="16px"/>
        </div>
      </div>
    </div>
    <div class="news-item-container">
      <t-loading :loading="loading" text="加载中" class="h-full">
        <scrollbar>
          <div v-for="(record, index) in records" :key="record.id" class="news-item-record" @click="open(index)">
            <div class="news-item-record__index">
              {{ index + 1 }}
            </div>
            <div class="news-item-record__title" :class="{read: record.read}">{{ record.title }}</div>
            <div class="news-item-record__tip" v-if="record.tip">{{ record.tip }}</div>
            <div class="news-item-record__tag" v-if="record.tag">
              <img v-if="record.tag.type === 'img'" :src="record.tag.text" alt="标签"/>
              <div v-else-if="record.tag.type === 'outline'" class="tag tag-outline"
                   :style="{borderColor: record.tag.color, color: record.tag.color}">{{ record.tag.text }}
              </div>
              <div v-else class="tag" :style="{backgroundColor: record.tag.color}">
                {{ record.tag.text }}
              </div>
            </div>
          </div>
        </scrollbar>
      </t-loading>
    </div>
    <div
      class="os-scrollbar os-scrollbar-horizontal os-theme-dark os-scrollbar-auto-hide os-scrollbar-auto-hide-hidden os-scrollbar-handle-interactive os-scrollbar-cornerless os-scrollbar-unusable"
      style="--os-viewport-percent: 1; --os-scroll-direction: 0;">
      <div class="os-scrollbar-track">
        <div class="os-scrollbar-handle"></div>
      </div>
    </div>
    <div
      class="os-scrollbar os-scrollbar-vertical os-theme-dark os-scrollbar-auto-hide os-scrollbar-auto-hide-hidden os-scrollbar-handle-interactive os-scrollbar-cornerless os-scrollbar-visible"
      style="--os-viewport-percent: 0.3688; --os-scroll-direction: 0;">
      <div class="os-scrollbar-track">
        <div class="os-scrollbar-handle"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {MenuApplicationIcon, RefreshIcon, StarIcon} from "tdesign-icons-vue-next";
import {NewsInstance, NewsInstanceSource} from "@/sources/NewsInstance";
import {prettyDate} from "@/utils/lang/FormatUtil";

const props = defineProps({
  source: {
    type: Object as PropType<NewsInstance>,
    required: true
  }
});

const {records, lastUpdateTime, loading, refresh, open} = props.source!.renderSource() as NewsInstanceSource;

const date = ref('很久很久以前');

const renderDate = () => date.value = prettyDate(lastUpdateTime.value);

useIntervalFn(renderDate, 1000 * 60, {immediate: true, immediateCallback: true});
watch(lastUpdateTime, renderDate);
</script>
<style scoped lang="less">
.news-item {
  height: 430px;
  display: flex;
  flex-direction: column;
  border-radius: var(--td-radius-large);
  cursor: default;
  transition: opacity 0.3s ease-in-out;
  padding: 1rem;

  .news-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0.5rem 0.5rem;

    &__title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }


    &__tag {
      background-color: var(--td-font-white-2);
    }

    &__opt {
      display: flex;
      align-items: center;
      gap: 1rem;

      .btn {
        cursor: pointer;
        color: var(--td-bg-color-component);
        transition: background-color 0.3s ease-in-out;

        &:hover {
          color: var(--td-bg-color-component-hover);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        &.drag {
          cursor: grab;

          &:active {
            cursor: grabbing;
          }
        }
      }
    }
  }

  .news-item-container {
    overflow: auto;
    height: 100%;
    border-radius: var(--td-radius-large);
    background-color: var(--td-font-white-2);

    .news-item-record {
      display: flex;
      padding: 3px 0.5rem;
      border-radius: var(--td-radius-default);
      transition: background-color 0.3s ease-in-out;
      cursor: pointer;
      font-size: var(--td-font-size-title-medium);

      &:hover {
        background-color: var(--td-font-white-4);
      }

      &:first-child {
        padding-top: 0.5rem;
      }

      &:last-child {
        padding-bottom: 0.5rem;
      }

      &__index {
        font-size: 0.875rem;
        line-height: 1.25rem;
        background-color: var(--td-font-white-3);
        border-radius: var(--td-radius-default);
        justify-content: center;
        align-items: center;
        display: flex;
        min-width: 1.5rem;
      }


      &__title {
        margin-left: 6px;

        &.read {
          color: var(--td-text-color-placeholder);
        }
      }

      &__tip {
        font-size: var(--td-font-size-title-small);
        margin-left: 4px;
        color: var(--td-text-color-placeholder);
      }

      &__tag {
        margin-left: 5px;
        font-size: var(--td-font-size-body-small);

        .tag {
          height: 17px;
          line-height: 16px;
          margin-top: 4px;
          padding: 0 2px;
          border-radius: var(--td-radius-default);
          color: var(--td-text-color-anti);

          &.tag-outline {
            border-style: solid;
            border-width: 1px;
            height: 15px;
            line-height: 14px;
            font-size: 10px;
            margin-top: 3px;
          }
        }
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
