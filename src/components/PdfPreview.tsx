import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use local worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString()

interface PdfPreviewProps {
    pdfPath: string
}

export default function PdfPreview({ pdfPath }: PdfPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const renderTaskRef = useRef<any>(null)

    useEffect(() => {
        const loadPdf = async () => {
            try {
                setLoading(true)
                setError(null)

                // Cancel previous render task if exists
                if (renderTaskRef.current) {
                    renderTaskRef.current.cancel()
                }

                const loadingTask = pdfjsLib.getDocument(pdfPath)
                const pdf = await loadingTask.promise
                const page = await pdf.getPage(1) // Get first page

                const canvas = canvasRef.current
                if (!canvas) return

                const context = canvas.getContext('2d')
                if (!context) return

                const viewport = page.getViewport({ scale: 1.5 })
                canvas.height = viewport.height
                canvas.width = viewport.width

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                }

                renderTaskRef.current = page.render(renderContext)
                await renderTaskRef.current.promise
                renderTaskRef.current = null
                setLoading(false)
            } catch (err: any) {
                if (err?.name === 'RenderingCancelledException') {
                    return // Ignore cancellation errors
                }
                console.error('Error loading PDF:', err)
                setError('فشل تحميل معاينة PDF')
                setLoading(false)
            }
        }

        loadPdf()

        return () => {
            // Cleanup on unmount
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel()
            }
        }
    }, [pdfPath])

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-right">
                معاينة النموذج
            </h3>

            <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-3"></div>
                            <p className="text-gray-600 font-medium">جاري تحميل المعاينة...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
                        <div className="text-center p-6">
                            <span className="text-4xl mb-3 block">⚠️</span>
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="mx-auto max-w-full h-auto"
                    style={{ display: loading || error ? 'none' : 'block' }}
                />
            </div>
        </div>
    )
}
