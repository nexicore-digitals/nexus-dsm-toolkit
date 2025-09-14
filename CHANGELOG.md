# 📜 Changelog

All notable changes to this project will be documented in this file.

This changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format  
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] – 2025-07-28

### ✨ Added

- Initial core Node.js toolkit for CSV ↔ JSON dataset management
- `src/parsers/`: Robust CSV and JSON parsing logic
- `src/validators/`: Comprehensive syntax, quote balance, and header validation
- `src/converters/`: Modules for CSV ↔ JSON format transformation
- `src/constants/`: Shared constants (e.g., custom error definitions)
- `src/adapters/`: Integration layers for external libraries
- Unit and integration testing suite using Vitest with coverage reporting
- `npm run example:csv` and `npm run example:json` scripts for quick demonstrations
- `CONTRIBUTING.md` for contributor guidelines
- `CODE_OF_CONDUCT.md` for community expectations

### 🔧 Changed

- **Architectural Overhaul**: Refactored to a pure Node.js architecture, removing all browser-specific dependencies (e.g., `FileReader`)
- Enhanced `README.md` with project phases, quick start guide, core capabilities, and folder structure

### 🐛 Fixed

- Resolved Vitest mocking issues for default exports, enabling consistent test suite execution

### 🗑️ Removed

- All direct browser environment dependencies

---
