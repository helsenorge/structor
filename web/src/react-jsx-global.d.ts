// React 19: @types/react@19 removed the global JSX namespace.
// Re-export it so bare JSX.Element references work without per-file imports.
import type { JSX as ReactJSX } from "react";

declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
  }
}
