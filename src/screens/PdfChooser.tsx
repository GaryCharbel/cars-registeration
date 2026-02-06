interface PdfChooserProps {
    onSelectPdf: (pdfId: string) => void
}

const AVAILABLE_PDFS = [
    { id: 'car-private-auto', name: 'إمتحان سياحي خصوصي أوتوماتيك', nameEn: 'Private Car Exam (Automatic)' },
    { id: 'car-private-manual', name: 'إمتحان سياحي خصوصي يدوي', nameEn: 'Private Car Exam (Manual)' },
    { id: 'car-public', name: 'محضر امتحان عمومي', nameEn: 'Public Car Exam' },
    { id: 'motorcycle-exam', name: 'محضر تقييم الرخصة سوق الدراجات الآلية', nameEn: 'Motorcycle License Evaluation' },
    { id: 'motorcycle-request', name: 'طلب دراجات', nameEn: 'Motorcycle Request' },
]

export default function PdfChooser({ onSelectPdf: onSelect }: PdfChooserProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        نظام ملء نماذج امتحانات القيادة
                    </h1>
                    <p className="text-lg text-gray-600">
                        اختر نوع الامتحان لملء النموذج
                    </p>
                </div>

                {/* PDF Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AVAILABLE_PDFS.map((pdf) => (
                        <button
                            key={pdf.id}
                            onClick={() => onSelect(pdf.id)}
                            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-right border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-1"
                        >
                            {/* Icon */}
                            <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                                📄
                            </div>

                            {/* Content */}
                            <div className="mt-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {pdf.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    انقر لملء النموذج
                                </p>
                            </div>

                            {/* Arrow indicator */}
                            <div className="absolute bottom-6 left-6 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                ←
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 text-sm">
                    <p>جميع الحقول مطلوبة ما لم يُذكر خلاف ذلك</p>
                </div>
            </div>
        </div>
    )
}
