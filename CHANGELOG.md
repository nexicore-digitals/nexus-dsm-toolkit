# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.1.1] - 2025-11-12

### 🐛 Bug Fixes (v2.1.1)

- **CLI Streaming Logic**: Fixed a critical bug where the `--stream` flag was ignored by the `parse-json` command, causing it to incorrectly throw a `FileTooLarge` error instead of entering streaming mode. The orchestration logic in `parseJsonFromFile` has been updated to prioritize the stream flag over initial file size checks. **This fix has also been applied to `parseCsvFromFile` to ensure consistent streaming behavior for CSV files.**
- **Flexible JSON Streaming**: The streaming JSON parser (`parseJsonStream`) has been updated to correctly handle streams of multiple, distinct JSON objects (e.g., NDJSON or concatenated objects) by using `stream-json`'s `streamValues` and `jsonStreaming: true` options. This resolves syntax errors when parsing large files that are not a single, self-contained JSON array.
- **ESM Import Fix**: Corrected named import errors for `stream-chain` and `stream-json` by switching to default imports, resolving a `SyntaxError` when running in a pure ESM environment.

---

## [v2.1.0] - 2025-11-12

### ✨ Features (v2.1.0)

- **Intelligent File Parsing Orchestration**: The `parseCsvFromFile` and `parseJsonFromFile` functions now automatically detect large files (exceeding 50MB) and intelligently switch to stream-based processing to improve performance and reduce memory footprint for initial file loading.
- **Streaming JSON Parser (`parseJsonStream`)**: Introduced a new, dedicated streaming parser for JSON files (`src/parsers/json-stream-parser.ts`), leveraging `stream-json` and `stream-chain` for efficient, memory-optimized processing of very large JSON datasets. This function is also exposed in the public API.
- **CLI Stream Option**: The `nexus-dsm convert` and `nexus-dsm parse-json` CLI commands now support a `--stream` flag, allowing users to explicitly force streaming mode for JSON files, regardless of size.

### ♻️ Refactoring (v2.1.0)

- **CSV Stream Parser Rework**: The internal `parseCsvStream` implementation has been refactored to first read the entire input stream into a string before parsing with Papa Parse. This change simplifies the parsing logic for `parseCsvStream` but means it no longer processes CSV data in a true streaming fashion but rather as a buffered string, which may impact memory usage for very large files, but still good enough for most use cases.
- **JSON Streaming Integration**: Integrated `stream-json` and `stream-chain` as new dependencies to enable robust streaming JSON parsing.
- **Metadata Consistency**: Ensured consistent encoding metadata (`"utf-8"`) in the `ParsedFileMetaBuilder` for string-based CSV parsing.
- **Test Fixtures & Mocks**: Expanded test fixtures with `EMPTY_LINES`, `CSV_WITH_COMMENTS`, `CSV_TOO_LARGE`, and `JSON_TOO_LARGE` to improve test coverage for various file conditions and performance scenarios. Implemented `fs` and `fileAnalysis` mocks in tests for better isolation and control over file system interactions.

### 📦 Dependencies (v2.1.0)

- Added `stream-chain` (`^2.2.5`) and `stream-json` (`^1.9.1`) for streaming JSON parsing.
- Updated `@types/jsonstream`, `@types/stream-chain`, and `@types/stream-json` for type safety.

---

## [v2.0.0] - 2025-11-11

### 💥 Breaking Changes (v2.0.0)

- **Fully Asynchronous API**: The core conversion functions `convertToCsv` and `convertToJson` have been refactored to be fully asynchronous and now return a `Promise`. This change was made to properly support I/O operations (like `writeToFile: true`) without blocking the main thread. All calls to these functions must now use `await`.

### ✨ Features (v2.0.0)

