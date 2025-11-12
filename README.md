# 🌐 Nexus DSM – Dataset Management Toolkit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)](https://nodejs.org/)
[![CI](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/ci.yml)
[![CodeQL](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/codeql.yml/badge.svg)](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/codeql.yml)
[![Build Status](https://img.shields.io/github/actions/workflow/status/nexicore-digitals/nexus-dsm-toolkit/publish.yml?branch=release/v2.0.0)](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/publish.yml)
![Modular DX](https://img.shields.io/badge/modular-DX-blue)
![Beginner Friendly](https://img.shields.io/badge/beginner-friendly-green)
![Nexi Inside](https://img.shields.io/badge/Nexi-AI-blue)
![Parser Core: PapaParse](https://img.shields.io/badge/parser%20core-PapaParse-blue)
![DX Layer: nexus-dsm](https://img.shields.io/badge/DX%20layer-nexus--dsm-brightgreen)
[![JSR](https://jsr.io/badges/@nexicore/nexus-dsm)](https://jsr.io/@nexicore/nexus-dsm)
![npm version](https://img.shields.io/npm/v/nexus-dsm)
![Repo Size](https://img.shields.io/github/repo-size/nexicore-digitals/nexus-dsm-toolkit)
![Release](https://img.shields.io/github/v/release/nexicore-digitals/nexus-dsm-toolkit)

---

**Centralized tooling for parsing, validating, converting, and indexing structured datasets (`CSV`, `JSON`, and planned `TSV`).**
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

## 📚 Project Documentation

For more detailed information about the project's direction, contribution guidelines, and version history, please see the following documents:

- **Project Roadmap** - Our vision and development phases.
- **Changelog** - A detailed log of all version changes.
- **Contribution Guide** - How to get involved and contribute to the project.
- **Security Policy** - Our policy for reporting security vulnerabilities.

---

## 🚀 Usage

### Installation

```bash
npm install nexus-dsm # or pnpm add nexus-dsm
````

### Parsing a CSV

The `parseCSV` function processes a raw CSV string and returns a detailed response object with the parsed data and rich metadata. For file system operations in Node.js, use `parseCsvFromFile`.

```typescript
import { parseCsvFromFile } from "nexus-dsm";

// From a file path
const response = await parseCsvFromFile("./data/sample.csv");

if (response.success) {
    logger.info("Parsed Data:", response.data);
    logger.info(
        "Is eligible for conversion?",
        response.meta.eligibleForConversion
    );
} else {
    logger.error("Parsing Failed:", response.message);
    logger.info("Error Details:", response.meta.diagnostics);
}
```

### Parsing a JSON

The `parseJSON` function processes a raw JSON string or object/array and returns a detailed response object with the parsed data and rich metadata. For file system operations in Node.js, use `parseJsonFromFile`.

```typescript
import { parseJSON, parseJsonFromFile } from "nexus-dsm";

// From a string
const jsonString = `[{"id":1,"name":"Test"}]`;
const responseFromString = await parseJSON(jsonString);

if (responseFromString.success) {
    logger.info("Parsed Data:", responseFromString.data);
    logger.info(
        "Nesting Depth:",
        responseFromString.meta.nestingDepth
    );
} else {
    logger.error("Parsing Failed:", responseFromString.message);
    logger.info("Error Details:", responseFromString.meta.diagnostics);
}

// From a file path
const responseFromFile = await parseJsonFromFile("./data/sample.json");

if (responseFromFile.success) {
    logger.info("Parsed Data:", responseFromFile.data);
    logger.info(
        "Is eligible for conversion?",
        responseFromFile.meta.eligibleForConversion
    );
} else {
    logger.error("Parsing Failed:", responseFromFile.message);
    logger.info("Error Details:", responseFromFile.meta.diagnostics);
}
```

---

## 🔁 Converting Data

After parsing, you can convert between CSV and JSON formats using the conversion functions.
The conversion functions take the entire successful response object from the parser.

### JSON to CSV Conversion

You can choose between "shallow" and "deep" flattening strategies when converting JSON to CSV. The default is "shallow", which keeps nested objects and arrays as stringified JSON.

```typescript
import { parseJSON, convertToCsv } from "nexus-dsm";

const nestedJson = `[{"name":"Alice","profile":{"age":30},"tags":["dev"]}]`;
const jsonResponse = await parseJSON(nestedJson);

// Shallow conversion (default)
const shallow = await convertToCsv(jsonResponse);
// shallow.content is: name,profile,tags\r\nAlice,"{""age"":30}","[""dev""]"

// Deep conversion
const deep = await convertToCsv(jsonResponse, { flattening: 'deep' });
// deep.content is: name,profile.age,tags[0]\r\nAlice,30,dev
```

### CSV to JSON Conversion

The `convertToJson` function automatically detects flattened headers (e.g., `user.name`) and reconstructs the nested JSON structure by default.

```typescript
import { parseCSV, convertToJson } from "nexus-dsm";

const flattenedCsv = `name,profile.age,tags[0]\r\nAlice,30,dev`;
const csvResponse = await parseCSV(flattenedCsv);

// Automatic un-flattening (default)
const unflattened = await convertToJson(csvResponse);
// unflattened.content is: [{"name":"Alice","profile":{"age":30},"tags":["dev"]}]

// Disable un-flattening
const flat = await convertToJson(csvResponse, { unflatten: false });
// flat.content is: [{"name":"Alice","profile.age":"30","tags[0]":"dev"}]

```

---

Perfect—here’s a clean, contributor-friendly section you can add to your README or GitHub release notes to guide users on how to install and use your `.deb` CLI package:

---

## 📦 Installation Instructions (Debian/Ubuntu)

### ✅ Option 1: Manual Install

Download the `.deb` file from [GitHub Releases](https://github.com/nexicore-digitals/nexus-dsm-toolkit/releases), then run:

```bash
sudo dpkg -i nexus-dsm.deb
sudo apt-get install -f  # Fix any missing dependencies
```

This installs the CLI globally as `nexus-dsm`.

---

### ✅ Option 2: Install via download the `.deb` from GitHub Releases

You can download the latest `.deb` package directly from the [GitHub Releases](https://github.com/nexicore-digitals/nexus-dsm-toolkit/releases) and install [manual install](#-option-1-manual-install).

---

## 🚀 Usage (CLI Wrapper)

After install, run:

```bash
nexus-dsm --help
```

Example commands:

```bash
nexus-dsm parse --input data.csv
nexus-dsm convert --from json --to csv --input data.json
```

---

## 🧠 API Reference

### Primary API

These are the main functions intended for everyday use.

| Function | Description |
| :--- | :--- |
| `parseCSV(csv, source?)` | Parses a CSV or TSV string, validates its structure, and returns a detailed response object. |
| `parseCsvFromFile(filePath)` | **Node.js only.** Reads and parses a CSV/TSV file from the filesystem. |
| `parseJSON(data, source?)` | Parses a JSON string or a pre-parsed object/array, analyzes its structure, and returns a detailed response object. |
| `parseJsonFromFile(filePath)` | **Node.js only.** Reads and parses a JSON file from the filesystem. |
| `convertToCsv(response, options)` | Converts a parsed JSON response into a CSV string, with "shallow" (default) or "deep" flattening. |
| `convertToJson(response, options)` | Converts a parsed CSV response into a JSON string, with automatic "un-flattening" of deep CSVs. |

### Advanced & Utility API

These functions and classes provide lower-level access for custom workflows and analysis.

| Function/Class | Description |
| :--- | :--- |
| `convertCsvStructure(response)` | Normalizes a `CsvResponse` into a standard tabular payload, ready for transformation. |
| `convertJsonStructure(data, meta)` | Normalizes a `JsonResponse` into a structure-aware payload with detailed metadata. |
| `ParsedFileMetaBuilder` | A fluent builder class to programmatically construct metadata objects for testing or custom parsing. |
| `calculateNestingDepth(obj)` | Computes the maximum nesting depth of a JSON object or array (e.g., a flat object is depth 1). |
| `checkKeyConsistency(array)` | Verifies if all objects in an array share the same keys and returns a list of any inconsistent keys. |

---

### 📊 Feature Comparison Table

| Library         | Best For | DX Simplicity | Streaming | Nested Support | Metadata | Validation | UI Pairing Potential |
|----------------|----------|----------------|-----------|----------------|----------|------------|-----------------------|
| **nexus-dsm**  | DX-first conversion, contributor tooling | ⭐⭐⭐⭐⭐ | ✅ (planned) | ✅ Deep + Shallow | ✅ Rich | ✅ Detailed | ✅ High |
| **PapaParse**  | Browser-based parsing, quick CSV import | ⭐⭐⭐⭐  | ✅ Step-wise | ❌ (flat only) | ⚠️ Minimal | ❌ | ⚠️ Limited |
| **csvtojson**  | Quick CLI conversions, Node pipelines | ⭐⭐⭐   | ✅ Stream | ⚠️ Partial flattening | ⚠️ Basic | ⚠️ Basic | ❌ |
| **fast-csv**   | High-performance streaming in Node | ⭐⭐    | ✅ Stream | ❌ | ❌ | ❌ | ❌ |
| **csv-parse**  | Configurable parsing, large datasets | ⭐⭐⭐   | ✅ Stream | ⚠️ Manual flattening | ⚠️ Basic | ⚠️ Manual | ❌ |

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

## 🤝 Contribution

We welcome PRs, issues, and architectural suggestions. Whether you're extending validation stages, improving conversion logic, or building new adapters—your input helps make Nexus DSM more robust and accessible.

---

## 🙏 Acknowledgements

This toolkit's powerful and reliable CSV parsing capabilities are made possible by **[Papa Parse](http://papaparse.com)**, the fastest in-browser CSV parser for JavaScript.

![Parser Core: PapaParse](https://img.shields.io/badge/parser%20core-PapaParse-blue)

---

_**Modular, testable, and orchestration-ready.**_
_**Built by Nexicore Digitals to empower developers with clarity and control.**_
