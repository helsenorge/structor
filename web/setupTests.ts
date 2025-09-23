import "@testing-library/jest-dom/vitest";

import "./__mocks__/matchMedia.ts";
import "./__mocks__/IntersectionObserver.ts";
import "./__mocks__/scrollTo.ts";
class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserver;
