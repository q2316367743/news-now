<template>
  <div class="home">
    <t-row :gutter="[16, 16]" ref="el">
      <t-col :xs="12" :sm="6" :md="6" :lg="4" :xl="3" :xxl="3" v-for="s in HOT_SOURCES" :key="s.id">
        <new-source-view :source="s"/>
      </t-col>
    </t-row>
  </div>
</template>
<script lang="ts" setup>
import {HOT_SOURCES} from "@/sources";
import NewSourceView from "@/pages/home/components/NewSourceView.vue";
// @ts-ignore
import {useSortable, moveArrayElement} from "@vueuse/integrations/useSortable";
import {SortableEvent} from "sortablejs";
import {hotSortMap} from "@/store/AppStore";


const el = ref();

useSortable(el, HOT_SOURCES, {
  animation: 300,
  handle: '.drag-handle',
  onUpdate: (e: SortableEvent) => {
    moveArrayElement(HOT_SOURCES, e.oldIndex, e.newIndex, e)
    nextTick(() => {
      const newSort: Record<string, number> = {}
      HOT_SOURCES.value.map(s => s.id).forEach((id, index) => {
        newSort[id] = index;
      })
      hotSortMap.value = newSort;
    })
  }
})
</script>
<style scoped lang="less">
</style>
