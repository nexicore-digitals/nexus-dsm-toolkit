# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
