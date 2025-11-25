<template>
  <section
    class="relative container py-20"
    data-parallax="trigger"
    data-parallax-start="-15"
    data-parallax-end="15"
  >
    <div class="relative h-[90dvh] w-full overflow-hidden rounded-3xl">
      <div
        class="width-full height-full absolute bottom-0 left-0 z-2 flex flex-col gap-6 p-5"
      >
        <p class="heading-1 text-background whitespace-pre-line">
          {{ props.reel.title }}
        </p>
        <ButtonMagnetic
          text="Discover our showreel"
          :playbackId="props.reel.video.asset.playbackId"
          :preview="`https://image.mux.com/${props.reel.video.asset.playbackId}/animated.gif`"
        />
      </div>
      <div class="z-1 scale-120" data-parallax="target">
        <Media :media="props.reel.background" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  reel: any;
}>();
</script>
