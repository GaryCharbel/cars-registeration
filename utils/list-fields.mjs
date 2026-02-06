import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

const pdfDirs = [
    'car-public',
    'car-private-auto',
    'car-private-manual',
    'motorcycle-exam',
    'motorcycle-request'
]

async function extractFields() {
    for (const dir of pdfDirs) {
        const filePath = path.join('public', 'pdfs', dir, 'source.pdf')
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`)
            continue
        }

        console.log(`\n--- Fields for ${dir} ---`)
        const pdfBytes = fs.readFileSync(filePath)
        const pdfDoc = await PDFDocument.load(pdfBytes)
        const form = pdfDoc.getForm()
        const fields = form.getFields()

        fields.forEach(field => {
            const type = field.constructor.name
            const name = field.getName()
            console.log(`[${type}] ${name}`)
        })
    }
}

extractFields().catch(console.error)
