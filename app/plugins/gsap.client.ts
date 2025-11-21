import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, Flip, ScrambleTextPlugin, SplitText);

  // Make GSAP and plugins available globally
  return {
    provide: {
      gsap,
      ScrollTrigger,
      Flip,
      ScrambleTextPlugin,
      SplitText,
    },
  };
});
