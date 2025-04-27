<template>
  <div class="home">
    <t-row :gutter="[16, 16]">
      <t-col :xs="12" :sm="6" :md="6" :lg="4" :xl="3" :xxl="3" v-for="s in SOURCES" :key="s.id">
        <new-source-view :source="s"/>
      </t-col>
    </t-row>
  </div>
</template>
<script lang="ts" setup>

import {SOURCES} from "@/sources";
import NewSourceView from "@/pages/home/components/NewSourceView.vue";
</script>
<style scoped lang="less">
.home {
  padding: 8px;

  .card {
    margin-top: 8px;
  }
}
</style>
