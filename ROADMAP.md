# 🗺️ Nexus DSM - Project Roadmap

Welcome to the official roadmap for the **Nexus DSM (Dataset Management) Toolkit**. This document outlines our development trajectory, detailing planned features, project phases, and long-term goals. Our mission is to build a transparent, developer-centric toolkit for data parsing, validation, and conversion.

This is a living document. Priorities may shift based on development progress and community feedback. We welcome your ideas and contributions!

---

## 🧭 Core Philosophy

> _Your data is yours. You deserve control, clarity, and confidence._

Unlike "black box" tools, Nexus DSM is designed to be a **developer-assisted validation engine**. Every feature we build aims to provide visibility, explainable feedback, and granular control over the data transformation process.

---

## 🚦 Status Legend

| Icon | Status          | Description                                           |
| :--: | --------------- | ----------------------------------------------------- |
| ✅   | **Completed**   | Feature is implemented, tested, and released.         |
| ⏳   | **In Progress** | Actively in development.                              |
| 🟡   | **Planned**     | Slated for a near-future release.                     |
| 💡   | **Idea**        | A potential feature being considered for the future.  |
| 🟢   | **Optional**    | A valuable extension but not core to the main library.|

---

## 🚀 Development Phases

### Phase 1: Core Node.js Utility

**Status:** Mostly Complete ✅

**Goal:** Establish a stable, environment-agnostic Node.js library for core parsing and validation tasks. This phase focuses on creating a robust, well-tested foundation.

| Feature                                       | Status    | Description                                                                                             |
| --------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| **Core Parsing Engine**                       | ✅        | Parse CSV and JSON array inputs into a standardized internal representation.                            |
| **Syntax Validation**                         | ✅        | Detect structural issues like quote imbalances, malformed rows, and inconsistent delimiters.            |
| **Schema Validation Integration**             | ✅        | Validate data against user-defined schemas using `Zod` and `JSON Schema`.                               |
| **Metadata Generation (`ParsedFileMeta`)**    | ⏳        | Create a rich metadata object containing file stats, validation results, and eligibility flags.         |
| **Metadata-Guarded Conversions**              | ⏳        | Use `ParsedFileMeta` flags to determine if a file is safe to convert between CSV and JSON.              |
| **Initial Test Suite**                        | ✅        | Establish comprehensive unit and integration tests for all core functionality.                          |

### Phase 2: Expanded Capabilities & Browser Support

**Status:** Planned 🟡

**Goal:** Enhance the core library with advanced features and introduce support for browser environments.

| Feature                                       | Status    | Description                                                                                             |
| --------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| **Browser-Compatible Bundle**                 | 🟡        | Create a UMD/ESM bundle using `tsup`, `vite`, or `rollup` for use in modern browsers.                     |
| **Advanced Header Analysis**                  | 🟡        | Detect ambiguous, duplicate, or missing headers. Suggest corrections using Levenshtein distance.        |
| **Dataset Indexing (Initial)**                | 🟡        | Implement basic indexing (e.g., column hashing, structure mapping) to prepare for advanced workflows.   |
| **Enhanced Error Reporting**                  | 🟡        | Provide more descriptive error messages with row/column numbers and suggestions for fixes.              |
| **Performance Benchmarking**                  | 🟡        | Establish a baseline for performance and optimize hot paths in the parsing and validation logic.        |

### Phase 3: Extensibility & Integrations

**Status:** Optional 🟢 / Idea 💡

**Goal:** Make Nexus DSM a versatile tool that can be easily integrated into larger systems, including headless services and command-line workflows.

| Feature                                       | Status    | Description                                                                                             |
| --------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| **Headless API Service**                      | 🟢        | Expose core functionality via a self-hostable HTTP API (e.g., Express, Fastify) or as a serverless function. |
| **Official CLI Tool**                         | 🟢        | Develop a CLI for parsing, validating, and converting files directly from the terminal.                 |
| **Plugin Architecture**                       | 💡        | Design a system for users to add custom validation rules, formatters, or conversion targets.            |
| **Streaming Support**                         | 💡        | Process large files in chunks to minimize memory usage for both the core library and the API.           |

---

## 🔭 Future & Long-Term Vision

This section contains ideas that are on our radar but are not yet scheduled for a specific phase.

| Feature                               | Status | Description                                                                                                                            |
| ------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Advanced Data Repair**              | 💡     | Automatically suggest or apply fixes for common data issues based on validation results.                                               |
| **Multi-File/Dataset Operations**     | 💡     | Support for joining, merging, or diffing multiple datasets.                                                                            |
| **Expanded Format Support**           | 💡     | Add parsers and converters for other structured formats like `XML`, `YAML`, or `Parquet`.                                              |
| **UI Component Library Integration**  | 💡     | Provide hooks or adapters for seamless integration with the `nexus-dsm-ui` project. |
| **Type Inference**                    | 💡     | Automatically infer data types (string, number, boolean, date) for columns to generate a baseline schema.                              |

---

## 🤝 How to Contribute

Your contributions are welcome! Whether it's a bug report, a feature request, or a pull request, your input helps make Nexus DSM better.

1. **Check for Existing Issues:** Before creating a new issue, please check if a similar one already exists.
2. **Create an Issue:** For new features or bugs, open an issue to start a discussion.
3. **Fork & Create a PR:** If you're ready to contribute code, please fork the repository and submit a pull request.

Thank you for helping us build a better toolkit for data management!
