declare global {
    interface Window {
        lastError: Error;
        useSentry: boolean;
        mtdNumberFormat: Intl.NumberFormat;
        mtdNeedsResetNumberFormatting: boolean;
    }
}

export default undefined;