- **TSV Support**: The `convertToCsv` function now fully supports Tab-Separated Values (TSV) output via the `{ tsv: true }` option. The parser also automatically detects TSV files.
  - **Streaming for CSV**: Added a `--stream` flag to process large CSV files efficiently.
  - **Smarter Input**: The CLI now accepts the input file as a direct positional argument (e.g., `nexus-dsm convert <path-to-file>`).
  - **Improved Error Handling**: The CLI provides clearer error messages and correctly exits with a non-zero status code on failure, making it reliable for scripting.
  - **Loading Indicator**: Added a visual spinner (`ora`) to provide feedback during operations.
- **File Output Option**: Both `convertToCsv` and `convertToJson` now support a `writeToFile: true` option, allowing users to write the output directly to a file instead of returning it as a string. The output file path can be specified via the `outputFilePath` option; if not provided, a default path is generated.
- **Logger Integration**: Introduced a centralized `winston` logger for consistent logging across the library and CLI, replacing all `logger.info` statements.
- **Example Updates**: All examples have been updated to demonstrate the new asynchronous API and file output capabilities.
- **New CLI Features**: Added a command-line interface with streaming support, smarter input handling, improved error messages, and a loading spinner.
- **Debian Package Build**: Added a `build-deb` script to generate a Debian package (`.deb`) for easy installation on Debian-based systems.

### 🐛 Bug fixtures (v2.0.0)

- **TSV/CSV Quoting and Spacing**: Definitively resolved formatting issues by implementing an intelligent quoting strategy in `papaparse`. Fields are now only quoted when necessary, ensuring clean and correct output.
- **Hanging Process on Exit**: Fixed a critical bug where scripts would hang after completion. This was resolved by ensuring all asynchronous operations are properly `await`-ed and that file/stream resources are correctly closed.
- **Test Suite Alignment**: Updated unit tests and snapshots to match the new asynchronous API and the improved quoting logic.

### ♻️ Refactoring (v2.0.0)

- **File I/O Abstraction**: Centralized file system operations into a new `file-analysis.ts` utility, separating file reading from core parsing logic.
- **Logger Integration**: Replaced all `logger.info` calls with a centralized `winston` logger for consistent, formatted output.
- **Codebase Cleanup**: Removed deprecated functions and types, and improved code organization for better maintainability.

---

## [v1.6.0] - 2025-11-03

### Added (v1.6.0)

- **Environment Checks:** Added runtime checks to `parseCsvFromFile` and `parseJsonFromFile` to prevent their use in browser environments and provide clear, actionable error messages.
- **Unit Tests:** Added unit tests to verify the new environment checks, ensuring they fail gracefully in a simulated browser environment.

### Changed (v1.6.0)

- **Browser Compatibility:** Refactored the core `parseCSV` function to be environment-agnostic by separating file system logic into a Node.js-specific `parseCsvFromFile` function. This makes the core parser safely importable in browser environments.

### Fixed (v1.6.0)

- **CSV Parser Robustness:** Resolved multiple test failures by improving header validation and empty file handling, making the CSV parser more reliable against common edge cases like trailing newlines.
- **Consistent Error Responses:** Corrected the error response shape for `parseCsvFromFile` to ensure it always returns a complete `CsvErrorResponse`, including the `detailedErrors` property for consistency.

---

## [v1.5.0] - 2025-10-29

### Added (v1.5.0)

- **TSV Format Support:** The `parseCSV` function now automatically detects tab-separated values (`.tsv`) and labels the format as `'tsv'` in the response metadata, making it a first-class citizen alongside CSV.
- **Flexible JSON Parsing:** The `parseJSON` function has been enhanced to accept pre-parsed JavaScript objects or arrays directly, in addition to raw JSON strings, improving flexibility and performance in certain workflows.

### Changed (v1.5.0)

- **Documentation:** Updated JSDoc, `README.md`, and examples for `parseCSV` and `parseJSON` to reflect the new capabilities.

## [v1.4.0] - 2025-10-29

### Added (v1.4.0)

- **Flexible JSON to CSV Flattening:** The `convertToCsv` function now accepts an `options` object with a `flattening` strategy.
  - `'shallow'` (default): Stringifies nested objects and arrays into a single cell.
  - `'deep'`: Recursively flattens nested structures into separate columns using dot (`profile.age`) and bracket (`tags[0]`) notation for objects and arrays.
