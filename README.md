# PDF Exam Filler

Offline desktop application for filling PDF exam forms in Arabic.

## 🚀 Features

- **Offline First**: No internet connection required
- **Arabic RTL Support**: Full support for Arabic text and right-to-left layout
- **Multiple Forms**: Support for 5 different exam forms
- **PDF Generation**: Fill forms and generate completed PDFs
- **Cross-Platform**: Built with Electron (Windows primary)

## 📋 Available Forms

1. إمتحان سياحي خصوصي أوتوماتيك (Private Car Exam - Automatic)
2. إمتحان سياحي خصوصي يدوي (Private Car Exam - Manual)
3. محضر امتحان عمومي (Public Car Exam)
4. محضر تقييم الرخصة سوق الدراجات الآلية (Motorcycle License Evaluation)
5. طلب دراجات (Motorcycle Request)

## 🛠️ Tech Stack

- **Platform**: Electron
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Forms**: react-hook-form + zod
- **PDF**: pdf.js + pdf-lib

## 📦 Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

See `worktree.md` for detailed project structure.

## 🔧 Configuration

Each PDF form has two configuration files:
- `schema.json`: Defines the form fields (labels, types, validation)
- `mapping.json`: Maps form fields to PDF coordinates

## 📝 Next Steps

1. Configure the exact field mappings for each PDF form
2. Implement the dynamic form component
3. Implement PDF filling logic with pdf-lib
4. Add PDF preview functionality
5. Test with all exam forms

## 📄 License

ISC
