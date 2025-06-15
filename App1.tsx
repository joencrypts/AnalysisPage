import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import ResultsDisplay from './components/ResultsDisplay';
import { ProcessingState, Restoration } from './types';

function App() {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [restoration, setRestoration] = useState<Restoration | null>(null);

  const handleImageSelect = (imageFile: File, imageUrl: string) => {
    setOriginalImage(imageUrl);
    setRestoration(null);
  };

  const handleProcessingStateChange = (state: ProcessingState) => {
    setProcessingState(state);
  };

  const handleRestorationComplete = (result: Restoration) => {
    setRestoration(result);
    setProcessingState('completed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <ImageUpload
              onImageSelect={handleImageSelect}
              onProcessingStateChange={handleProcessingStateChange}
              onRestorationComplete={handleRestorationComplete}
              processingState={processingState}
              originalImage={originalImage}
            />
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <ResultsDisplay
              originalImage={originalImage}
              restoration={restoration}
              processingState={processingState}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;