#!/usr/bin/env node
import yargs from "yargs";
import path from "path";
import { hideBin } from "yargs/helpers";
import {
    parseCsvFromFile,
    convertToJson,
    parseJsonFromFile,
    convertToCsv,
} from "./src/index.js";
import { logger } from "./logger.js"; // Assuming logger.js is in the root
import ora from "ora";

async function main() {
    logger.info("Nexus DSM CLI starting...");
    await yargs(hideBin(process.argv))
        .command(
            "convert <input>",

            "Convert between CSV/TSV and JSON",
            (yargs) => {
                return yargs
                    .option("output", {
                        alias: "o",
                        describe: "Output file path (optional)",
                        type: "string",
                    })
                    .option("from", {
                        describe: "Input format (csv, tsv, json)",
                        type: "string",
                    })
                    .option("to", {
                        describe: "Output format (csv, tsv, json)",
                        type: "string",
                    })
                    .option("tsv", {
                        describe:
                            "Force output to TSV format. Overrides --to and output extension.",
                        type: "boolean",
                        default: false,
                    })
                    .option("flattening", {
                        describe: "Flattening strategy (deep or shallow)",
                        type: "string",
                    })
                    .option("stream", {
                        describe: "Stream the input file",
                        type: "boolean",
                        default: false,
                    });
            },
            async (argv) => {
                const spinner = ora("Preparing conversion...").start();

                // Improved error handling for missing input
                if (!argv.input) {
                    spinner.fail("Operation failed.");
                    logger.error("Missing input file path.");
                    logger.info(
                        "Usage: nexus-dsm convert <path-to-input-file> [options]"
                    );
                    process.exit(1);
                }

                try {
                    // --- 1. Infer `from` format ---
                    const from =
                        argv.from ||
                        path.extname(argv.input as string).slice(1);
                    if (!["csv", "tsv", "json"].includes(from)) {
                        throw new Error(
                            `Cannot infer input format from "${argv.input}". Please use the --from flag.`
                        );
                    }

                    // --- 2. Determine `to` format and `isTsv` flag ---
                    let to = argv.to;
                    const isTsv = argv.tsv; // Explicit --tsv flag takes highest priority

                    if (isTsv) {
                        to = "tsv";
                    } else if (!to) {
                        if (argv.output) {
                            to = path.extname(argv.output).slice(1);
                        } else {
                            // Default conversion direction
                            to = from === "json" ? "csv" : "json";
                        }
                    }

                    // --- 3. Determine `output` path ---
                    let output = argv.output;
                    if (!output) {
                        const inputPath = path.parse(argv.input as string);
                        output = path.join(
                            inputPath.dir,
                            `${inputPath.name}.${to}`
                        );
                    }

                    spinner.text = `Converting ${from} to ${to}...`;

                    // --- 4. Execute Conversion ---
                    if ((from === "csv" || from === "tsv") && to === "json") {
                        const csvResponse = await parseCsvFromFile(
                            argv.input as string,
                            // Pass stream option to the parser
                            { stream: argv.stream }
                        );
                        if (csvResponse.success) {
                            await convertToJson(csvResponse, {
                                unflatten: true,
                                outputPath: output,
                                writeToFile: true,
                            });
                        } else {
                            throw new Error(
                                `CSV parsing failed: ${csvResponse.message}`
                            );
                        }
                    } else if (
                        from === "json" &&
                        (to === "csv" || to === "tsv")
                    ) {
                        const jsonResponse = await parseJsonFromFile(
                            argv.input as string
                        );
                        if (jsonResponse.success) {
                            await convertToCsv(jsonResponse, {
                                flattening: argv.flattening as any,
                                outputPath: output,
                                writeToFile: true,
                                tsv: to === "tsv", // Ensure tsv option is set
                            });
                        } else {
                            throw new Error(
                                `JSON parsing failed: ${jsonResponse.message}`
                            );
                        }
                    } else {
                        throw new Error(
                            `Unsupported conversion: from "${from}" to "${to}".`
                        );
                    }

                    spinner.succeed(
                        `Conversion complete! Output saved to ${output}`
                    );
                } catch (error: any) {
                    spinner.fail("Operation failed.");
                    logger.error(error.message);
                    process.exit(1);
                }
            }
        )
        .command(
            "parse-csv <input>",
            "Parse a CSV/TSV file and log its metadata",
            (yargs) => {
                return yargs.positional("input", {
                    describe: "Path to the CSV file to parse",
                    type: "string",
                    demandOption: true,
                });
            },
            async (argv) => {
                const spinner = ora(`Parsing CSV file: ${argv.input}`).start();
                try {
                    const response = await parseCsvFromFile(
                        argv.input as string,
                        { stream: argv.stream as boolean }
                    );

                    if (response.success) {
                        spinner.succeed("CSV parsing successful!");
                        const {
                            fields,
                            rowCount,
                            eligibleForConversion,
                            delimiter,
                        } = response.meta;
                        logger.info(`\n--- Metadata ---`);
                        logger.info(`  - Delimiter: "${delimiter}"`);
                        logger.info(`  - Headers: [${fields.join(", ")}]`);
                        logger.info(`  - Row Count: ${rowCount}`);
                        logger.info(
                            `  - Eligible for Conversion: ${eligibleForConversion}`
                        );
                        logger.info(`----------------`);
                    } else {
                        spinner.fail("CSV parsing failed.");
                        // Log details after the spinner has stopped.
                        logger.error(`\n--- Failure Info ---`);
                        logger.error(`  Error: ${response.message}`);
                        logger.error(`  - Type: ${response.type}`);
                        logger.error(`  - Code: ${response.code}`);
                        if (response.detailedErrors) {
                            logger.error(`  - Detailed Errors:`);
                            response.detailedErrors.forEach((err) =>
                                logger.error(
                                    `    - [${err.code}] ${err.message}`
                                )
                            );
                        }
                    }
                } catch (error: any) {
                    spinner.fail("Parsing failed.");
                    logger.error(error.message);
                    process.exit(1);
                }
            }
        )
        .command(
            "parse-json <input>",
            "Parse a JSON file and log its metadata",
            (yargs) => {
                return yargs.positional("input", {
                    describe: "Path to the JSON file to parse",
                    type: "string",
                    demandOption: true,
                });
            },
            async (argv) => {
                const spinner = ora(`Parsing JSON file: ${argv.input}`).start();
                try {
                    const response = await parseJsonFromFile(
                        argv.input as string
                    );

                    if (response.success) {
                        spinner.succeed("JSON parsing successful!");
                        const {
                            structureType,
                            nestingDepth,
                            rowCount,
                            eligibleForConversion,
                            validationFlags,
                        } = response.meta;
                        logger.info(`\n--- Metadata ---`);
                        logger.info(`  - Structure Type: ${structureType}`);
                        logger.info(`  - Nesting Depth: ${nestingDepth}`);
                        logger.info(`  - Root Item Count: ${rowCount}`);
                        logger.info(
                            `  - Has Consistent Keys: ${validationFlags.hasConsistentKeys}`
                        );
                        logger.info(
                            `  - Eligible for Conversion: ${eligibleForConversion}`
                        );
                        logger.info(`----------------`);
                    } else {
                        spinner.fail("JSON parsing failed.");
                        // Log details after the spinner has stopped.
                        logger.error(`\n--- Failure Info ---`);
                        logger.error(`  Error: ${response.message}`);
                        logger.error(`  - Type: ${response.type}`);
                        logger.error(`  - Code: ${response.code}`);
                        if (response.detailedErrors) {
                            logger.error(`  - Detailed Errors:`);
                            response.detailedErrors.forEach((err) =>
                                logger.error(`  - [${err.code}] ${err.message}`)
                            );
                        }
                    }
                } catch (error: any) {
                    spinner.fail("Parsing failed.");
                    logger.error(error.message);
                    process.exit(1);
                }
            }
        )
        .demandCommand(1, "You must specify a command")
        .help().argv;
}
main();
