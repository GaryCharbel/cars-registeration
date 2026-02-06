import { PDFDocument } from 'pdf-lib'
import type { FormData } from '../types/form'

export async function fillPdf(
    sourcePdfPath: string,
    formData: FormData
): Promise<Blob> {
    try {
        console.log('Starting PDF form fill process...')
        console.log('Source PDF path:', sourcePdfPath)
        console.log('Form data:', formData)

        // Fetch the source PDF
        console.log('Fetching PDF...')
        const response = await fetch(sourcePdfPath)
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
        }
        const pdfBytes = await response.arrayBuffer()
        console.log('PDF fetched, size:', pdfBytes.byteLength, 'bytes')

        // Load the PDF
        console.log('Loading PDF document...')
        const pdfDoc = await PDFDocument.load(pdfBytes)
        console.log('PDF loaded successfully, pages:', pdfDoc.getPageCount())

        // Get the form
        const form = pdfDoc.getForm()
        const fields = form.getFields()
        console.log('Form fields found:', fields.length)

        // Log all field names for debugging
        fields.forEach(field => {
            const name = field.getName()
            const type = field.constructor.name
            console.log(`Field: "${name}" (${type})`)
        })

        // Fill form fields
        console.log('Filling form fields...')
        for (const [fieldId, value] of Object.entries(formData)) {
            if (value === undefined || value === null || value === '') {
                continue
            }

            try {
                // Try as text field first
                const field = form.getTextField(fieldId)
                field.setText(String(value))
                console.log(`✓ Filled text field "${fieldId}" with "${value}"`)
            } catch (error) {
                // If not a text field, try as checkbox
                try {
                    const checkboxField = form.getCheckBox(fieldId)
                    if (value === true || value === 'true' || value === 'on') {
                        checkboxField.check()
                        console.log(`✓ Checked checkbox "${fieldId}"`)
                    }
                } catch (checkboxError) {
                    console.warn(`Could not fill field "${fieldId}":`, error)
                }
            }
        }

        console.log('Saving filled PDF...')
        const filledPdfBytes = await pdfDoc.save()
        console.log('PDF saved, size:', filledPdfBytes.byteLength, 'bytes')

        const blob = new Blob([new Uint8Array(filledPdfBytes)], { type: 'application/pdf' })
        console.log('Blob created successfully')
        return blob
    } catch (error) {
        console.error('Error filling PDF:', error)
        if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }
        throw new Error('فشل في إنشاء PDF')
    }
}

export function downloadPdf(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
}
