export interface FormField {
    id: string
    label: string
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'tel' | 'file'
    required?: boolean
    options?: string[]
    placeholder?: string
}

export interface FormSchema {
    title: string
    formType: string // Used for filename generation
    fields: FormField[]
}

export interface FieldMapping {
    fieldId: string
    x: number
    y: number
    page: number
    fontSize?: number
    fontColor?: string
}

export interface PdfMapping {
    fields: FieldMapping[]
}

export type FormData = Record<string, string | number | boolean | any>
