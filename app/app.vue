<template>
  <div id="root">
    <VideoModal />
    <CustomCursor />
    <NavBar />
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
