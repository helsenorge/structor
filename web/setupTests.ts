import "@testing-library/jest-dom/vitest";

import "./__mocks__/matchMedia.ts";
import "./__mocks__/IntersectionObserver.ts";
import "./__mocks__/scrollTo.ts";

global.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// @ts-expect-error global is not defined
self.IS_REACT_ACT_ENVIRONMENT = true;
// @ts-expect-error global is not defined
window.IS_REACT_ACT_ENVIRONMENT = true;
// @ts-expect-error global is not defined
this.IS_REACT_ACT_ENVIRONMENT = true;
