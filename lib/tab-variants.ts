import type { AnimationGeneratorType, Variants } from 'motion';

export type TabIndicatorVariant = 'underline' | 'pill' | 'slide';

export type TabContentVariant = 'fade' | 'slide' | 'slideUp';

export const indicatorVariants: Record<
  TabIndicatorVariant,
  {
    transition: {
      type?: AnimationGeneratorType;
      stiffness?: number;
      damping?: number;
      duration?: number;
      mass?: number;
    };
  }
> = {
  underline: {
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 28,
      mass: 0.8,
    },
  },
  pill: {
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 24,
      mass: 0.9,
    },
  },
  slide: {
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 30,
      mass: 0.85,
    },
  },
};

export const contentVariants: Record<TabContentVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  },
  slide: {
    hidden: { opacity: 0, x: 12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -12,
      transition: {
        duration: 0.2,
      },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -4,
      transition: {
        duration: 0.2,
      },
    },
  },
};
