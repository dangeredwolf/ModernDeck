export const urlExchange = () => {
    if (typeof window.MTDURLExchange === "object" && typeof window.MTDURLExchange.getAttribute === "function") {
        window.mtdBaseURL = window.MTDURLExchange.getAttribute("type");
        console.info("MTDURLExchange completed with URL " + window.mtdBaseURL);
    }
}