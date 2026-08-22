// Norway SmartLife V6.0 Design Tokens - Motion
export const motion = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    cinematic: 1.5,
  },
  easing: {
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
  },
  variants: {
    pageEntrance: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    },
    heroImage: {
      initial: { scale: 1.05 },
      animate: { scale: 1, transition: { duration: 1.5, ease: 'easeOut' } }
    },
    hoverCard: {
      hover: { y: -5, transition: { duration: 0.3, ease: 'easeOut' } }
    }
  }
};
