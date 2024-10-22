import { setupServer } from "msw/node";

import handlers from "@helsenorge/core-build/handlers";
import { getDataFiles } from "@helsenorge/core-build/msw-data-helper";

const dataFiles = getDataFiles(`${process.cwd()}/__data__`);

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers(dataFiles));
