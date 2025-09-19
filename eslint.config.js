// eslint.config.js
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vitestPlugin from "eslint-plugin-vitest";
import importPlugin from "eslint-plugin-import";

export default [
    { ignores: ["src/utils/logger.ts"] },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            vitest: vitestPlugin,
            import: importPlugin,
        },
        rules: {
            // TypeScript essentials
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",

            // General clarity
            "no-console": "warn",
            "prefer-const": "error",
            eqeqeq: ["error", "smart"],

            // Vitest hygiene
            "vitest/no-focused-tests": "error",
            "vitest/no-identical-title": "error",

            "import/extensions": [
                "error",
                "ignorePackages",
                {
                    ts: "always",
                    js: "never",
                },
            ],
        },
    },
    {
        files: ["**/__tests__/**/*.ts"],
        languageOptions: {
            globals: {
                vi: true,
                describe: true,
                it: true,
                expect: true,
            },
        },
    },
];
