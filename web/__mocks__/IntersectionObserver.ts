class IntersectionObserver {
  observe(): void {
    // do nothing
  }
  unobserve(): void {
    // do nothing
  }
  disconnect(): void {
    // do nothing
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  value: IntersectionObserver,
});

export default IntersectionObserver;
