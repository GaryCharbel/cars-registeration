# PDF Exam Filler – Technology Stack

## App Type
- Offline desktop application
- No database
- No internet dependency
- File-based persistence

---

## Platform
- Electron
  - Cross-platform (Windows primary)
  - Native file system access
  - IPC for PDF operations

> Optional alternative: Tauri (future optimization)

---

## Frontend
- React (with Vite)
- TypeScript
- Tailwind CSS
- react-hook-form
- zod (form validation)

Purpose:
- PDF chooser screen
- Dynamic form rendering
- PDF preview

---

## PDF Rendering & Processing
- pdf.js
  - Render PDF pages
  - Preview first page
- pdf-lib
  - Fill text fields
  - Draw text at coordinates
  - Flatten final PDF

---

## OCR (Optional – Offline)
- Tesseract.js
  - Used only for scanned PDFs
  - Fully offline

---

## State Management
- Local React state
- Context API (lightweight)
- No Redux / external state libs

---

## Data & Storage
- Local file system only
- JSON-based configuration

Files:
- source.pdf        → original form
- schema.json       → user-fillable fields
- mapping.json      → PDF coordinates
- output PDFs       → generated files

---

## IPC / Native Layer
- Electron IPC
- Node.js fs module
- Path-safe read/write operations

---

## Internationalization
- Arabic RTL support
- UTF-8 encoding
- Custom font embedding (pdf-lib)

---

## Build & Tooling
- Vite
- Electron Builder
- ESLint
- Prettier

---

## Security
- No external network calls
- Context isolation enabled
- Preload-only IPC exposure

---

## Supported PDF Types
- Government static PDFs
- Multi-page PDFs
- Arabic text forms

---

## Non-Goals
- No backend
- No database
- No user accounts
- No cloud sync
