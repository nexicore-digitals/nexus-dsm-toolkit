# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.2.1] - 2025-10-19

### Fixed

- Resolved a potential silent data loss issue in `convertCsvStructure` when handling single-object data payloads.

### Changed

- **Documentation:** Improved JSDoc documentation across all barrel files (`parsers`, `converters`, `adapters`, `utils`, `types`) for better API discoverability.
- **Configuration:** Refined `jsr.json` to exclude the `dist` directory, aligning with JSR's source-first publishing model.
- **Code Quality:** Simplified complex type unions in `csv.errors.ts` to improve TypeScript compiler performance and made the public API for the `utils` module more explicit.

### Removed

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
