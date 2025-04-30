<template>
  <div :style="{transformOrigin: '50% 50%', backgroundColor: source.primaryColor}"
       class="news-item">
    <div class="news-item-header">
      <div class="news-item-header__left">
        <span class="w-8 h-8 rounded-full bg-cover"
              :style="{'background-image': `url(${source.logo})`}"></span>
        <span class="flex flex-col">
          <span class="flex items-center gap-2">
          <span class="news-item-header__title" @click="openWebsite">{{ source.title }}</span>
          <t-tag class="news-item-header__tag" v-if="source.tag" size="small"
                 :style="{color: source.tag.color}">{{
              source.tag.text
            }}</t-tag>
        </span>
        <span class="news-item-header__date">{{ date }}</span></span>
      </div>
      <div class="news-item-header__opt">
        <div class="btn">
          <refresh-icon size="16px" :class="{spin: loading}" @click="refresh"/>
        </div>
        <t-dropdown v-if="source.type === 'rss'" trigger="click" placement="bottom">
          <div class="btn">
            <edit-icon size="16px"/>
          </div>
          <t-dropdown-menu>
            <t-dropdown-item @click="openPostRssSourceDialog(source.props)">
              <template #prefix-icon>
                <edit-icon/>
              </template>
              编辑
            </t-dropdown-item>
            <t-dropdown-item class="color-td-error-color" @click="openDeleteRssSourceDialog(source.props)">
              <template #prefix-icon>
                <delete-icon/>
              </template>
              删除
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
        <div class="btn" @click="toggleFocus" v-else>
          <star-filled-icon v-if="hasFocus" size="16px" style="color: var(--td-error-color)"/>
          <star-icon v-else size="16px"/>
        </div>
        <div class="btn drag drag-handle">
          <menu-application-icon size="16px"/>
        </div>
      </div>
    </div>
    <div class="news-item-container">
      <t-loading :loading="loading" text="加载中" class="h-full">
        <scrollbar>
          <template v-for="(record, index) in records" :key="record.id">
            <div class="news-item-time" v-if="record.date">
              <div class="news-item-time__date">
                <span class="split">— </span>
                <span class="date">{{ prettyDate(record.date) }}</span>
              </div>
              <div class="news-item-time__content" @click="open(index)">
                <span class="news-item-time__title" :class="{read: record.read}">{{ record.title }}</span>
                <span class="news-item-time__tip" v-if="record.tip">{{ record.tip }}</span>
                <span class="news-item-time__tag" v-if="record.tag">
                  <img :src="record.tag.text" alt="标签" class="tag-img" v-if="record.tag.type === 'img'"/>
                  <span v-else-if="record.tag.type === 'outline'" class="tag tag-outline"
                        :style="{borderColor: record.tag.color, color: record.tag.color}">{{ record.tag.text }}
                  </span>
                  <span v-else class="tag" :style="{backgroundColor: record.tag.color}">
                    {{ record.tag.text }}
                  </span>
                </span>
              </div>
            </div>
            <div class="news-item-record" @click="open(index)" :title="record.hover" v-else>
              <div class="news-item-record__index">
                {{ index + 1 }}
              </div>
              <div class="news-item-record__content">
                <span class="news-item-record__title" :class="{read: record.read}">{{ record.title }}</span>
                <span class="news-item-record__tip" v-if="record.tip">{{ record.tip }}</span>
                <span class="news-item-record__tag" v-if="record.tag">
                  <img :src="record.tag.text" alt="标签" class="tag-img" v-if="record.tag.type === 'img'"/>
                  <span v-else-if="record.tag.type === 'outline'" class="tag tag-outline"
                        :style="{borderColor: record.tag.color, color: record.tag.color}">{{ record.tag.text }}
                  </span>
                  <span v-else class="tag" :style="{backgroundColor: record.tag.color}">
                    {{ record.tag.text }}
                  </span>
                </span>
              </div>
            </div>
          </template>
        </scrollbar>
      </t-loading>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {DeleteIcon, EditIcon, MenuApplicationIcon, RefreshIcon, StarFilledIcon, StarIcon} from "tdesign-icons-vue-next";
import {NewsInstance, NewsInstanceSource} from "@/sources/NewsInstance";
import {prettyDate} from "@/utils/lang/FormatUtil";
import {myFocus} from "@/store/AppStore";
import {openDeleteRssSourceDialog, openPostRssSourceDialog} from "@/pages/rss/dialog/PostRssSource";
import {NewsInstanceForRss} from "@/sources/abs/NewsInstanceForRss";

