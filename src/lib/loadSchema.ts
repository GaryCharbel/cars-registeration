import type { FormSchema } from '../types/form'

export async function loadSchema(pdfId: string): Promise<FormSchema> {
    try {
        const response = await fetch(`/pdfs/${pdfId}/schema.json`)
        if (!response.ok) {
            throw new Error(`Failed to load schema for ${pdfId}`)
        }
        const schema: FormSchema = await response.json()
        return schema
    } catch (error) {
        console.error('Error loading schema:', error)
        throw error
    }
}
