# 🤝 Contributing to Nexus DSM

Thanks for your interest in contributing!

This is a modular TypeScript toolkit for parsing, validating, and converting structured datasets.  
Whether you're fixing a parsing edge case, tightening eligibility checks, or extending conversion logic — your contribution is welcome.

---

## ⚙️ Setup

To get started:

```bash
git clone https://github.com/your-org/nexus-dsm.git
cd nexus-dsm
npm install
```

To run tests (powered by [Vitest](https://vitest.dev)):

```bash
npm test
```

---

## 🧱 Code Structure

- `src/parsers/` — CSV & JSON parsing logic  
- `src/validators/` — Syntax checks, header validation, quote balance  
- `src/converters/` — Format transformation modules (CSV ↔ JSON)  
- `src/adapters/` — Integration layers (e.g., PapaParse adapter)  
- `src/constants/` — Shared constants and config  
- `src/types/` — Shared TypeScript interfaces  
- `src/utils/` — Utility helpers  
- `__tests__/` — Unit and integration tests (fixtures welcome)

---

## ✅ Contribution Guidelines

- Keep logic pure and testable  
- Maintain type safety with clear interfaces  
- Add tests for any new functionality or edge cases  
- Keep PRs focused and branch from `main`  
- Follow existing code style and project conventions  

---

Need help understanding the structure or picking a place to contribute? Open an issue or drop a draft PR — happy to collaborate.
