import { vi } from "vitest";

export const mockWindowMatchMedia = vi.fn().mockImplementation(() => ({
  matches: true,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mockWindowMatchMedia,
});

export default mockWindowMatchMedia;
