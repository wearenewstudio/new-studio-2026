<template>
  <div
    data-footer-parallax
    class="text-background custom-rounded relative overflow-hidden"
  >
    <footer data-footer-parallax-inner class="h-dvh w-full">
      <div
        class="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center gap-15 text-center"
      >
        <h1 class="display">Build Your New<br />Future With Us</h1>
        <MagneticButton text="Start a Project" href="/contact" />
      </div>

      <div
        class="custom-grid absolute bottom-0 left-0 container flex w-full items-center justify-between pb-5"
      >
        <div class="col-start-1 col-end-6">
          <p class="label">© New Studio Partners 2025</p>
        </div>
        <div class="col-10 flex justify-end">
          <ScrambleLink href="https://www.instagram.com/wearenewstudio"
            >Instagram</ScrambleLink
          >
        </div>
        <div class="col-11 flex justify-end">
          <ScrambleLink href="https://www.linkedin.com/company/newstudio"
            >LinkedIn</ScrambleLink
          >
        </div>
        <div class="col-12 flex justify-end">
          <ScrambleLink href="https://github.com/wearenewstudio"
            >GitHub</ScrambleLink
          >
        </div>
        <div class=""></div>
      </div>

      <UnicornStudio
        project-id="FVq5PLXHCkcO64upxnI7"
        :lazy-load="true"
        :scale="1"
        :fps="60"
        container-class="w-full h-full"
      />
    </footer>
  </div>
</template>

<style scoped>
.custom-rounded {
  clip-path: xywh(0% 0% 100% 100% round 1.5rem 1.5rem 0 0);
}
</style>
