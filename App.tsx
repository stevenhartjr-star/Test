import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AddressSearch } from './components/AddressSearch';
import { MapView } from './components/MapView';
import { RoofMeasurement } from './components/RoofMeasurement';
import { QuoteCalculator } from './components/QuoteCalculator';
import { Address, RoofMeasurement as RoofMeasurementType, RoofFacet, Quote } from './types';

type AppStep = 'address' | 'map' | 'measurement' | 'quote' | 'final';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('address');
  const [address, setAddress] = useState<Address | null>(null);
  const [measurement, setMeasurement] = useState<RoofMeasurementType | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const handleAddressSelect = (selectedAddress: Address) => {
    setAddress(selectedAddress);
    setCurrentStep('map');
  };

  const handleMeasurementComplete = (facets: RoofFacet[]) => {
    const totalArea = facets.reduce((sum, facet) => sum + facet.area, 0);
    const newMeasurement: RoofMeasurementType = {
      totalArea,
      pitch: 6, // Default pitch
      facets,
      complexity: facets.length <= 2 ? 'simple' : facets.length <= 4 ? 'moderate' : 'complex',
    };
    setMeasurement(newMeasurement);
    setCurrentStep('measurement');
  };

  const handleUpdateMeasurement = (updatedMeasurement: RoofMeasurementType) => {
    setMeasurement(updatedMeasurement);
    setCurrentStep('quote');
  };

  const handleQuoteGenerated = (generatedQuote: Quote) => {
    setQuote(generatedQuote);
    setCurrentStep('final');
  };

  const handleStartOver = () => {
    setAddress(null);
    setMeasurement(null);
    setQuote(null);
    setCurrentStep('address');
  };

  const handleEditAddress = () => {
    setCurrentStep('address');
  };

  const handleEditMeasurement = () => {
    setCurrentStep('map');
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">
            Google Maps API key is not configured. Please add your API key to the environment variables.
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm font-mono text-gray-600">
              Create a <strong>.env.local</strong> file with:
            </p>
            <code className="block mt-2 text-xs bg-gray-800 text-green-400 p-2 rounded">
              VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">RoofQuote Pro</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Geospatial Roofing Estimation Platform
                </p>
              </div>
              <button
                onClick={handleStartOver}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Start New Quote
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep === 'address'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  1
                </div>
                <span className="font-medium text-gray-700">Address</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4">
                <div
                  className={`h-full ${
                    ['map', 'measurement', 'quote', 'final'].includes(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep === 'map'
                      ? 'bg-blue-600 text-white'
                      : ['measurement', 'quote', 'final'].includes(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="font-medium text-gray-700">Measure</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4">
                <div
                  className={`h-full ${
                    ['measurement', 'quote', 'final'].includes(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep === 'measurement'
                      ? 'bg-blue-600 text-white'
                      : ['quote', 'final'].includes(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  3
                </div>
                <span className="font-medium text-gray-700">Details</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4">
                <div
                  className={`h-full ${
                    ['quote', 'final'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep === 'quote' || currentStep === 'final'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  4
                </div>
                <span className="font-medium text-gray-700">Quote</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Current Step */}
            <div className="lg:col-span-2">
              {currentStep === 'address' && (
                <AddressSearch onAddressSelect={handleAddressSelect} />
              )}

              {currentStep === 'map' && address && (
                <MapView
                  address={address}
                  onMeasurementComplete={handleMeasurementComplete}
                />
              )}

              {currentStep === 'measurement' && measurement && (
                <RoofMeasurement
                  measurement={measurement}
                  onUpdateMeasurement={handleUpdateMeasurement}
                />
              )}

              {(currentStep === 'quote' || currentStep === 'final') && address && measurement && (
                <QuoteCalculator
                  address={address}
                  measurement={measurement}
                  onQuoteGenerated={handleQuoteGenerated}
                />
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>

                {address && (
                  <div className="mb-4 pb-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Property Address</h3>
                      {currentStep !== 'address' && (
                        <button
                          onClick={handleEditAddress}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.formattedAddress}</p>
                  </div>
                )}

                {measurement && (
                  <div className="mb-4 pb-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Measurements</h3>
                      {['quote', 'final'].includes(currentStep) && (
                        <button
                          onClick={handleEditMeasurement}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Area:</span>
                        <span className="font-medium">{measurement.totalArea.toFixed(2)} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pitch:</span>
                        <span className="font-medium">{measurement.pitch}/12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Complexity:</span>
                        <span className="font-medium capitalize">{measurement.complexity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sections:</span>
                        <span className="font-medium">{measurement.facets.length}</span>
                      </div>
                    </div>
                  </div>
                )}

                {quote && currentStep === 'final' && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Final Quote</h3>
                    <div className="bg-green-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-1">Estimated Total:</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${quote.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => window.print()}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Print Quote
                      </button>
                      <button
                        onClick={handleStartOver}
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        New Quote
                      </button>
                    </div>
                  </div>
                )}

                {!address && (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">Enter a property address to begin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white mt-12 border-t">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <p className="text-center text-sm text-gray-600">
              © 2024 RoofQuote Pro. Powered by geospatial technology for accurate roofing estimates.
            </p>
          </div>
        </footer>
      </div>
    </APIProvider>
  );
}
