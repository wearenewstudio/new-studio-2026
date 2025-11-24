<template>
  <section class="relative">
    <div class="container">
      <div class="flex flex-col gap-24">
        <template v-for="(item, index) in data" :key="item._key || index">
          <!-- project.single-image / caseStudySingleImage -->
          <template v-if="item._type === 'caseStudySingleImage'">
            <div class="sm:hidden">
              <ProjectMediaWithText
                :media="item.media?.media"
                :text="item.media?.text"
              />
            </div>
            <div class="hidden sm:block">
              <div class="custom-grid">
                <!-- Text (if reverse) -->
                <div
                  v-if="item.reverse && item.media?.text"
                  class="flex flex-col gap-5"
                  :style="{
                    gridColumn: getSingleImageTextGridColumn(
                      item.layout,
                      item.reverse
                    ),
                  }"
                >
                  <p class="normal">{{ item.media.text }}</p>
                </div>

                <!-- Media -->
                <div
                  class="flex flex-col gap-5"
                  :style="{
                    gridColumn: getSingleImageMediaGridColumn(
                      item.layout,
                      item.reverse
                    ),
                  }"
                >
                  <Media
                    v-if="item.media?.media"
                    :media="item.media.media"
                    class="h-fit w-full"
                  />
                </div>

                <!-- Text (if not reverse) -->
                <div
                  v-if="!item.reverse && item.media?.text"
                  class="flex flex-col gap-5"
                  :style="{
                    gridColumn: getSingleImageTextGridColumn(
                      item.layout,
                      item.reverse
                    ),
                  }"
                >
                  <p class="normal">{{ item.media.text }}</p>
                </div>
              </div>
            </div>
          </template>

          <!-- project.double-media / caseStudyDoubleMedia -->
          <template v-else-if="item._type === 'caseStudyDoubleMedia'">
            <div class="flex flex-col gap-5 sm:hidden">
              <ProjectMediaWithText
                v-for="(m, i) in item.media"
                :key="i"
                :media="m.media"
                :text="m.text"
              />
            </div>
            <div class="hidden sm:block">
              <div class="custom-grid">
                <ProjectMediaWithText
                  :media="item.media?.[item.reverse ? 1 : 0]?.media"
                  :text="item.media?.[item.reverse ? 1 : 0]?.text"
                  :grid-column="`1 / span ${getDoubleMediaSpans(item.layout, item.reverse)[0]}`"
                  :media-span="
                    getDoubleMediaSpans(item.layout, item.reverse)[0]
                  "
                />
                <ProjectMediaWithText
                  :media="item.media?.[item.reverse ? 0 : 1]?.media"
                  :text="item.media?.[item.reverse ? 0 : 1]?.text"
                  :grid-column="`${13 - getDoubleMediaSpans(item.layout, item.reverse)[1]} / span ${getDoubleMediaSpans(item.layout, item.reverse)[1]}`"
                  :media-span="
                    getDoubleMediaSpans(item.layout, item.reverse)[1]
                  "
                />
              </div>
            </div>
          </template>

          <!-- project.4-4-4 / caseStudy444 -->
          <template v-else-if="item._type === 'caseStudy444'">
            <div class="flex flex-col gap-15 sm:hidden">
              <ProjectMediaWithText
                v-for="(m, i) in item.media"
                :key="`mobile-${i}`"
                :media="m.media"
                :text="m.text"
              />
            </div>
            <div class="hidden sm:block">
              <div class="custom-grid">
                <ProjectMediaWithText
                  v-for="(m, i) in item.media"
                  :key="`desktop-${i}`"
                  :media="m.media"
                  :text="m.text"
                  :grid-column="`${i * 4 + 1} / span 4`"
                  :media-span="4"
                />
              </div>
            </div>
          </template>

          <!-- project.12-4-4-4 / caseStudy12444 -->
          <template v-else-if="item._type === 'caseStudy12444'">
            <div class="flex flex-col gap-5 sm:hidden">
              <ProjectMediaWithText
                :media="item.top?.media"
                :text="item.top?.text"
                class="mb-10"
              />
              <ProjectMediaWithText
                v-for="(m, i) in item.bottom"
                :key="`mobile-b-${i}`"
                :media="m.media"
                :text="m.text"
                class="mt-10"
              />
            </div>
            <div class="hidden sm:block">
              <div class="custom-grid">
                <ProjectMediaWithText
                  :media="item.top?.media"
                  :text="item.top?.text"
                  grid-column="1 / -1"
                  :media-span="12"
                  class="mb-10"
                />
                <ProjectMediaWithText
                  v-for="(m, i) in item.bottom"
                  :key="`desktop-b-${i}`"
                  :media="m.media"
                  :text="m.text"
                  :grid-column="`${i * 4 + 1} / span 4`"
                  :media-span="4"
                />
              </div>
            </div>
          </template>

          <!-- project.12-6-6 / caseStudy1266 -->
          <template v-else-if="item._type === 'caseStudy1266'">
            <div class="flex flex-col gap-5 sm:hidden">
              <ProjectMediaWithText
                :media="item.top?.media"
                :text="item.top?.text"
                class="mb-10"
              />
              <ProjectMediaWithText
                v-for="(m, i) in item.bottom"
                :key="`mobile-b-${i}`"
                :media="m.media"
                :text="m.text"
                class="mt-10"
              />
            </div>
            <div class="hidden sm:block">
              <div class="custom-grid">
                <ProjectMediaWithText
                  :media="item.top?.media"
                  :text="item.top?.text"
                  grid-column="1 / -1"
                  :media-span="12"
                  class="mb-10"
                />
                <ProjectMediaWithText
                  v-for="(m, i) in item.bottom"
                  :key="`desktop-b-${i}`"
                  :media="m.media"
                  :text="m.text"
                  :grid-column="`${i * 6 + 1} / span 6`"
                  :media-span="6"
                />
              </div>
            </div>
          </template>

          <!-- project.6-6-6-6 / caseStudy6666 -->
          <template v-else-if="item._type === 'caseStudy6666'">
            <div class="flex flex-col gap-15 sm:hidden">
              <ProjectMediaWithText
                v-for="(m, i) in item.media"
                :key="`mobile-${i}`"
                :media="m.media"
                :text="m.text"
              />
            </div>
            <div class="hidden sm:block">
              <div class="custom-grid gap-y-5">
                <ProjectMediaWithText
                  v-for="(m, i) in item.media"
                  :key="`desktop-${i}`"
                  :media="m.media"
                  :text="m.text"
                  :grid-column="`${(i % 2) * 6 + 1} / span 6`"
                  :grid-row="Math.floor(i / 2) + 1"
                  :media-span="6"
                />
              </div>
            </div>
          </template>

          <!-- project.4-4-4-4-4-4 / caseStudy444444 -->
          <template v-else-if="item._type === 'caseStudy444444'">
            <div class="flex flex-col gap-15 sm:hidden">
              <ProjectMediaWithText
                v-for="(m, i) in item.media"
                :key="`mobile-${i}`"
                :media="m.media"
                :text="m.text"
              />
            </div>
            <div class="hidden sm:block">
              <div class="custom-grid">
                <ProjectMediaWithText
                  v-for="(m, i) in item.media"
                  :key="`desktop-${i}`"
                  :media="m.media"
                  :text="m.text"
                  :grid-column="`${(i % 3) * 4 + 1} / span 4`"
                  :grid-row="Math.floor(i / 3) * 2 + 1"
                  :media-span="4"
                />
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  data?: any[];
}>();

// Helper for single-image grid columns
const getSingleImageMediaGridColumn = (
  layout: string | undefined,
  reverse: boolean | undefined
) => {
  const match = layout ? /(\d+)/.exec(layout) : null;
  const span = match && match[1] ? +match[1] : 12;
  return reverse ? `${13 - span} / 13` : `1 / ${span + 1}`;
};

const getSingleImageTextGridColumn = (
  layout: string | undefined,
  reverse: boolean | undefined
) => {
  const match = layout ? /(\d+)/.exec(layout) : null;
  const span = match && match[1] ? +match[1] : 12;
  return span >= 10 || reverse ? '1 / 3' : '11 / 13';
};

// Helper for double-media spans
const getDoubleMediaSpans = (
  layout: string | undefined,
  reverse: boolean | undefined
) => {
  const match = layout?.match(/\[(\d+)\]\s*(?:\|\s*)?\[(\d+)\]/);
  let [lSpan, rSpan] =
    match && match[1] && match[2] ? [+match[1], +match[2]] : [12, 12];
  if (reverse) [lSpan, rSpan] = [rSpan, lSpan];
  return [lSpan, rSpan] as [number, number];
};
</script>
