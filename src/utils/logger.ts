export const logger = {
    info: (...args: unknown[]) => {
        if (process.env.NODE_ENV !== "test") console.info(...args);
    },
    warn: (...args: unknown[]) => {
        if (process.env.NODE_ENV !== "test") console.warn(...args);
    },
    error: (...args: unknown[]) => {
        console.error(...args);
    },
};
