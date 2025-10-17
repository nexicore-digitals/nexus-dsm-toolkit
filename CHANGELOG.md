# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - YYYY-MM-DD

### Added

- **Conversion Module (`src/converters/`):** Introduced a new module for data conversion with a modular, two-step process (structure normalization -> serialization).
- **Conversion Result Types (`src/types/conversion.ts`):** Defined rich, type-safe result interfaces (`JsonConversionResult`, `CsvConversionResult`, `CsvTabularConversion`) using discriminated unions for robust error handling.
- **Structure Normalization:** Added `convertJsonStructure` and `convertCsvStructure` helpers to create standardized, "conversion-ready" payloads from parsed data.
- **Converter Functions:** Implemented `convertToCsv` and `convertFromJson` to handle final serialization into string formats, guarded by metadata eligibility checks.
- **Testing:** Added comprehensive unit and snapshot tests for the new converter and structure normalization functions.

### Changed

- The main entry point (`src/index.ts`) now exports the new converter functions.

## [1.0.0] - 2025-10-17

This is the initial major release, introducing a comprehensive metadata generation system and a significant architectural refactoring to support a developer-assisted validation workflow.

### Added

- **Metadata Interfaces (`src/types/meta.ts`):** Introduced `ParsedFileMeta`, `CsvParsedFileMeta`, and `JsonParsedFileMeta` to define a rich, structured report for every parsing operation.
- **`ParsedFileMetaBuilder` (`src/utils/`):** Created a new builder class to encapsulate the logic for constructing metadata objects, ensuring consistency and simplifying parser logic.
- **Orchestration Layer (`csv-parser-orchestration.ts`):** Added a new layer to handle file system operations (size checks, reading content) before parsing begins.
- **New File-Level Errors:** Added `FileTooLargeError`, `FileNotFoundError`, and `FileReadError` for more robust file handling.
- **Testing:** Added new tests to `csv-parser.test.ts` to validate the structure and content of the new `meta` object.
- **Documentation:**
  - Added a comprehensive `ROADMAP.md` to outline the project's trajectory.
  - Created `bug_report.md` and `feature_request.md` issue templates for GitHub.

### Changed

- **CSV Parser Refactoring (`src/parsers/csv-parser.ts`):** The CSV parser now uses the `ParsedFileMetaBuilder` to generate detailed metadata on both success and failure.
- **Error Priority Map:** Updated the error priority map to include the new file-level errors.
- **`README.md`:** Updated to link to the new `ROADMAP.md`.

### BREAKING CHANGES

- The structure of the success and error responses from `parseCSV` has changed. Both `CsvValidResponse` and `CsvErrorResponse` now include a `meta: CsvParsedFileMeta` property. Consumers of the parser must be updated to handle this new response shape.
