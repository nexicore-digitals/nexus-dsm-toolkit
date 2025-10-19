import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        coverage: {
            reporter: ["html", "text"],
            reportsDirectory: "./coverage",
        },
        include: ["**/*.test.ts"],
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/cypress/**",
            "mod.ts",
        ],
    },
});
