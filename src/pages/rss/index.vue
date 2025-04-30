<template>
  <div>
    <t-row :gutter="[16, 16]" ref="el">
      <t-col :xs="12" :sm="6" :md="6" :lg="4" :xl="3" :xxl="3" v-for="s in RSS_SOURCES" :key="s.id">
        <new-source-view :source="s"/>
      </t-col>
      <t-col :xs="12" :sm="6" :md="6" :lg="4" :xl="3" :xxl="3">
      <div class="vertical-box" @click="openPostRssSourceDialog()">
        <plus-icon size="96px"/>
      </div>
      </t-col>
    </t-row>
  </div>
</template>
<script lang="ts" setup>
import {PlusIcon} from "tdesign-icons-vue-next";
// @ts-ignore
import {moveArrayElement, useSortable} from "@vueuse/integrations/useSortable";
import {SortableEvent} from "sortablejs";
import {loadRss, rssSortMap, RSS_SOURCES} from "@/store";
import {openPostRssSourceDialog} from "@/pages/rss/dialog/PostRssSource";
import NewSourceView from "@/pages/components/NewSourceView.vue";

// rss初始化
loadRss();

const el = ref();

useSortable(el, RSS_SOURCES, {
  animation: 300,
  handle: '.drag-handle',
  filter: '.vertical-box',
  onUpdate: (e: SortableEvent) => {
    moveArrayElement(RSS_SOURCES, e.oldIndex, e.newIndex, e)
    nextTick(() => {
      const newSort: Record<string, number> = {}
      RSS_SOURCES.value.map(s => s.id).forEach((id, index) => {
        newSort[id] = index;
      })
      rssSortMap.value = newSort;
    })
  }
})
</script>
<style scoped lang="less">
.vertical-box {
  border: 3px dashed var(--td-border-level-1-color);
  border-radius: var(--td-radius-large);
  width: 100%;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out;
  color: var(--td-border-level-1-color);
  cursor: pointer;

  &:hover {
    border-color: var(--td-brand-color);
    color: var(--td-brand-color);
  }
}
</style>
