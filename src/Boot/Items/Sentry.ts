/*
	Boot/Items/Sentry.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import { buildVersion } from "../../BuildProps.json";

const useSentry = true;

export const initSentry = () => {
    if (useSentry) {
        Sentry.init({
            dsn: "https://92f593b102fb4c1ca010480faed582ae@o110170.ingest.sentry.io/242524",
        
            // To set your release version
            release: "moderndeck@" + buildVersion,
            integrations: [new Integrations.BrowserTracing()],
        
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        
        });
    }
}

window.useSentry = useSentry;