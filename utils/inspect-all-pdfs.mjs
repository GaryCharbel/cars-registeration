import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

async function inspectPdfs() {
    const pdfDirs = [
        'car-public',
        'car-private-auto',
        'car-private-auto-full',
        'car-private-manual',
        'motorcycle-request'
    ]

    for (const dir of pdfDirs) {
        const pdfPath = path.join('public', 'pdfs', dir, 'source.pdf')
        if (!fs.existsSync(pdfPath)) {
            console.log(`[!] Missing: ${pdfPath}`)
            continue
        }

        console.log(`\n--- Fields for ${dir} ---`)
        const pdfBytes = fs.readFileSync(pdfPath)
        const pdfDoc = await PDFDocument.load(pdfBytes)
        const form = pdfDoc.getForm()
        const fields = form.getFields()

        fields.forEach(field => {
            console.log(`[${field.constructor.name}] ${field.getName()}`)
        })
    }
}

inspectPdfs().catch(console.error)
