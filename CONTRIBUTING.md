# 🤝 Contributing to Nexus DSM

Thanks for your interest in contributing to Nexus DSM! We're building a modular TypeScript toolkit for parsing, validating, converting, and indexing structured datasets. Whether you're fixing a parsing edge case, tightening eligibility checks, extending conversion logic, or improving documentation — your contribution is highly welcome.

---

## ⚙️ Setup & Development

To get your local development environment ready:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/owen-6936/nexus-dsm.git](https://github.com/owen-6936/nexus-dsm.git)
    cd nexus-dsm
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Tests:**
    Nexus DSM uses [Vitest](https://vitest.dev) for testing.
    ```bash
    # Run all tests
    npm test

    # Run tests and check code coverage
    npm run test:coverage
    ```

4.  **Run Examples:**
    See the core functionality in action with the provided examples:
    ```bash
    # Example for CSV parsing
    npm run example:csv

    # Example for JSON parsing
    npm run example:json
    ```

5.  **Build the Project:**
    To compile the project for distribution:
    ```bash
    npm run build
    ```

---

## 🧱 Code Structure

Understanding the project's layout will help you find your way around:

* `src/parsers/` — Core logic for CSV and JSON parsing.
* `src/validators/` — Modules for syntax checks, header validation, and quote balance.
* `src/converters/` — Logic for transforming data between CSV and JSON formats.
* `src/adapters/` — Integration layers for external libraries (e.g., PapaParse adapter).
* `src/constants/` — Shared constants and configuration values used across the project.
* `src/types/` — Shared TypeScript interfaces and type definitions.
* `src/utils/` — General utility helpers and shared functions.
* `__tests__/` — Contains all unit and integration tests (feel free to add new test fixtures here!).

---

## ✅ Contribution Guidelines

To maintain code quality and ensure smooth collaboration, please adhere to these guidelines:

* **Focus on Modularity:** Keep logic pure, testable, and contained within its relevant module.
* **Type Safety:** Maintain strong type safety with clear TypeScript interfaces and types.
* **Comprehensive Testing:** Add tests for any new functionality, bug fixes, or edge cases you introduce.
* **Code Style & Linting:** Ensure your code adheres to the project's style conventions.
    ```bash
    # Run ESLint to check for code quality and style issues
    npm run lint
    ```
* **Pull Request (PR) Etiquette:**
    * Keep your PRs focused on a single logical change.
    * Branch from `main` for new features or bug fixes.
    * Write clear, concise, and descriptive commit messages (following Conventional Commits if possible, but descriptive is key!).
    * Provide a detailed description in your PR explaining the problem it solves and how.

---

Need help understanding the structure, troubleshooting, or picking a good place to contribute? Don't hesitate to open an issue, ask questions, or drop a draft PR — we're always happy to collaborate and guide you!
