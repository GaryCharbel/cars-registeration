interface PdfChooserProps {
    onSelectPdf: (pdfId: string) => void
}

const AVAILABLE_PDFS = [
    { id: 'car-public', name: 'محضر امتحان سياحة عمومية', description: 'نموذج محضر الامتحان لفئة السياحة العمومية', icon: '🚐' },
    { id: 'car-private-auto', name: 'خصوصي أوتوماتيك (نموذج 1)', description: 'امتحان رخصة سوق سياحة خصوصية (أوتوماتيك)', icon: '🚗' },
    { id: 'car-private-auto-full', name: 'خصوصي أوتوماتيك (نموذج 2)', description: 'النموذج الكامل لامتحان رخصة سوق سياحة خصوصية', icon: '💎' },
    { id: 'car-private-manual', name: 'خصوصي يدوي', description: 'امتحان رخصة سوق سياحة خصوصية (ناقل حركة يدوي)', icon: '⚙️' },
    { id: 'motorcycle-request', name: 'طلب / امتحان دراجات آلية', description: 'طلب الحصول على رخصة سوق دراجة آلية أو محضر تقييم', icon: '🏍️' },
]

export default function PdfChooser({ onSelectPdf: onSelect }: PdfChooserProps) {
    return (
        <div className="min-h-screen bg-[#f8fafc] py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full">
                        نظام إدارة النماذج
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
                        نظام ملء نماذج <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">امتحانات القيادة</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        منصة ذكية لملء وإدارة نماذج امتحانات السوق اللبنانية بسهولة ودقة
                    </p>
                </div>

                {/* PDF Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {AVAILABLE_PDFS.map((pdf) => (
                        <button
                            key={pdf.id}
                            onClick={() => onSelect(pdf.id)}
                            className="group relative flex flex-col items-end bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 p-10 text-right border border-gray-100 hover:border-blue-400 transform hover:-translate-y-2 overflow-hidden"
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

                            {/* Icon Wrapper */}
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-blue-500/30 mb-8 group-hover:rotate-6 transition-transform z-10">
                                {pdf.icon}
                            </div>

                            {/* Content */}
                            <div className="z-10">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                    {pdf.name}
                                </h2>
                                <p className="text-lg text-gray-400 leading-relaxed font-medium">
                                    {pdf.description}
                                </p>
                            </div>

                            {/* Action Footer */}
                            <div className="mt-10 flex items-center text-blue-600 font-bold text-lg opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <span className="mr-3">ابدأ الآن</span>
                                <span className="text-2xl">←</span>
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