- **Advanced CSV to JSON Un-flattening:** The `convertToJson` function now accepts an `options` object with an `unflatten` flag to control the output structure.
- **Enhanced Diagnostic Metadata:** The metadata returned by parsers is now significantly more expressive.
  - `meta.diagnostics` now includes an `eligibilityReason` string that clearly explains why data cannot be converted.
  - `meta.validationFlags` now includes an `inconsistentKeys` array, listing the specific keys that cause structural validation to fail.
  - `FailedConversionResult` now includes a `hints` array, providing actionable suggestions to fix ineligible data.
- **Conversion Process Metadata:** Successful conversion results now include a `conversionMeta` object, transparently reporting the `flattening` or `unflatten` strategy that was used.

### Changed (v1.4.0)

- **Smart Un-flattening by Default:** `convertToJson` now automatically detects flattened CSV headers (e.g., `user.name`, `tags[0]`) and reconstructs the original nested JSON object. This provides a seamless round-trip conversion for deep-flattened data. The old behavior can be forced by passing `{ unflatten: false }`.
- **Examples:** All examples have been updated to demonstrate how to access and log the new rich diagnostic and metadata properties.

### Fixed (v1.4.0)

- **Unit Test Corrections:** Updated multiple unit tests to correctly assert against `papaparse`'s default behavior of quoting all fields, resolving previously failing tests.
- **Recursive Flattener:** Implemented and tested a robust recursive flattener that correctly handles deeply nested objects and multi-level arrays.
- **Type Safety:** Corrected a TypeScript error in `convertToCsv` where the `conversionMeta` property was missing in the return path for empty datasets, ensuring consistent return types.

## [v1.3.0] - 2025-10-28

### BREAKING CHANGES (v1.3.0)

- **API Renaming:** Renamed `convertFromJson` to `convertToJson` to accurately reflect its function of converting a parsed CSV response into a JSON string. Consumers must update their code to use the new function name.

### Added (v1.3.0)

- **New Conversion Examples:** Added `examples/convert-to-csv.ts` and `examples/convert-to-json.ts` to demonstrate the full parse-then-convert workflow for both directions.
- **Public Structure Converters:** The `convertCsvStructure` and `convertJsonStructure` functions are now officially part of the public API, allowing developers to access normalized data structures for advanced use cases.

### Changed (v1.3.0)

- **Conversion Logic Overhaul:**
  - `convertToCsv` now correctly converts a parsed `JsonResponse` into a CSV string.
  - `convertToJson` now correctly converts a parsed `CsvResponse` into a JSON string.
- **Internal Integration:** `convertToCsv` now internally uses `convertJsonStructure` to normalize data before serialization, aligning with the library's modular architecture.
- **Documentation:** Updated `README.md` and all relevant JSDoc comments to reflect the corrected conversion logic and API renaming.

### Fixed (v1.3.0)

- **Runtime Import Error:** Fixed a `SyntaxError` at runtime by changing the `papaparse` import from a named import (`unparse`) to a default import (`Papa.unparse`).
- **Unit Test Correction:** Corrected the `convertToCsv` unit test for handling empty data to align with the new JSON-to-CSV logic and `papaparse`'s behavior.

## [v1.2.2] - 2025-10-20

### Fixed (v1.2.2)

- npm publish stale registry entries

## [v1.2.1] - 2025-10-19

### Fixed (v1.2.1)

- Resolved a potential silent data loss issue in `convertCsvStructure` when handling single-object data payloads.

### Changed (v1.2.1)

- **Documentation:** Improved JSDoc documentation across all barrel files (`parsers`, `converters`, `adapters`, `utils`, `types`) for better API discoverability.
- **Configuration:** Refined `jsr.json` to exclude the `dist` directory, aligning with JSR's source-first publishing model.
- **Code Quality:** Simplified complex type unions in `csv.errors.ts` to improve TypeScript compiler performance and made the public API for the `utils` module more explicit.

