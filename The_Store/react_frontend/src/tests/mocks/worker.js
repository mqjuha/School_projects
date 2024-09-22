/** @format */

import { http } from "msw";
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Setup requests interception using the given handlers.
const worker = setupWorker(...handlers);
window.msw = { http, worker };

export { http, worker };
