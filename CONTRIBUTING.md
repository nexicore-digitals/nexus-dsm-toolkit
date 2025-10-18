# 🤝 Contributing to Nexus DSM

Thanks for your interest in contributing to **Nexus DSM**—a modular TypeScript toolkit for parsing, validating, converting, and indexing structured datasets. Whether you're fixing a parsing edge case, refining schema validation, extending conversion logic, or improving documentation, your contribution is deeply appreciated.

---

## ⚙️ Local Setup

To get started with development:

1. **Clone the Repository**

    ```bash
    git clone https://github.com/nexicore-digitals/nexus-dsm-toolkit.git
    cd nexus-dsm-toolkit
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Run Tests**

    Nexus DSM uses [Vitest](https://vitest.dev) for testing.

    ```bash
    # Run all tests
    npm test

    # Run tests with coverage report
    npm run test:coverage
    ```

4. **Run Examples**

    See the core functionality in action:

    ```bash
    npm run example:csv     # CSV parsing demo
    npm run example:json    # JSON parsing demo
    ```

5. **Build the Project**

    Compile for distribution:

    ```bash
    npm run build
    ```

---

## 🧱 Code Structure Overview

Understanding the layout will help you contribute effectively:

- `src/parsers/` — CSV and JSON parsing logic
- `src/validators/` — Syntax, header, quote balance, and schema checks
- `src/converters/` — Format transformation modules (CSV ↔ JSON)
- `src/adapters/` — Integration layers (e.g. PapaParse)
- `src/constants/` — Shared constants and config values
- `src/types/` — TypeScript interfaces and definitions
- `src/utils/` — General-purpose helpers
- `__tests__/` — Unit and integration tests (add fixtures here!)

---

## ✅ Contribution Guidelines

To maintain quality and clarity across the toolkit:

- **Modularity First**: Keep logic pure, testable, and scoped to its module.
- **Type Safety**: Use clear, expressive TypeScript types and interfaces.
- **Testing Required**: Add tests for all new features, bug fixes, and edge cases.
- **Linting & Style**: Ensure your code follows project conventions by running `npm run lint`.
- **Pull Request Etiquette**:
  - Branch from `main`.
  - Keep PRs focused and atomic.
  - Use clear commit messages (Conventional Commits encouraged).
  - Include a detailed PR description: what, why, and how.

---

## 💬 Questions & Collaboration

Need help understanding the structure, troubleshooting a bug, or exploring a new feature?
Open an issue, start a discussion, or reach out—we’re building this ecosystem together.

---

**Built by Nexicore Digitals to empower developers with clarity, control, and confidence.**
