/// <reference types="vite/client"/>

import { setupWorker } from "msw/browser";

import handlers from "@helsenorge/core-build/handlers";

const dataFiles = import.meta.glob<JSON>("../../__data__/**/*.json");

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers(dataFiles));
