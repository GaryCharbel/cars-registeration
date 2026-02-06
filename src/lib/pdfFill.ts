import { PDFDocument } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import ArabicReshaper from 'arabic-reshaper'
import bidiFactory from 'bidi-js'
import type { FormData } from '../types/form'
import cairoFontUrl from '../assets/fonts/Amiri-Regular.ttf'

const bidi = bidiFactory()

export async function fillPdf(
    sourcePdfPath: string,
    formData: FormData
): Promise<Blob> {
    try {
        console.log('Starting PDF form fill process...')

        // Fetch the source PDF
        const response = await fetch(sourcePdfPath)
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
        }
        const pdfBytes = await response.arrayBuffer()

        // Load the PDF
        const pdfDoc = await PDFDocument.load(pdfBytes)
        pdfDoc.registerFontkit(fontkit)

        // Load Arabic Font
        const fontBytes = await fetch(cairoFontUrl).then(res => {
            if (!res.ok) throw new Error(`Failed to load font: ${res.statusText}`)
            return res.arrayBuffer()
        })
        const customFont = await pdfDoc.embedFont(fontBytes)

        // Get the form
        const form = pdfDoc.getForm()

        // Utility to reshape Arabic text
        const reshapeText = (text: string) => {
            if (!text) return text
            // Check if text contains Arabic characters
            const arabicPattern = /[\u0600-\u06FF]/
            if (!arabicPattern.test(text)) return text

            try {
                // 1. Reshape Arabic characters (joining)
                const reshaped = ArabicReshaper.reshape(text)
                // 2. Reorder for RTL
                const bidiText = bidi.getReorderedText(reshaped)
                return bidiText
            } catch (e) {
                console.warn('Arabic reshaping failed, using original text:', e)
                return text
            }
        }

        // Fill form fields
        for (const [fieldId, value] of Object.entries(formData)) {
            if (value === undefined || value === null || value === '') {
                continue
            }

            // Handle Photo Upload (Button Field)
            if (fieldId === 'chamsiyePic' || value instanceof FileList) {
                const files = value as unknown as FileList
                if (files.length > 0) {
                    try {
                        const file = files[0]
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
                                console.log(`✓ Embedded photo in "${fieldId}"`)
                            } catch (err) {
                                console.warn(`Could not set image for field "${fieldId}"`)
                            }
                        }
                    } catch (err) {
                        console.error(`Error processing image for field "${fieldId}":`, err)
                    }
                }
                continue
            }

            try {
                let field
                try {
                    field = form.getField(fieldId)
                } catch (e) {
                    console.warn(`Field "${fieldId}" not found in PDF.`)
                    continue
                }

                if (field.constructor.name.includes('PDFTextField')) {
                    const textField = form.getTextField(fieldId)
                    const rawText = String(value)
                    const textValue = reshapeText(rawText)

                    try {
                        textField.setFontSize(18) // Extra large for readability
                        textField.setText(textValue)
                        textField.updateAppearances(customFont)
                    } catch (textError) {
                        try {
                            textField.setFontSize(18)
                            textField.updateAppearances(customFont)
                            textField.setText(textValue)
                        } catch (recoveryError) {
                            console.error(`Final failure for text field "${fieldId}"`)
                        }
                    }
                } else if (field.constructor.name.includes('PDFCheckBox')) {
                    const checkbox = form.getCheckBox(fieldId)
                    // Robust boolean check
                    const isChecked = value === true ||
                        value === 'true' ||
                        value === 'on' ||
                        value === 'yes' ||
                        value === 'ذكر'

                    if (isChecked) {
                        checkbox.check()
                    } else {
                        checkbox.uncheck()
                    }
                } else if (field.constructor.name.includes('PDFDropdown')) {
                    const dropdown = form.getDropdown(fieldId)
                    dropdown.select(String(value))
                    dropdown.updateAppearances(customFont)
                }
            } catch (error) {
                console.warn(`Major error processing field "${fieldId}":`, error)
            }
        }

        const filledPdfBytes = await pdfDoc.save()
        return new Blob([new Uint8Array(filledPdfBytes)], { type: 'application/pdf' })
    } catch (error) {
        console.error('Error filling PDF:', error)
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
