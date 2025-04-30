<template>
  <div class="home">
    <t-row :gutter="[16, 16]" ref="el">
      <t-col :xs="12" :sm="6" :md="6" :lg="4" :xl="3" :xxl="3" v-for="s in FOCUS_SOURCE" :key="s.id">
        <new-source-view :source="s"/>
      </t-col>
    </t-row>
  </div>
</template>
<script lang="ts" setup>
import {FOCUS_SOURCE, REALTIME_SOURCES, SOURCES} from "@/sources";
import {focusSortMap, myFocus} from "@/store/AppStore";
import NewSourceView from "@/pages/components/NewSourceView.vue";
// @ts-ignore
import {moveArrayElement, useSortable} from "@vueuse/integrations/useSortable";
import {SortableEvent} from "sortablejs";


const el = ref();

useSortable(el, FOCUS_SOURCE, {
  animation: 300,
  handle: '.drag-handle',
  onUpdate: (e: SortableEvent) => {
    moveArrayElement(REALTIME_SOURCES, e.oldIndex, e.newIndex, e)
    nextTick(() => {
      const newSort: Record<string, number> = {}
      REALTIME_SOURCES.value.map(s => s.id).forEach((id, index) => {
        newSort[id] = index;
      })
      focusSortMap.value = newSort;
    })
  }
});

onMounted(() => {
  FOCUS_SOURCE.value = [
    ...SOURCES.filter(e => myFocus.value.indexOf(e.id) > -1)
  ];
})
</script>
<style scoped lang="less">

</style>
