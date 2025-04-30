<template>
  <div class="home">
    <t-row :gutter="[16, 16]" ref="el">
      <t-col :xs="12" :sm="6" :md="6" :lg="4" :xl="3" :xxl="3" v-for="s in REALTIME_SOURCES" :key="s.id">
        <new-source-view :source="s"/>
      </t-col>
    </t-row>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import {moveArrayElement, useSortable} from "@vueuse/integrations/useSortable";
import {SortableEvent} from "sortablejs";
import { REALTIME_SOURCES} from "@/sources";
import { realtimeSortMap} from "@/store/AppStore";
import NewSourceView from "@/pages/components/NewSourceView.vue";


const el = ref();

useSortable(el, REALTIME_SOURCES, {
  animation: 300,
  handle: '.drag-handle',
  onUpdate: (e: SortableEvent) => {
    moveArrayElement(REALTIME_SOURCES, e.oldIndex, e.newIndex, e)
    nextTick(() => {
      const newSort: Record<string, number> = {}
      REALTIME_SOURCES.value.map(s => s.id).forEach((id, index) => {
        newSort[id] = index;
      })
      realtimeSortMap.value = newSort;
    })
  }
})
</script>
<style scoped lang="less">

</style>
