import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default defineNuxtPlugin(async () => {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Import GSAP premium plugins (requires Club GreenSock membership)
  // These will be undefined if not available, but won't break the app
  let ScrambleTextPlugin: any;
  let SplitText: any;

  // Try to import premium plugins - they may not be available
  // If you have Club GreenSock membership, add these files to your project
  try {
    // @ts-ignore - Premium plugins may not have types
    const scrambleModule = await import('gsap/ScrambleTextPlugin');
    ScrambleTextPlugin = scrambleModule.ScrambleTextPlugin;
    if (ScrambleTextPlugin) {
      gsap.registerPlugin(ScrambleTextPlugin);
    }
  } catch (e) {
    // Plugin not available - will need to be added manually if you have Club membership
    console.warn(
      'ScrambleTextPlugin not available. Club GreenSock membership required.'
    );
  }

  try {
    // @ts-ignore - Premium plugins may not have types
    const splitModule = await import('gsap/SplitText');
    SplitText = splitModule.SplitText;
  } catch (e) {
    // Plugin not available - will need to be added manually if you have Club membership
    console.warn(
      'SplitText not available. Club GreenSock membership required.'
    );
  }

  // Make GSAP and plugins available globally
  return {
    provide: {
      gsap,
      ScrollTrigger,
      ScrambleTextPlugin,
      SplitText,
    },
  };
});
