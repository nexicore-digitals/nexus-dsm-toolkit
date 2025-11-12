# 🌐 Nexus DSM – Dataset Management Toolkit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)](https://nodejs.org/)
[![CI](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/ci.yml)
[![CodeQL](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/codeql.yml/badge.svg)](https://github.com/nexicore-digitals/nexus-dsm-toolkit/actions/workflows/codeql.yml)
![Modular DX](https://img.shields.io/badge/modular-DX-blue)
![Beginner Friendly](https://img.shields.io/badge/beginner-friendly-green)
![Nexi Inside](https://img.shields.io/badge/Nexi-AI-blue)
![Parser Core: PapaParse](https://img.shields.io/badge/parser%20core-PapaParse-blue)
![DX Layer: nexus-dsm](https://img.shields.io/badge/DX%20layer-nexus--dsm-brightgreen)
[![JSR](https://jsr.io/badges/@nexicore/nexus-dsm)](https://jsr.io/@nexicore/nexus-dsm)
![npm version](https://img.shields.io/npm/v/nexus-dsm)
![Repo Size](https://img.shields.io/github/repo-size/nexicore-digitals/nexus-dsm-toolkit?t=1)
![Release](https://img.shields.io/github/v/release/nexicore-digitals/nexus-dsm-toolkit?t=1)

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

import { logger } from "./examples/utils"; // Assuming you have a logger utility

// From a string
const csvString = `id,name\n1,Test`;
const responseFromString = await parseCSV(csvString);

if (responseFromString.success) {
    logger.info("Parsed Data:", responseFromString.data);
    logger.info(
        "Headers:",
        responseFromString.meta.headers
    );
} else {
    logger.error("Parsing Failed:", responseFromString.message);
    logger.info("Error Details:", responseFromString.meta.diagnostics);
}

// From a file path
const responseFromFile = await parseCsvFromFile("./data/sample.csv");

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

### JSON to TSV Conversion

You can also convert JSON to Tab-Separated Values (TSV) using the same `convertToCsv` function by specifying the delimiter.

```typescript
import { parseJSON, convertToCsv } from "nexus-dsm";

const nestedJson = `[{"name":"Alice","profile":{"age":30},"tags":["dev"]}]`;
const jsonResponse = await parseJSON(nestedJson);

// Convert to TSV
const tsv = await convertToCsv(jsonResponse, { tsv: true, writeToFile: true, outputPath: 'my-data.tsv' });
// tsv.content is: name\tprofile\ttags\r\nAlice\t"{""age"":30}"\t"[""dev""]"\r\n
// tsv.filePath is the path to the written TSV file
path to the written TSV file is output.tsv if not specified otherwise
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
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo dpkg -i nexus-dsm-toolkit.deb
sudo apt install -f  # Fix any missing dependencies
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

These functions and classes are the main entry points for parsing CSV and JSON data, both from strings and streams.

| Function/Class | Description |
| :--- | :--- |
| `parseJsonStream(stream: Readable, source?)` | **Node.js only.** Reads and parses a large JSON file from the filesystem using a streaming approach. |
| `parseCsvStream(stream: Readable, encoding?)` | Parses a CSV/TSV stream, suitable for large files or network streams. |
| `parseCSV(csv, source?)` | Advanced CSV parser with custom options for delimiters, quote characters, and more. |
| `parseJSON(data: string \| object \| object[],filePath?: string)` | Advanced JSON parser with options for handling large datasets and custom error handling. |
| `ParseCsvFromFile(filePath: string, options?: ParseCsvOptions)` | **Node.js only.** Low-level function to read and parse CSV/TSV files with custom stream handling. |
| `ParseJsonFromFile(filePath: string, options?: ParseJsonOptions)` | **Node.js only.** Low-level function to read and parse JSON files with custom stream handling. |

---

### 📊 Feature Comparison Table

| Library         | Best For | DX Simplicity | Streaming | Nested Support | Metadata | Validation | UI Pairing Potential |
|----------------|----------|----------------|-----------|----------------|----------|------------|-----------------------|
| **nexus-dsm**  | DX-first conversion, contributor tooling | ⭐⭐⭐⭐⭐ | ✅ (partial) | ✅ Deep + Shallow | ✅ Rich | ✅ Detailed | ✅ High |
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

```bash
nexus-dsm/
├── .github/                 # GitHub Actions workflows & issue templates
│   ├── workflows/           # CI/CD pipelines
│   └── ISSUE_TEMPLATE/      # Issue templates for bug reports and feature requests
├── src/                     # Source code
│   ├── adapters/            # Adapters for external libraries (e.g., PapaParse)
│   ├── cli/                 # Command-Line Interface implementation
│   ├── constants/           # Shared constants and configuration
│   ├── converters/          # Logic for converting between data formats (CSV <-> JSON)
│   ├── parsers/             # Core parsing logic for CSV, JSON, and streaming
│   ├── types/               # TypeScript type definitions and interfaces
│   ├── utils/               # General utility functions and helpers
│   └── index.ts             # Main entry point for the library
├── __tests__/               # Unit and integration tests
│   ├── fixtures/            # Test data files (CSV, JSON, etc.)
│   └── unit/                # Unit tests for individual modules
├── examples/                # Example usage of the library
├── .gitignore               # Files and directories to ignore in Git
├── .prettierrc.json         # Prettier configuration for code formatting
├── CHANGELOG.md             # Detailed log of all project changes
├── CONTRIBUTING.md          # Guidelines for contributing to the project
├── LICENSE                  # Project license
├── package.json             # Project metadata and dependencies
├── pnpm-lock.yaml           # pnpm lock file
├── README.md                # Project README
├── ROADMAP.md               # Project roadmap and future plans
├── SECURITY.md              # Security policy and vulnerability reporting
├── tsconfig.json            # TypeScript configuration
└── vitest.config.ts         # Vitest configuration for testing

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
![stream-json](https://img.shields.io/badge/stream--json-streaming-blue)
![stream-chain](https://img.shields.io/badge/stream--chain-streaming-blue)

---

_**Modular, testable, and orchestration-ready.**_
_**Built by Nexicore Digitals to empower developers with clarity and control.**_