const props = defineProps({
  source: {
    type: Object as PropType<NewsInstanceForRss>,
    required: true
  }
});

const {records, lastUpdateTime, loading, refresh, open} = props.source!.renderSource() as NewsInstanceSource;

const hasFocus = computed(() => myFocus.value.indexOf(props.source!.id) > -1);

const date = ref('很久很久以前更新');

const renderDate = () => date.value = (prettyDate(lastUpdateTime.value) + '更新');

useIntervalFn(renderDate, 1000 * 60, {immediate: true, immediateCallback: true});
watch(lastUpdateTime, renderDate);

function openWebsite() {
  utools.shellOpenExternal(props.source!.website);
}

function toggleFocus() {
  const index = myFocus.value.findIndex(id => id === props.source!.id);
  if (index > -1) {
    myFocus.value.splice(index, 1);
  } else {
    myFocus.value.push(props.source!.id);
  }
}
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
    user-select: none;

    &__left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &__title {
      font-size: var(--td-font-size-title-large);
      font-weight: bold;
      line-height: 24px;
      cursor: pointer;
      transition: color 0.3s ease-in-out;

      &:hover {
        color: var(--td-text-color-link);
      }
    }

    &__date {
      font-size: var(--td-font-size-body-small);
      color: var(--td-text-color-secondary);
    }


    &__tag {
      background-color: var(--nn-news-tag-bg-color);
      margin-left: 4px;
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
    background-color: var(--nn-news-container-bg-color);

    .news-item-record {
      display: flex;
      padding: 3px 0.5rem;
      border-radius: var(--td-radius-default);
      transition: background-color 0.3s ease-in-out;
      cursor: pointer;
      font-size: var(--td-font-size-title-medium);
      line-height: 24px;

      &:hover {
        background-color: var(--nn-news-item-bg-color-hover);
      }

      &:first-child {
        margin-top: 0.5rem;
      }

      &:last-child {
        margin-bottom: 0.5rem;
      }

      &__index {
        font-size: 0.875rem;
        line-height: 1.25rem;
        background-color: var(--nn-news-item-bg-color-index);
        border-radius: var(--td-radius-default);
        justify-content: center;
        align-items: center;
        display: flex;
        min-width: 1.5rem;
      }

      &__content {
        align-items: center;
        margin-left: 6px;
      }


      &__title {

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
        height: 16px;
        font-size: var(--td-font-size-body-small);


        .tag {
          height: 16px;
          line-height: 16px;
          padding: 0 2px;
          border-radius: var(--td-radius-default);
          color: var(--td-text-color-anti);

          &.tag-outline {
            border-style: solid;
            border-width: 1px;
            height: 15px;
            line-height: 14px;
            font-size: 10px;
          }
        }

        .tag-img {
          height: 16px;
          vertical-align: text-top;
        }
      }
    }

    .news-item-time {
      display: flex;
      flex-direction: column;
      border-radius: var(--td-radius-default);
      transition: background-color 0.3s ease-in-out;
      cursor: pointer;
      font-size: var(--td-font-size-title-medium);
      line-height: 24px;
      border-left: 1px solid var(--td-border-level-1-color);
      margin-left: 8px;
      padding: 3px 0.5rem 3px 0;

      &:first-child {
        margin-top: 0.5rem;
      }

      &:last-child {
        margin-bottom: 0.5rem;
      }

      &__date {
        font-size: var(--td-font-size-body-small);
        color: var(--td-text-color-placeholder);
        user-select: none;

        .split {
          color: var(--td-border-level-1-color);
        }

        .date {
          margin-left: 4px;
        }
      }

      &__content {
        align-items: center;
        margin-left: 6px;
        transition: background-color 0.3s ease-in-out;
        padding: 0 4px;
        border-radius: var(--td-radius-default);

        &:hover {
          background-color: var(--nn-news-item-bg-color-hover);
        }
      }


      &__title {

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
        height: 16px;
        font-size: var(--td-font-size-body-small);


        .tag {
          height: 16px;
          line-height: 16px;
          padding: 0 2px;
          border-radius: var(--td-radius-default);
          color: var(--td-text-color-anti);

          &.tag-outline {
            border-style: solid;
            border-width: 1px;
            height: 15px;
            line-height: 14px;
            font-size: 10px;
          }
        }

        .tag-img {
          height: 16px;
          vertical-align: text-top;
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
