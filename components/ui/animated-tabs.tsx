'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import {
  contentVariants,
  indicatorVariants,
  type TabContentVariant,
  type TabIndicatorVariant,
} from '@/lib/tab-variants';
import { cn } from '@/lib/utils';

interface IndicatorLayout {
  left: number;
  width: number;
}

interface AnimatedTabsContextValue {
  indicatorVariant: TabIndicatorVariant;
  contentVariant: TabContentVariant;
  value: string;
  listRef: React.RefObject<HTMLDivElement | null>;
  indicatorLayout: IndicatorLayout | null;
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
}

export interface AnimatedTabsProps extends React.ComponentProps<
  typeof TabsPrimitive.Root
> {
  /** @public Indicator animation: underline, pill or slide */
  indicator?: TabIndicatorVariant;
  /** @public Content animation: fade, slide or slideUp */
  contentAnimation?: TabContentVariant;
}

export interface AnimatedTabsListProps extends React.ComponentProps<
  typeof TabsPrimitive.List
> {
  indicatorClassName?: string;
}

const AnimatedTabsContext = createContext<AnimatedTabsContextValue | null>(
  null,
);

const useAnimatedTabs = () => {
  const ctx = useContext(AnimatedTabsContext);

  if (!ctx) {
    throw new Error(
      'useAnimatedTabs must be used within an AnimatedTabs provider',
    );
  }

  return ctx;
};

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  indicator = 'underline',
  contentAnimation = 'fade',
  className,
  onValueChange,
  ...props
}) => {
  const [indicatorLayout, setIndicatorLayout] =
    useState<IndicatorLayout | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(
    () => props.defaultValue ?? '',
  );
  const activeTab = props.value ?? uncontrolledValue;

  const listRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleValueChange = useCallback(
    (next: string) => {
      if (props.value === undefined) {
        setUncontrolledValue(next);
      }

      onValueChange?.(next);
    },
    [onValueChange, props.value],
  );

  const registerTrigger = useCallback(
    (value: string, el: HTMLButtonElement | null) => {
      if (el) {
        triggerRefs.current.set(value, el);
      } else {
        triggerRefs.current.delete(value);
      }
    },
    [],
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const ro = new ResizeObserver(() => {
      const listRect = list.getBoundingClientRect();
      const trigger = activeTab
        ? triggerRefs.current.get(activeTab)
        : undefined;

      if (!trigger) {
        setIndicatorLayout(null);
        return;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const newLayout = {
        left: triggerRect.left - listRect.left,
        width: triggerRect.width,
      };

      setIndicatorLayout((prevLayout) => {
        if (
          !prevLayout ||
          prevLayout.left !== newLayout.left ||
          prevLayout.width !== newLayout.width
        ) {
          return newLayout;
        }
        return prevLayout;
      });
    });

    ro.observe(list);

    return () => ro.disconnect();
  }, [activeTab]);

  return (
    <AnimatedTabsContext.Provider
      value={{
        indicatorVariant: indicator,
        contentVariant: contentAnimation,
        value: activeTab,
        listRef,
        indicatorLayout,
        registerTrigger,
      }}
    >
      <TabsPrimitive.Root
        data-slot="animated-tabs"
        className={cn('flex flex-col gap-2', className)}
        {...props}
        onValueChange={handleValueChange}
      />
    </AnimatedTabsContext.Provider>
  );
};

const AnimatedTabsList = forwardRef<HTMLDivElement, AnimatedTabsListProps>(
  ({ className, children, indicatorClassName, ...props }, ref) => {
    const { listRef, indicatorLayout, indicatorVariant } = useAnimatedTabs();

    const transition = indicatorVariants[indicatorVariant].transition;

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [listRef, ref],
    );

    return (
      <TabsPrimitive.List
        ref={setRef}
        data-slot="animated-tabs-list"
        className={cn(
          'relative inline-flex h-10 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
          className,
        )}
        {...props}
      >
        {children}

        {indicatorLayout && (
          <motion.div
            className={cn(
              'absolute rounded-md',
              indicatorVariant === 'underline' &&
                'bottom-0 left-0 h-0.5 bg-primary',
              (indicatorVariant === 'pill' || indicatorVariant === 'slide') &&
                'top-1 bottom-1 bg-background shadow-sm',
              indicatorClassName,
            )}
            style={{
              left: indicatorLayout.left,
              width: indicatorLayout.width,
            }}
            layout
            transition={transition}
            aria-hidden
          />
        )}
      </TabsPrimitive.List>
    );
  },
);

AnimatedTabsList.displayName = 'AnimatedTabsList';

const AnimatedTabsTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof TabsPrimitive.Trigger>
>(({ className, value, ...props }, ref) => {
  const { registerTrigger } = useAnimatedTabs();
  const triggerValue = value ?? '';

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      registerTrigger(triggerValue, node);

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [registerTrigger, triggerValue, ref],
  );

  return (
    <TabsPrimitive.Trigger
      ref={setRef}
      data-slot="animated-tabs-trigger"
      value={value}
      className={cn(
        'relative z-1 inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors',
        'hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  );
});
AnimatedTabsTrigger.displayName = 'AnimatedTabsTrigger';

const AnimatedTabsContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof TabsPrimitive.Content>
>(({ className, value, children, ...props }, ref) => {
  const { contentVariant } = useAnimatedTabs();

  const variants = contentVariants[contentVariant];

  return (
    <TabsPrimitive.Content
      ref={ref}
      data-slot="animated-tabs-content"
      value={value}
      className={cn('flex-1 outline-none', className)}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="py-2"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </TabsPrimitive.Content>
  );
});

AnimatedTabsContent.displayName = 'AnimatedTabsContent';

export {
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger,
};
