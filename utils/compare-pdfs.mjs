import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

async function comparePdfs() {
    const files = [
        'إمتحان سياحي خصوصي أوتوماتيك - real.pdf',
        'إمتحان سياحي خصوصي أوتوماتيك-real.pdf'
    ]

    for (const file of files) {
        const filePath = path.join('C:', 'Users', 'User', 'Desktop', 'GRETTA CHALHOUB', file)
        console.log(`\n--- Fields for ${file} ---`)
        const pdfBytes = fs.readFileSync(filePath)
        const pdfDoc = await PDFDocument.load(pdfBytes)
        const form = pdfDoc.getForm()
        const fields = form.getFields()

        fields.forEach(field => {
            console.log(`[${field.constructor.name}] ${field.getName()}`)
        })
    }
}

comparePdfs().catch(console.error)
