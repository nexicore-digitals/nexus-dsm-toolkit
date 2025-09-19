# 🌐 Nexus DSM – Dataset Management Toolkit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Modular DX](https://img.shields.io/badge/modular-DX-blue)
![Beginner Friendly](https://img.shields.io/badge/beginner-friendly-green)
![Nexi Inside](https://img.shields.io/badge/Nexi-AI-blue)

**Centralized tooling for parsing, validating, converting, and indexing structured datasets (`CSV` ↔ `JSON`).**  
Built for modularity, clarity, and service-ready integration.

---

## ✨ Motivation: Building Trust in Your Data

Most data tools promise seamless automation—but often operate as opaque black boxes. This obscures subtle quality issues and forces blind trust in processes that should be transparent. When working with critical datasets, that lack of visibility can lead to costly errors or endless manual review.

**Nexus DSM** takes a different approach:

> _Your data is yours. You deserve control, clarity, and confidence._

Instead of a “set-it-and-forget-it” pipeline, Nexus DSM offers a **developer-assisted validation engine** that flags syntax issues, highlights inconsistencies (like malformed rows or ambiguous headers), and guides you through every step. Whether you're ingesting raw CSVs or preparing JSON for an API, Nexus DSM ensures every byte meets your standards—with full visibility and explainable feedback.

---

## 📦 Repo Scope

This repository contains the **core logic** for:

- 📥 Parsing and syntax validation
- ✅ Schema validation (via Zod or JSON Schema)
- 🔁 Format conversion (CSV ↔ JSON)
- 🧾 Metadata-driven eligibility checks
- 🗂 (Planned) Indexing for advanced dataset workflows

> ⚠️ **Note:** UI components, drag-and-drop tools, and frontend visualizations are maintained in a separate repository: [`nexus-dsm-ui`](https://github.com/nexicore-digitals/nexus-dsm-ui)

---

## 🚀 Project Phases & Trajectory

| Phase                                 | Status      | Description                                                                                                     |
| ------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| **Phase 1: Core Node Utility**        | ✅ Active   | Typed CSV/JSON parsing engine for Node. Environment-agnostic, no bundling required. Includes schema validation. |
| **Phase 2: Optional Browser Support** | 🟡 Planned  | Same API, browser bundle via conditional logic and bundlers (`tsup`, `rollup`, or `vite`).                      |
| **Phase 3: Headless API**             | 🟢 Optional | Serverless or self-hosted HTTP API exposing parsing endpoints for remote or client use.                         |
| **Phase 4: CLI Tool**                 | 🟢 Bonus    | Command-line interface wrapping core utils for parsing, validation, and conversion tasks.                       |

---

## ⚡ Quick Start

```bash
# Clone and install
git clone https://github.com/nexicore-digitals/nexus-dsm-toolkit.git
cd nexus-dsm-toolkit
npm install

# Run tests
npm run test

# Example (if CLI enabled)
node cli/index.js parse ./fixtures/sample.csv
```

> CLI and API layers are optional — core functions are usable as a library.

---

## 🧠 Core Capabilities

| Function                       | Description                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `parseCSV(file)`               | Parses CSV input, validates syntax, and outputs structured data              |
| `parseJSON(file)`              | Parses structured JSON arrays into rows and fields                           |
| `validateSchema(data, schema)` | Validates parsed data against a predefined schema (e.g., Zod or JSON Schema) |
| `convertToCSV(meta)`           | Converts parsed JSON into CSV (requires `ParsedFileMeta`)                    |
| `convertToJSON(meta)`          | Converts parsed CSV into JSON (requires `ParsedFileMeta`)                    |
| `indexFile(data)`              | _(Planned)_ Indexing module for chaining and querying parsed dataset output  |

---

## ⚙️ Workflow Overview

```text
📥 Input file (.csv/.json)
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
```

---

## 📚 Folder Structure

```text
nexus-dsm/
├── src/
│   ├── parsers/          # CSV and JSON parsing logic
│   ├── converters/       # Format transformation modules
│   ├── validators/       # Syntax, quote balance, header, and schema checks
│   ├── schemas/          # Schema definitions
│   ├── indexers/         # (Planned) indexing logic
│   ├── constants/        # Shared constants
│   ├── adapters/         # Environment or format adapters
│   └── utils/            # Shared helpers
│   └── index.ts          # Main export file
├── __tests__/            # Unit and integration tests
├── lib/                  # External libraries (e.g. papaparse.min.js)
├── api/                  # Optional HTTP service layer (Phase 3)
├── cli/                  # Optional CLI wrapper (Phase 4)
├── docs/                 # Specs, architecture diagrams, usage notes
├── vitest.config.ts      # Vitest test runner config
├── tsconfig.json         # TypeScript configuration
├── CONTRIBUTING.md       # Contribution guidelines
├── LICENSE               # Project license
└── README.md             # This file
```

---

## 🧪 Testing & Validation

Use `__tests__` with fixtures to simulate:

- CSV files with quote imbalances
- JSON inputs with nested structures
- Schema-conforming and non-conforming data
- Metadata eligibility checks
- Conversion edge cases

> Built to support mock-driven unit tests and validation suites for CLI, API, or internal tooling.

---

## 🔭 Future Enhancements

- ✅ Metadata-guarded conversion logic
- 🧠 Full metadata schema (`ParsedFileMeta`) with eligibility flags and validation results
- 🗂 Dataset indexing (column hashing, structure mapping)
- ⚡ CLI command dispatcher (`parse`, `convert`, `index`, `validate-schema`)
- 📡 API interface for remote orchestration
- 🖼 UI repo for visualization: [`nexus-dsm-ui`](https://github.com/nexicore-digitals/nexus-dsm-ui)

---

## 🤝 Contribution

We welcome PRs, issues, and architectural suggestions. Whether you're extending validation stages, improving conversion logic, or building new adapters—your input helps make Nexus DSM more robust and accessible.

---

**_Modular, testable, and orchestration-ready._**  
**_Built by Nexicore Digitals to empower developers with clarity and control._**
