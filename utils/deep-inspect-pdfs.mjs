import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

async function deepInspectPdfs() {
    const pdfDirs = [
        'car-public',
        'car-private-auto',
        'car-private-auto-full',
        'car-private-manual',
        'motorcycle-request'
    ]

    for (const dir of pdfDirs) {
        const pdfPath = path.join('public', 'pdfs', dir, 'source.pdf')
        if (!fs.existsSync(pdfPath)) continue

        console.log(`\n=== DEEP INSPECT: ${dir} ===`)
        const pdfBytes = fs.readFileSync(pdfPath)
        const pdfDoc = await PDFDocument.load(pdfBytes)
        const form = pdfDoc.getForm()
        const fields = form.getFields()

        fields.forEach(field => {
            const name = field.getName()
            const type = field.constructor.name
            let extra = ''

            try {
                if (type.includes('PDFTextField')) {
                    const tf = form.getTextField(name)
                    extra = `(MaxLen: ${tf.getMaxLength() || 'none'})`
                } else if (type.includes('PDFCheckBox')) {
                    const cb = form.getCheckBox(name)
                    extra = `(Checked: ${cb.isChecked()})`
                } else if (type.includes('PDFDropdown')) {
                    const dd = form.getDropdown(name)
                    extra = `(Options: ${dd.getOptions().join(', ')})`
                }
            } catch (e) { }

            console.log(`${type.padEnd(20)} | ${name.padEnd(20)} | ${extra}`)
        })
    }
}

deepInspectPdfs().catch(console.error)
