import { useEffect, useState } from 'react'
import DynamicForm from '../components/DynamicForm'

import { loadSchema } from '../lib/loadSchema'
import { fillPdf, downloadPdf } from '../lib/pdfFill'
import type { FormSchema, FormData } from '../types/form'

interface PdfFillScreenProps {
    pdfId: string
    onBack: () => void
}

export default function PdfFillScreen({ pdfId, onBack }: PdfFillScreenProps) {
    const [schema, setSchema] = useState<FormSchema | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [generating, setGenerating] = useState(false)

    const pdfPath = `/pdfs/${pdfId}/source.pdf`

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)
                const schemaData = await loadSchema(pdfId)
                setSchema(schemaData)
            } catch (err) {
                console.error('Error loading data:', err)
                setError('فشل في تحميل بيانات النموذج')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [pdfId])

    const handleSubmit = async (formData: FormData) => {
        try {
            setGenerating(true)
            const pdfBlob = await fillPdf(pdfPath, formData, pdfId)

            // Generate filename: [form type] - [date] - [client name]
            const today = new Date()
            const dateStr = today.toISOString().split('T')[0] // YYYY-MM-DD
            const clientName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'client'
            const formType = schema?.formType || pdfId
            const filename = `${formType} - ${dateStr} - ${clientName}.pdf`

            downloadPdf(pdfBlob, filename)
        } catch (err) {
            console.error('Error generating PDF:', err)
            alert('فشل في إنشاء PDF. يرجى المحاولة مرة أخرى.')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={onBack}
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
                ← رجوع (Back)
            </button>

            {loading && (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-600">جاري التحميل...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-right">
                    {error}
                </div>
            )}

            {!loading && !error && schema && (
                <div className="max-w-3xl mx-auto">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        {generating && (
                            <div className="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-right">
                                جاري إنشاء PDF...
                            </div>
                        )}
                        <DynamicForm schema={schema} onSubmit={handleSubmit} />
                    </div>

                </div>
            )}
        </div>
    )
}
