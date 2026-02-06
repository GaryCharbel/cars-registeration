pdf-exam-filler/
├─ electron/
│  ├─ main.ts                # App bootstrap, window
│  ├─ preload.ts             # IPC bridge
│  └─ ipc/
│     └─ pdf.service.ts      # Read/write PDFs, save output
│
├─ src/
│  ├─ App.tsx                # Router
│
│  ├─ screens/
│  │  ├─ PdfChooser.tsx      # FIRST SCREEN (choose PDF)
│  │  └─ PdfFillScreen.tsx   # Fill selected PDF
│
│  ├─ components/
│  │  ├─ PdfCard.tsx         # Card for each PDF
│  │  ├─ PdfPreview.tsx      # First-page preview
│  │  └─ DynamicForm.tsx     # Auto-generated form
│
│  ├─ pdfs/                  # 🔴 YOUR PDFs LIVE HERE
│  │  ├─ car-private-auto/
│  │  │  ├─ source.pdf
│  │  │  ├─ mapping.json
│  │  │  └─ schema.json
│  │
│  │  ├─ car-private-manual/
│  │  │  ├─ source.pdf
│  │  │  ├─ mapping.json
│  │  │  └─ schema.json
│  │
│  │  ├─ car-public/
│  │  │  ├─ source.pdf
│  │  │  ├─ mapping.json
│  │  │  └─ schema.json
│  │
│  │  ├─ motorcycle-exam/
│  │  │  ├─ source.pdf
│  │  │  ├─ mapping.json
│  │  │  └─ schema.json
│  │
│  │  └─ motorcycle-request/
│  │     ├─ source.pdf
│  │     ├─ mapping.json
│  │     └─ schema.json
│
│  ├─ lib/
│  │  ├─ pdfFill.ts          # pdf-lib logic
│  │  ├─ loadSchema.ts       # Reads schema.json
│  │  └─ loadMapping.ts      # Reads mapping.json
│
│  └─ types/
│     └─ form.ts
│
├─ output/
│  └─ filled-pdfs/           # Generated PDFs
│
└─ package.json
