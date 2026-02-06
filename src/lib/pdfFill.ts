import { PDFDocument } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import type { FormData } from '../types/form'
import cairoFontUrl from '../assets/fonts/Amiri-Regular.ttf'

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
        pdfDoc.registerFontkit(fontkit)
        console.log('PDF loaded successfully, pages:', pdfDoc.getPageCount())

        // Load Arabic Font
        console.log('Loading Arabic font from:', cairoFontUrl)
        const fontBytes = await fetch(cairoFontUrl).then(res => {
            if (!res.ok) throw new Error(`Failed to load font: ${res.statusText}`)
            return res.arrayBuffer()
        })
        const customFont = await pdfDoc.embedFont(fontBytes)
        console.log('Arabic font loaded')

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

            if (value instanceof FileList && value.length > 0) {
                try {
                    const file = value[0]
                    const arrayBuffer = await file.arrayBuffer()
                    const imageBytes = new Uint8Array(arrayBuffer)

                    let image
                    if (file.type === 'image/png') {
                        image = await pdfDoc.embedPng(imageBytes)
                    } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                        image = await pdfDoc.embedJpg(imageBytes)
                    }

                    if (image) {
                        try {
                            const button = form.getButton(fieldId)
                            button.setImage(image)
                            console.log(`✓ Set image for button "${fieldId}"`)
                        } catch (err) {
                            console.warn(`Could not set image for field "${fieldId}":`, err)
                        }
                    }
                } catch (err) {
                    console.error(`Error processing image for field "${fieldId}":`, err)
                }
                continue
            }

            try {
                // Try as text field first
                const field = form.getTextField(fieldId)
                field.setText(String(value))
                field.setFontSize(14)
                field.updateAppearances(customFont)
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
