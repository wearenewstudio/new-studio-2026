<template>
  <ClientOnly>
    <div
      :id="elementId"
      :class="containerClass"
      :style="{ width: props.width, height: props.height, minHeight: '400px' }"
    />
    <template #fallback>
      <div
        :class="containerClass"
        :style="{
          width: props.width,
          height: props.height,
          minHeight: '400px',
        }"
      >
        Loading...
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  projectId?: string;
  filePath?: string;
  elementId?: string;
  fps?: number;
  scale?: number;
  dpi?: number;
  lazyLoad?: boolean;
  fixed?: boolean;
  altText?: string;
  ariaLabel?: string;
  production?: boolean;
  containerClass?: string;
  width?: string;
  height?: string;
  interactivity?: {
    mouse?: {
      disableMobile?: boolean;
      disabled?: boolean;
    };
  };
}

const props = withDefaults(defineProps<Props>(), {
  projectId: 'FVq5PLXHCkcO64upxnI7',
  elementId: undefined,
  fps: 60,
  scale: 1,
  dpi: 1.5,
  lazyLoad: true,
  fixed: false,
  production: true,
  containerClass: 'unicorn-embed',
  altText: 'Unicorn Studio Scene',
  ariaLabel: 'Interactive canvas scene',
  width: '100%',
  height: '100%',
});

// Generate unique element ID if not provided (use ref to ensure stability)
const uniqueId = `unicorn-studio-${Math.random().toString(36).substring(2, 9)}`;
const elementId = ref(props.elementId || uniqueId);

let scene: any = null;

// Load Unicorn Studio SDK script and initialize scene
onMounted(() => {
  if (import.meta.server) return;

  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).UnicornStudio) {
        resolve();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(
        'script[src*="unicornstudio.js"]'
      );
      if (existingScript) {
        // Wait for it to load
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject());
        return;
      }

      // Load the script
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.35/dist/unicornStudio.umd.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Failed to load Unicorn Studio SDK'));
      document.head.appendChild(script);
    });
  };

  loadScript()
    .then(() => {
      // Wait for next tick to ensure DOM element is rendered
      nextTick(() => {
        initializeScene();
      });
    })
    .catch(err => {
      console.error('Error loading Unicorn Studio SDK:', err);
    });
});

const initializeScene = () => {
  if (import.meta.server) return;

  const UnicornStudio = (window as any).UnicornStudio;

  if (!UnicornStudio) {
    // Retry after a short delay
    setTimeout(initializeScene, 100);
    return;
  }

  // Ensure the element exists in the DOM
  const element = document.getElementById(elementId.value);
  if (!element) {
    console.warn(`Element with id "${elementId.value}" not found, retrying...`);
    // Retry after a short delay if element not found
    setTimeout(initializeScene, 100);
    return;
  }

  // Ensure element has dimensions
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    console.warn('Element has no dimensions, waiting for layout...');
    setTimeout(initializeScene, 100);
    return;
  }

  UnicornStudio.addScene({
    elementId: elementId.value,
    fps: props.fps,
    scale: props.scale,
    dpi: props.dpi,
    projectId: props.projectId,
    filePath: props.filePath,
    lazyLoad: props.lazyLoad,
    fixed: props.fixed,
    altText: props.altText,
    ariaLabel: props.ariaLabel,
    production: props.production,
    interactivity: props.interactivity,
  })
    .then((initializedScene: any) => {
      scene = initializedScene;
    })
    .catch((err: Error) => {
      console.error('Failed to initialize Unicorn Studio scene:', err);
    });
};

onBeforeUnmount(() => {
  if (scene && typeof scene.destroy === 'function') {
    scene.destroy();
    scene = null;
  }
});

// Expose scene methods if needed
defineExpose({
  scene,
  resize: () => {
    if (scene && typeof scene.resize === 'function') {
      scene.resize();
    }
  },
  pause: () => {
    if (scene) {
      scene.paused = true;
    }
  },
  resume: () => {
    if (scene) {
      scene.paused = false;
    }
  },
});
</script>
