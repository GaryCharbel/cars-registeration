import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import ArabicReshaper from 'arabic-reshaper'
import bidiFactory from 'bidi-js'
import type { FormData } from '../types/form'
import cairoFontUrl from '../assets/fonts/Amiri-Regular.ttf'
import ArabicReshaper from 'arabic-reshaper'

interface FieldMapping {
    fieldId: string
    x: number
    y: number
    page: number
    fontSize?: number
    width?: number
    height?: number
    type?: string
}

interface Mapping {
    fields: FieldMapping[]
}

const bidi = bidiFactory()

export async function fillPdf(
    sourcePdfPath: string,
    formData: FormData,
    pdfId?: string
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

        // Load mapping file if pdfId is provided
        let mapping: Mapping | null = null
        if (pdfId) {
            try {
                const mappingPath = `/pdfs/${pdfId}/mapping.json?t=${Date.now()}`
                console.log('Loading mapping from:', mappingPath)
                const mappingResponse = await fetch(mappingPath)
                if (mappingResponse.ok) {
                    const data = await mappingResponse.json()
                    mapping = data as Mapping
                    console.log('Mapping loaded successfully:', mapping.fields.length, 'fields')
                }
            } catch (err) {
                console.warn('Could not load mapping file:', err)
            }
        }

        // Safety check for mapping
        if (!mapping) {
            console.warn('No mapping file found, PDF will not be filled')
            return new Blob([], { type: 'application/pdf' })
        }
        const finalMapping = mapping;

        // Get the form and flatten it
        const form = pdfDoc.getForm()
        console.log('Flattening form...')
        form.flatten()
        console.log('Form flattened')

        const pages = pdfDoc.getPages()

        // Create a lookup for fields by name for easier access
        const pdfFields = form.getFields()
        console.log(`PDF has ${pdfFields.length} internal fields`)

        // Iterate through each field in our mapping and draw onto the page
        for (const fieldMapping of finalMapping.fields) {
            const value = formData[fieldMapping.fieldId]

            if (value === undefined || value === null || value === '') {
                continue
            }

            // Get actual coordinates from the PDF if possible
            let x = fieldMapping.x
            let y = fieldMapping.y
            let width = fieldMapping.width || 0
            let height = fieldMapping.height || 0

            try {
                const pdfField = form.getField(fieldMapping.fieldId)
                if (pdfField) {
                    const widgets = pdfField.acroField.getWidgets()
                    if (widgets.length > 0) {
                        const rect = widgets[0].getRectangle()
                        x = rect.x
                        // The rect.y is the bottom of the field. 
                        // Adding a tiny offset to sit perfectly ON the line.
                        y = rect.y + 2
                        width = rect.width
                        height = rect.height
                    }
                }
            } catch (err) {
                console.warn(`No native coords for "${fieldMapping.fieldId}", using mapping.json defaults`)
            }

            const pageIndex = fieldMapping.page || 0
            const page = pages[pageIndex]
            if (!page) continue

            // Handle image fields
            const isImageField = fieldMapping.type === 'image' || fieldMapping.fieldId.toLowerCase().includes('pic')
            if (isImageField) {
                if (value) {
                    try {
                        let file: File | null = null
                        if (value instanceof FileList && value.length > 0) {
                            file = value[0]
                        } else if (value instanceof File) {
                            file = value
                        } else if (typeof value === 'object' && value !== null && 'length' in (value as any)) {
                            file = (value as any)[0]
                        }

                        if (file instanceof File) {
                            const arrayBuffer = await file.arrayBuffer()
                            const imageBytes = new Uint8Array(arrayBuffer)
                            let image
                            try {
                                image = await pdfDoc.embedJpg(imageBytes)
                            } catch {
                                image = await pdfDoc.embedPng(imageBytes)
                            }

                            if (image && width && height) {
                                page.drawImage(image, {
                                    x: x,
                                    y: y - 2, // Compensate for the +2 baseline offset
                                    width: width,
                                    height: height,
                                })
                                console.log(`✓ Drew image for "${fieldMapping.fieldId}"`)
                            }
                        }
                    } catch (err) {
                        console.error(`Error processing image for "${fieldMapping.fieldId}":`, err)
                    }
                }
                continue
            }

            // Handle checkbox fields
            if (fieldMapping.type === 'checkbox') {
                if (value === true || value === 'true' || value === 'on') {
                    page.drawText('X', {
                        x: x + (width / 4),
                        y: y + (height / 4),
                        size: 12,
                        font: customFont,
                        color: rgb(0, 0, 0),
                    })
                    console.log(`✓ Drew checkbox for "${fieldMapping.fieldId}"`)
                }
                continue
            }

            // Handle text fields
            const fontSize = fieldMapping.fontSize || 10
            let textValue = String(value)

            // Reshape Arabic text for proper character joining and reverse for RTL
            const arabicPattern = /[\u0600-\u06FF]/
            if (arabicPattern.test(textValue)) {
                try {
                    const reshaper = (ArabicReshaper as any).default || ArabicReshaper
                    let shapedText = textValue

                    // The correct method for this library is convertArabic
                    if (reshaper && typeof reshaper.convertArabic === 'function') {
                        shapedText = reshaper.convertArabic(textValue)
                    } else if (reshaper && typeof reshaper.reshape === 'function') {
                        shapedText = reshaper.reshape(textValue)
                    } else if (typeof reshaper === 'function') {
                        shapedText = (reshaper as any)(textValue)
                    }

                    textValue = shapedText.split('').reverse().join('')
                    console.log(`✓ Formatted Arabic: "${textValue}"`)
                } catch (err) {
                    console.warn('Could not reshape Arabic text:', err)
                    textValue = textValue.split('').reverse().join('')
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

            // Draw the text
            page.drawText(textValue, {
                x: x,
                y: y,
                size: fontSize,
                font: customFont,
                color: rgb(0, 0, 0),
            })
            console.log(`✓ Drew text "${textValue}" for "${fieldMapping.fieldId}"`)
        }

        const filledPdfBytes = await pdfDoc.save()
        return new Blob([new Uint8Array(filledPdfBytes)], { type: 'application/pdf' })
    } catch (error) {
        console.error('Error filling PDF:', error)
        throw new Error('فشل في إنشاء PDF')
    }
}

export function downloadPdf(blob: Blob, filename: string) {
    console.log('downloadPdf called with filename:', filename)
    console.log('Blob size:', blob.size, 'bytes')

    const url = URL.createObjectURL(blob)
    console.log('Created blob URL:', url)

    // Create link element
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'

    // Append to body (required for Firefox)
    document.body.appendChild(link)

    // Trigger download
    link.click()
    console.log('Download triggered for:', filename)

    // Also open in new tab so user can view it immediately
    window.open(url, '_blank')
    console.log('Opened PDF in new tab')

    // Clean up after a delay
    setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        console.log('Cleaned up download link and blob URL')
    }, 100)
}
