<template>
  <section class="relative container py-20">
    <div class="relative h-[90dvh] w-full overflow-hidden rounded-3xl">
      <div
        class="width-full height-full absolute bottom-0 left-0 flex flex-col gap-6 p-5"
      >
        <p class="heading-1 text-background whitespace-pre-line">
          {{ props.reel.title }}
        </p>
        <MagneticButton
          text="Discover our showreel"
          :magnetic-strength="50"
          :magnetic-strength-inner="25"
          :playbackId="props.reel.video.asset.playbackId"
          :preview="`https://image.mux.com/${props.reel.video.asset.playbackId}/animated.gif`"
        />
      </div>
      <Media :media="props.reel.background" />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  reel: any;
}>();
</script>
