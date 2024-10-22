const readFileFn = vi.fn();

Object.defineProperty(window, "FileReader", {
  writable: true,
  value: vi.fn(() => ({
    readAsDataURL: readFileFn,
    onLoad: vi.fn(),
  })),
});

export default FileReader;
