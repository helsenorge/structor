import { useRef, useCallback } from "react";

type ScrollOptions = ScrollIntoViewOptions;

const defaultOptions: ScrollOptions = {
  behavior: "smooth",
  block: "start",
  inline: "nearest",
};

/**
 * A custom React hook for scrolling to a specific element on the page.
 * It provides a ref to attach to the target element and a function to trigger the scroll.
 *
 * @param options - Configuration for the scroll behavior (e.g., smooth, auto).
 * @returns An object containing `targetRef` and `scrollToTarget`.
 */
export const useScrollToElement = <T extends HTMLElement>(
  options: ScrollOptions = defaultOptions,
): {
  targetRef: React.RefObject<T>;
  scrollToTarget: () => void;
} => {
  const targetRef = useRef<T>(null);

  const { behavior, block, inline } = options;

  const scrollToTarget = useCallback(() => {
    targetRef.current?.scrollIntoView({
      behavior,
      block,
      inline,
    });
  }, [targetRef, behavior, block, inline]);

  return {
    targetRef,
    scrollToTarget,
  };
};
