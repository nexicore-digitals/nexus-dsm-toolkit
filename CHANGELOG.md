# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-28

### Added

* Initial core Node.js toolkit for CSV ↔ JSON dataset management.
* `src/parsers/`: Robust CSV and JSON parsing logic.
* `src/validators/`: Comprehensive syntax, quote balance, and header validation.
* `src/converters/`: Modules for CSV ↔ JSON format transformation.
* `src/constants/`: Dedicated folder for shared constants (e.g., custom error definitions).
* `src/adapters/`: Folder for integration layers.
* Unit and integration testing suite with Vitest and coverage reporting.
* `npm run example:csv` and `npm run example:json` scripts for quick demonstrations.
* `CONTRIBUTING.md` for contributor guidelines.
* `CODE_OF_CONDUCT.md` for community expectations.

### Changed

* **Architectural Overhaul:** Major refactor to a pure Node.js architecture, completely removing all browser-specific dependencies (e.g., `FileReader` references).
* Improved `README.md` with detailed project phases, quick start guide, core capabilities, and clear folder structure.

### Fixed

* Resolved Vitest mocking issues for default exports, enabling all test suites to pass consistently.

### Removed

* All direct browser environment dependencies.
