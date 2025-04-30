<template>
  <div class="home">
    <home-loading/>
  </div>
</template>
<script lang="ts" setup>
import HomeLoading from "@/pages/home/components/HomeLoading.vue";

const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (route.query.redirect) {
    router.replace(route.query.redirect as string);
  }
})
</script>
<style scoped lang="less">
.home {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--td-bg-color-container);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
