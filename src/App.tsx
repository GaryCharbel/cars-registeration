import { useState } from 'react'
import PdfChooser from './screens/PdfChooser'
import PdfFillScreen from './screens/PdfFillScreen'

function App() {
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-gray-50">
            {!selectedPdf ? (
                <PdfChooser onSelectPdf={setSelectedPdf} />
            ) : (
                <PdfFillScreen pdfId={selectedPdf} onBack={() => setSelectedPdf(null)} />
            )}
        </div>
    )
}

export default App
