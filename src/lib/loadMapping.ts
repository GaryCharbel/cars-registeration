import type { PdfMapping } from '../types/form'

export async function loadMapping(pdfId: string): Promise<PdfMapping> {
    try {
        const response = await fetch(`/pdfs/${pdfId}/mapping.json`)
        if (!response.ok) {
            throw new Error(`Failed to load mapping for ${pdfId}`)
        }
        const mapping: PdfMapping = await response.json()
        return mapping
    } catch (error) {
        console.error('Error loading mapping:', error)
        throw error
    }
}
