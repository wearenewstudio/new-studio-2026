# Scramble Text Setup Guide

This project includes a scramble text implementation using GSAP premium plugins. This guide explains how to set it up.

## Requirements

The scramble text feature requires two GSAP premium plugins:
- **ScrambleTextPlugin** - For the scrambling animation effect
- **SplitText** - For splitting text into words and characters

These plugins are part of the **Club GreenSock** membership. You'll need to:
1. Sign up for a Club GreenSock membership at [greensock.com/club](https://greensock.com/club)
2. Download the premium plugins
3. Add them to your project

## Installation Steps

### 1. Get Club GreenSock Membership

Visit [greensock.com/club](https://greensock.com/club) and sign up for a membership.

### 2. Download Premium Plugins

After signing up, download:
- `ScrambleTextPlugin.js` (or `.min.js`)
- `SplitText.js` (or `.min.js`)

### 3. Add Plugins to Your Project

Create a directory for GSAP premium plugins:

```bash
mkdir -p public/gsap-plugins
```

Place the downloaded plugin files in this directory, or add them to your project in a way that they can be imported.

### 4. Update Plugin Registration

The plugins are automatically registered in `app/plugins/lenis.client.ts`. If you need to manually import them, you can update the plugin file to import from your local files:

```typescript
// Example if plugins are in public/gsap-plugins
import ScrambleTextPlugin from '/gsap-plugins/ScrambleTextPlugin.min.js';
import SplitText from '/gsap-plugins/SplitText.min.js';
```

## Usage

### Component-Based Approach (Recommended)

Use the `ScrambleText` and `ScrambleButton` components:

```vue
<template>
  <ScrambleText trigger="load" heading-tag="h1">
    This will scramble on page load
  </ScrambleText>

  <ScrambleText trigger="scroll" :bg-light="true">
    This will scramble on scroll
  </ScrambleText>

  <ScrambleButton custom-hover-text="Custom hover text">
    Hover me
  </ScrambleButton>
</template>
```

### Data Attribute Approach

You can also use the original data-attribute approach. The `scramble.client.ts` plugin will automatically initialize elements with the appropriate data attributes:

```vue
<template>
  <h1 data-scramble="load" class="scramble-heading">
    This will scramble on load
  </h1>

  <h2 data-scramble="scroll" class="scramble-heading">
    This will scramble on scroll
  </h2>

  <a data-scramble-hover="link" href="#">
    <p data-scramble-hover="target" data-scramble-text="Custom text">
      Hover me
    </p>
  </a>
</template>
```

### Composable Approach

For more control, use the composable directly:

```vue
<script setup>
const { initScramble } = useScrambleText();
const headingRef = ref(null);

onMounted(() => {
  if (headingRef.value) {
    initScramble(headingRef.value, {
      trigger: 'scroll',
      chars: 'upperCase',
      duration: 1.4,
    });
  });
});
</script>

<template>
  <h2 ref="headingRef">My heading</h2>
</template>
```

## Available Options

### ScrambleText Component Props

- `trigger`: `'load' | 'scroll' | 'hover'` - When to trigger the animation
- `headingTag`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` - HTML heading tag
- `bgLight`: `boolean` - Add light background
- `scrambleAlt`: `boolean` - Use alternative scramble characters
- `chars`: `string` - Custom scramble characters (default: `'upperCase'`)
- `duration`: `number` - Animation duration
- `stagger`: `number` - Stagger delay between words
- `speed`: `number` - Scramble speed

### ScrambleButton Component Props

- `href`: `string` - Link URL
- `customHoverText`: `string` - Text to show on hover
- `chars`: `string` - Scramble characters for hover effect

## Demo Pages

- `/scramble-demo` - Component-based approach
- `/scramble-demo-data-attr` - Data attribute approach

## Troubleshooting

### Plugins Not Loading

If you see warnings in the console about plugins not being available:
1. Verify you have a Club GreenSock membership
2. Check that plugin files are in the correct location
3. Ensure the plugin registration in `app/plugins/lenis.client.ts` is correct

### Animations Not Working

1. Check browser console for errors
2. Verify GSAP and ScrollTrigger are loaded
3. Ensure you're on the client-side (plugins are client-only)

## Notes

- All scramble functionality is client-side only (SSR-safe)
- The plugins gracefully degrade if premium plugins aren't available
- You can use either the component approach or data-attribute approach, or both

