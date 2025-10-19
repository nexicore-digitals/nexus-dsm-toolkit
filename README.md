# 🌐 Nexus DSM – Dataset Management Toolkit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)](https://nodejs.org/)
[![CI](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/ci.yml)
[![CodeQL](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/codeql.yml/badge.svg)](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/codeql.yml)
[![Build Status](https://img.shields.io/github/actions/workflow/status/nexicore-digitals/nexus-dsm-toolkit/publish.yml?branch=release/v1.2.0)](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/publish.yml)
![Modular DX](https://img.shields.io/badge/modular-DX-blue)
![Beginner Friendly](https://img.shields.io/badge/beginner-friendly-green)
![Nexi Inside](https://img.shields.io/badge/Nexi-AI-blue)

**Centralized tooling for parsing, validating, converting, and indexing structured datasets (`CSV` ↔ `JSON`).**  
Built for modularity, clarity, and service-ready integration.

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

## ️ Roadmap

Our development trajectory, planned features, and long-term goals are detailed in our official **Project Roadmap**. We welcome community feedback and contributions to help shape the future of the toolkit.

---

## 🚀 Usage

### Installation

```bash
npm install nexus-dsm # or pnpm add nexus-dsm
```

### Parsing a CSV

The `parseCSV` function can process a CSV from a file path or a raw string. It returns a detailed response object with the parsed data and rich metadata.

```typescript
import { parseCSV } from "nexus-dsm";

// From a file path
const response = await parseCSV(undefined, "./data/sample.csv");

if (response.success) {
    console.log("Parsed Data:", response.data);
    console.log(
        "Is eligible for conversion?",
        response.meta.eligibleForConversion
    );
} else {
    console.error("Parsing Failed:", response.message);
    console.log("Error Details:", response.meta.diagnostics);
}
```

### Parsing a JSON

The `parseJSON` function handles JSON files with a root-level array of objects or a single root object.

```typescript
import { parseJSON } from "nexus-dsm";

const jsonString = '[{"id": 1, "name": "Alice"}]';
const response = await parseJSON(jsonString);

if (response.success) {
    console.log("Parsed Data:", response.data);
    console.log("Structure Type:", response.meta.structureType);
} else {
    console.error("Parsing Failed:", response.message);
}
```

---

### Converting Data

After parsing, you can convert between CSV and JSON formats using the conversion functions.

```typescript
import { convertToCsv, convertToJSON } from "nexus-dsm";

const response = await convertToCsv(parsedData);

if (response.success) {
    console.log("Converted CSV:", response.data);
} else {
    console.error("Conversion Failed:", response.message);
}

const jsonResponse = await convertToJSON(parsedData);

if (jsonResponse.success) {
    console.log("Converted JSON:", jsonResponse.data);
} else {
    console.error("Conversion Failed:", jsonResponse.message);
}
```

---

## 💻 Development

```bash
# Clone and install
git clone https://github.com/nexicore-digitals/nexus-dsm-toolkit.git
cd nexus-dsm-toolkit
pnpm install

# Run tests
pnpm test
```

> CLI and API layers are optional — core functions are usable as a library.

---

## 🧠 Core Capabilities

| Function                       | Description                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `parseCSV(file)`               | Parses CSV input, validates syntax, and outputs structured data              |
| `parseJSON(file)`              | Parses structured JSON arrays into rows and fields                           |
| `validateSchema(data, schema)` | Validates parsed data against a predefined schema (e.g., Zod or JSON Schema) |
| `convertToCsv(response)`       | Converts a parsed JSON response into a CSV string                            |
| `convertFromJson(response)`    | Converts a parsed CSV response into a JSON string                            |
| `indexFile(data)`              | _(Planned)_ Indexing module for chaining and querying parsed dataset output  |

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
