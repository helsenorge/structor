import { setupServer } from "msw/node";

import handlers from "../msw-helpers/handlers";
import { getDataFiles } from "../msw-helpers/msw-data-helper";

const dataFiles = getDataFiles(`${process.cwd()}/__data__`);

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers(dataFiles));
