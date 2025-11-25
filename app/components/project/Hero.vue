<template>
  <section class="container">
    <div class="custom-grid pt-40 pb-20">
      <div class="col-start-1 col-end-5 flex flex-col gap-15">
        <h1 class="heading-1">{{ props.title }}</h1>
        <h2 class="heading-2 text-secondary whitespace-pre-line">
          {{ props.subtitle }}
        </h2>
      </div>
      <div class="col-start-9 col-end-11 flex flex-col gap-10">
        <ProjectCol :title="'Partner'" :list="props.partner" />
        <ProjectCol :title="'Collaborator'" :list="props.collaborator" />
        <ProjectCol :title="'Scope'" :list="props.scope" />
      </div>
      <div class="col-start-11 col-end-13 flex flex-col gap-10">
        <ProjectCol :title="'Year'" :list="props.year" />
        <ProjectCol :title="'Industry'" :list="props.industry" />
        <ProjectCol :title="'Team'" :list="props.team" />
      </div>
    </div>
    <div
      data-parallax="trigger"
      data-parallax-start="-10"
      data-parallax-end="30"
      class="aspect-video overflow-hidden rounded-3xl"
    >
      <div class="scale-120" data-parallax="target">
        <Media :media="props.media" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle: string;
  media: object;
  collaborator: Array<{ text: string }>;
  industry: Array<{ text: string }>;
  partner: Array<{ text: string }>;
  scope: Array<{ text: string }>;
  team: Array<{ text: string }>;
  year: string;
}>();
</script>
