import { processMustaches } from "../../MustachePatcher"

export const initProcessMustaches = () => {
    if (typeof TD !== "undefined" && typeof TD.mustaches !== "undefined") {
        
    }
    processMustaches();
}