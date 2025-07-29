# 🌐 Nexus DSM – Dataset Management Toolkit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)]()  
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()

Centralized tooling for parsing, validating, converting, and indexing structured datasets (`CSV` ↔ `JSON`).  
Built for modularity, clarity, and service-ready integration.

---

## ✨ Motivation: Building Trust in Your Data

In today's data-driven world, while tools promise seamless automation for parsing and conversion, they often operate as 'black boxes.' This can leave developers and data scientists with a critical lack of transparency, obscuring subtle data quality issues and forcing blind trust in automated processes. When dealing with crucial datasets, this uncertainty can lead to costly errors downstream or endless hours of manual review.

**Nexus DSM** was conceived from a different philosophy: **your data is yours, and you deserve complete control and unwavering trust in its integrity.** Instead of a fully automated, 'set-it-and-forget-it' approach, Nexus DSM provides a robust, programmatic engine focused on **developer-assisted data validation.** It meticulously flags every suspicious syntax, presents potential inconsistencies (like unconfirmed headers or malformed entries), and empowers you to actively review and confirm the data's exact state. This ensures that every byte conforms precisely to your standards, building absolute confidence in your dataset for critical analyses and applications.

---

## 📦 Repo Scope

This repository contains the **core logic** for:

- Parsing and syntax validation
- **Schema validation**
- Conversion between formats
- Metadata-driven eligibility checks
- (Future) indexing for advanced dataset workflows

> ⚠️ **Note:** UI components, drag-and-drop tools, and frontend visualizations are maintained in a **separate repository** [`nexus-dsm-ui`](https://github.com/your-org/nexus-dsm-ui).
> This repo focuses strictly on backend dataset processing logic.

---

## 🚀 Project Phases & Trajectory

| Phase                        | Status     | Description                                                                                      |
|-----------------------------|------------|------------------------------------------------------------------------------------------------|
| **Phase 1: Core Node Utility** | ✅ Now     | Typed CSV/JSON parsing engine for Node; no build, no bundling, environment-agnostic core logic. Includes **schema validation**. |
| **Phase 2: Optional Browser Support** | 🟡 Later   | Same API, browser bundle via conditional logic and bundlers (`tsup`, `rollup`, or `vite`).      |
| **Phase 3: Headless API**       | 🟢 Optional| Serverless or self-hosted HTTP API exposing parsing endpoints for remote or client use.          |
| **Phase 4: CLI Tool**           | 🟢 Bonus   | Command-line interface wrapping core utils for parsing, validation, and conversion tasks.       |

---

## 🚀 Quick Start

    # Clone and install
    git clone https://github.com/your-org/nexus-dsm.git
    cd nexus-dsm
    npm install

    # Run tests
    npm run test

    # Example (if CLI enabled)
    node cli/index.js parse ./fixtures/sample.csv

> CLI and API layers are optional — core functions are usable as a library.

---

## 🧠 Core Capabilities

| Function               | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| `parseCSV(file)`       | Parses CSV input, validates syntax, and outputs structured data             |
| `parseJSON(file)`      | Parses structured JSON arrays into rows and fields                          |
| `validateSchema(data, schema)` | Validates parsed data against a predefined schema (e.g., JSON Schema) |
| `convertToCSV(meta)`   | Converts parsed JSON into CSV (requires `ParsedFileMeta`)                   |
| `convertToJSON(meta)`  | Converts parsed CSV into JSON (requires `ParsedFileMeta`)                   |
| `indexFile(data)`      | _(Planned)_ Indexing module for chaining and querying parsed dataset output |

---

## ⚙️ Workflow Overview

    📥 Upload or pass input file (.csv/.json)
        ↓
    🔍 Parsing + Syntax Validation
        ↓
    ✅ Schema Validation
        ↓
    🧾 Metadata Creation (syntax tree + eligibility flags)
        ↓
    🔁 Conversion (CSV ↔ JSON, if eligible)
        ↓
    📚 Optional Indexing & downstream usage

---

## 📚 Folder Structure

    nexus-dsm/
    ├── src/
    │   ├── parsers/        # CSV and JSON parsing logic
    │   ├── converters/     # Format transformation modules
    │   ├── validators/     # Syntax, quote balance, header, and schema checks
    │   ├── index.ts        # Re-exports all validation functions
    │   ├── syntaxValidator.ts
    │   ├── headerValidator.ts
    │   └── schemaValidator.ts  # Logic for schema validation
    │   ├── schemas/        # To define/store schema definitions
    │   ├── indexers/       # (Planned) data indexing logic
    │   ├── constants/      # Constants used across the project
    │   ├── adapters/       # Environment or format adapters
    │   └── utils/          # Shared helpers
    └── index.ts        # Main export file for the library (all index.ts in the root of src)
    │
    ├── __tests__/          # Unit and integration tests
    ├── lib/                # External libraries (e.g. papaparse.min.js)
    ├── api/                # Optional HTTP service layer (Phase 3)
    ├── cli/                # Optional CLI wrapper (Phase 4)
    ├── docs/               # Specs, architecture diagrams, usage notes
    ├── node_modules/       # Installed dependencies
    ├── vitest.config.ts    # Vitest test runner config
    ├── tsconfig.json       # TypeScript configuration
    ├── CONTRIBUTING.md     # Contribution guidelines
    ├── .gitignore          # Git ignore rules
    ├── package.json        # NPM package metadata and scripts
    ├── package-lock.json   # NPM package lockfile
    ├── LICENSE             # Project license
    └── README.md           # Project README

---

## 🧪 Testing & Validation

Use `__tests__` with fixtures to simulate:

- CSV files with quote imbalances
- JSON inputs with nested structures
- **Data inputs that conform/don't conform to specific schemas**
- Metadata eligibility checks
- Conversion passes and failure edge cases

> Built to support mock-driven unit tests and validation suites for CLI, API, or internal tooling.

---

## 🔭 Future Enhancements

- ✅ Metadata-guarded conversion logic
- 🧠 Full metadata schema (`ParsedFileMeta`) with eligibility flags and **schema validation results**
- 🗂 Dataset indexing (column hashing, structure mapping)
- ⚡ CLI command dispatcher (`parse`, `convert`, `index`, `validate-schema`)
- 📡 API interface for remote orchestration
- 🖼 Separate UI repo for visualization: [`nexus-dsm-ui`](https://github.com/owen-6936/nexus-dsm-ui)

---

## 🤝 Contribution

Feel free to submit PRs, raise issues, or suggest architectural improvements. This repo is designed to be modular, testable, and orchestration-ready. Whether you're extending validation stages or building new conversion flows, contributions are welcome.

---

**_Modular, testable, and orchestration-ready._**  
**_Designed by Owen for clean, reliable dataset workflows._**