### Removed (v1.2.1)

- Deleted unused types in `filereader.ts` and the corresponding unused `eligibility.util.ts` utility and its test file to clean up the codebase.

## [v1.2.0] - 2025-10-19

### Added (v1.2.0)

- **JSON Analysis Utilities:** Added `calculateNestingDepth` and `checkKeyConsistency` helpers for deeper JSON structure analysis.
- **JSDoc:** Added comprehensive documentation to `ParsedFileMetaBuilder` and other utility modules.
- **Testing:** Added new tests for JSON analysis utilities and updated JSON parser tests to validate the new metadata response, including snapshot testing.

### Changed (v1.2.0)

- **JSON Parser Refactor:** The `json-parser` is now fully refactored to use the `ParsedFileMetaBuilder`, providing a rich `meta` object with accurate `nestingDepth` and validation flags. This completes Phase 1 of the roadmap.
- **Code Quality:** Improved project structure by adding barrel files for `parsers` and `adapters`. Removed unused types and simplified complex type unions for better compiler performance.

### BREAKING CHANGES (v1.2.0)

- The response structure of `parseJSON` has been updated to include a `meta: JsonParsedFileMeta` property. Consumers of the parser must be updated to handle this new, more detailed response shape.

## [v1.1.0] - 2025-10-18

### Added (v1.1.0)

- **Conversion Module (`src/converters/`):** Introduced a new module for data conversion with a modular, two-step process (structure normalization -> serialization).
- **Conversion Result Types (`src/types/conversion.ts`):** Defined rich, type-safe result interfaces (`JsonConversionResult`, `CsvConversionResult`, `CsvTabularConversion`) using discriminated unions for robust error handling.
- **Structure Normalization:** Added `convertJsonStructure` and `convertCsvStructure` helpers to create standardized, "conversion-ready" payloads from parsed data.
- **Converter Functions:** Implemented `convertToCsv` and `convertFromJson` to handle final serialization into string formats, guarded by metadata eligibility checks.
- **Testing:** Added comprehensive unit and snapshot tests for the new converter and structure normalization functions.

### Changed (v1.1.0)

- The main entry point (`src/index.ts`) now exports the new converter functions.

## [v1.0.0] - 2025-10-17

This is the initial major release, introducing a comprehensive metadata generation system and a significant architectural refactoring to support a developer-assisted validation workflow.

### Added (v1.0.0)

- **Metadata Interfaces (`src/types/meta.ts`):** Introduced `ParsedFileMeta`, `CsvParsedFileMeta`, and `JsonParsedFileMeta` to define a rich, structured report for every parsing operation.
- **`ParsedFileMetaBuilder` (`src/utils/`):** Created a new builder class to encapsulate the logic for constructing metadata objects, ensuring consistency and simplifying parser logic.
- **Orchestration Layer (`csv-parser-orchestration.ts`):** Added a new layer to handle file system operations (size checks, reading content) before parsing begins.
- **New File-Level Errors:** Added `FileTooLargeError`, `FileNotFoundError`, and `FileReadError` for more robust file handling.
- **Testing:** Added new tests to `csv-parser.test.ts` to validate the structure and content of the new `meta` object.
- **Documentation:**
  - Added a comprehensive `ROADMAP.md` to outline the project's trajectory.
  - Created `bug_report.md` and `feature_request.md` issue templates for GitHub.

### Changed (v1.0.0)

- **CSV Parser Refactoring (`src/parsers/csv-parser.ts`):** The CSV parser now uses the `ParsedFileMetaBuilder` to generate detailed metadata on both success and failure.
- **Error Priority Map:** Updated the error priority map to include the new file-level errors.
- **`README.md`:** Updated to link to the new `ROADMAP.md`.

### BREAKING CHANGES (v1.0.0)

- The structure of the success and error responses from `parseCSV` has changed. Both `CsvValidResponse` and `CsvErrorResponse` now include a `meta: CsvParsedFileMeta` property. Consumers of the parser must be updated to handle this new response shape.
