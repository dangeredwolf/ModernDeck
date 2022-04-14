/*
	Boot/Items/MustachePatcher.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { processMustaches } from "../../MustachePatcher"

export const initProcessMustaches = () => {
    if (typeof TD !== "undefined" && typeof TD.mustaches !== "undefined") {
        processMustaches();
    }
}