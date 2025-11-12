# 🗺️ Nexus DSM - Project Roadmap

Our development trajectory is focused on building a comprehensive, developer-first toolkit for data management.

## ✅ **Phase 1: Core Engine (Complete)**

- **Robust Parsing:** Implemented resilient parsers for CSV and JSON with detailed error reporting.
- **Rich Metadata:** Generate comprehensive metadata for every parsing operation, including validation flags and diagnostic info.
- **Intelligent Conversion:** Full round-trip conversion between CSV and JSON with smart defaults and flexible options (`deep`/`shallow` flattening and un-flattening).
- **High-Performance Streaming Parsers**: Implemented intelligent orchestration for `parseCsvFromFile` and `parseJsonFromFile` to automatically leverage stream-based processing for large files, including a new dedicated streaming JSON parser.
- **Developer-First Diagnostics:** Provide expressive error messages, hints, and eligibility reasons to make debugging data issues fast and intuitive.

## ✅ **Phase 2: Advanced Validation & Tooling (Complete)**

- **CLI (Command-Line Interface):** Built a powerful CLI for performing parsing, conversion, and validation directly from the terminal, with streaming support for large files.
- **Expanded Format Support:** Added full parsing and conversion support for Tab-Separated Values (`.tsv`).

## ⏳ **Phase 3: Service & Advanced Validation (In Progress)**

- **Schema Validation:** Integrate support for `zod` and `JSON Schema` to validate data against predefined structures.
- **Dataset Indexing:** Develop an indexing module for creating searchable, hash-based maps of datasets, enabling efficient querying and lookups.
- **API Layer:** Expose the toolkit's functionality via a RESTful API for remote orchestration and integration with other services.
- **UI Integration:** Continue to support and align with the separate `nexus-dsm-ui` project for visualization and interactive use.

---

## 🤝 How to Contribute

We welcome community feedback and contributions to help shape the future of the toolkit! Whether it's a bug report, a feature request, or a pull request, your input helps make Nexus DSM better.

1. **Check for Existing Issues:** Before creating a new issue, please check if a similar one already exists.
2. **Create an Issue:** For new features or bugs, open an issue to start a discussion.
3. **Fork & Create a PR:** If you're ready to contribute code, please fork the repository and submit a pull request.

Thank you for helping us build a better toolkit for data management!
