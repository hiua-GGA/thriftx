'use client';

import { useState } from 'react';
import Image from 'next/image';

interface VirtualTryOnProps {
  product: any; // In a real app, this would be properly typed
}

const VirtualTryOn = ({ product }: VirtualTryOnProps) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = () => {
    if (!previewImage) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // In a real app, this would call an API to process the image
      setResult('/images/virtual-try-on-result.jpg');
      setIsProcessing(false);
    }, 2000);
  };

  const handleReset = () => {
    setPreviewImage(null);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side - Controls */}
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-4">Virtual Try-On</h3>
          <p className="text-gray-600 mb-6">
            See how this {product.name} looks on you before purchasing. 
            Upload a photo or use your camera to create a virtual fitting.
          </p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'upload'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              Upload Photo
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'camera'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('camera')}
            >
              Use Camera
            </button>
          </div>

          {/* Upload Photo Tab */}
          {activeTab === 'upload' && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload your photo
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="guidelines"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="guidelines" className="ml-2 block text-sm text-gray-700">
                    I understand that my photo will be processed to create a virtual try-on
                  </label>
                </div>

                <button
                  className="w-full btn-secondary py-3"
                  disabled={!previewImage || isProcessing}
                  onClick={handleTryOn}
                >
                  {isProcessing ? 'Processing...' : 'Try It On'}
                </button>
              </div>
            </div>
          )}

          {/* Camera Tab */}
          {activeTab === 'camera' && (
            <div>
              <p className="text-gray-600 mb-4">
                Position yourself in front of the camera, ensuring good lighting and a neutral background.
              </p>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-6">
                <CameraIcon className="w-16 h-16 text-gray-400" />
              </div>
              <button className="w-full btn-secondary py-3 mb-4">
                Take Photo
              </button>
              <p className="text-xs text-gray-500 text-center">
                Your privacy is important to us. Photos are processed securely and not stored permanently.
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="bg-gray-50 p-6 md:p-8 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Preview</h3>
          
          {!previewImage && !result && (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <div className="bg-gray-200 rounded-full p-4 mb-4">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Upload a photo or use your camera to see a preview
              </p>
            </div>
          )}

          {previewImage && !result && (
            <div className="flex-grow flex flex-col">
              <div className="relative flex-grow mb-4 rounded-lg overflow-hidden">
                <Image 
                  src={previewImage} 
                  alt="Preview" 
                  fill
                  className="object-cover"
                />
              </div>
              <button 
                className="text-primary-600 text-sm hover:underline"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          )}

          {result && (
            <div className="flex-grow flex flex-col">
              <div className="relative flex-grow mb-4 rounded-lg overflow-hidden">
                <Image 
                  src={result} 
                  alt="Try-on Result" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between">
                <button 
                  className="text-primary-600 text-sm hover:underline"
                  onClick={handleReset}
                >
                  Try Another Photo
                </button>
                <button className="text-primary-600 text-sm hover:underline">
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;

// Icon components
const UploadIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const CameraIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const ImageIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
); 