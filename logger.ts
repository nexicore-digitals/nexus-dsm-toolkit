import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

/**
 * A pre-configured logger instance for the CLI.
 *
 * It provides structured, colorized, and timestamped output. The log level
 * can be controlled via the `LOG_LEVEL` environment variable.
 *
 * Default level: 'info'
 */

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
});
