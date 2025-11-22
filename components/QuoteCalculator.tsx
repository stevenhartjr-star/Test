import React, { useState, useEffect } from 'react';
import { MaterialOption, RoofMeasurement, Quote, Address } from '../types';

interface QuoteCalculatorProps {
  address: Address;
  measurement: RoofMeasurement;
  onQuoteGenerated: (quote: Quote) => void;
}

const MATERIAL_OPTIONS: MaterialOption[] = [
  {
    id: 'asphalt-3tab',
    name: '3-Tab Asphalt Shingles',
    pricePerSquareFoot: 1.50,
    warranty: '20-25 years',
    description: 'Budget-friendly option, basic protection',
  },
  {
    id: 'asphalt-architectural',
    name: 'Architectural Asphalt Shingles',
    pricePerSquareFoot: 2.25,
    warranty: '30-50 years',
    description: 'Popular choice, enhanced durability and aesthetics',
  },
  {
    id: 'metal',
    name: 'Metal Roofing',
    pricePerSquareFoot: 4.50,
    warranty: '40-70 years',
    description: 'Long-lasting, energy efficient, modern look',
  },
  {
    id: 'tile',
    name: 'Clay or Concrete Tile',
    pricePerSquareFoot: 6.00,
    warranty: '50-100 years',
    description: 'Premium option, excellent durability',
  },
];

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  address,
  measurement,
  onQuoteGenerated,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(MATERIAL_OPTIONS[1]);
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    calculateQuote();
  }, [selectedMaterial, measurement]);

  const calculateQuote = () => {
    const totalArea = measurement.totalArea;

    // Base material cost
    const materialCost = totalArea * selectedMaterial.pricePerSquareFoot;

    // Labor cost based on area, pitch, and complexity
    let laborRatePerSqFt = 2.50; // Base rate

    // Adjust for pitch
    if (measurement.pitch >= 8) {
      laborRatePerSqFt += 1.00; // Steep roof premium
    } else if (measurement.pitch >= 6) {
      laborRatePerSqFt += 0.50;
    }

    // Adjust for complexity
    const complexityMultipliers = {
      simple: 1.0,
      moderate: 1.15,
      complex: 1.35,
    };
    laborRatePerSqFt *= complexityMultipliers[measurement.complexity];

    const laborCost = totalArea * laborRatePerSqFt;

    // Additional costs
    const additionalCosts = {
      permits: 500, // Typical permit cost
      disposal: Math.ceil(totalArea / 100) * 100, // $100 per square for disposal
      underlayment: totalArea * 0.50, // Underlayment material
      flashing: measurement.facets.length * 150, // Flashing per section
    };

    const totalAdditional = Object.values(additionalCosts).reduce((sum, cost) => sum + cost, 0);
    const totalCost = materialCost + laborCost + totalAdditional;

    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      address,
      measurement,
      selectedMaterial,
      laborCost,
      materialCost,
      additionalCosts,
      totalCost,
      dateCreated: new Date(),
    };

    setQuote(newQuote);
  };

  const handleGenerateQuote = () => {
    if (quote) {
      onQuoteGenerated(quote);
    }
  };

  if (!quote) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quote Calculator</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Roofing Material
          </label>
          <div className="space-y-2">
            {MATERIAL_OPTIONS.map((material) => (
              <div
                key={material.id}
                onClick={() => setSelectedMaterial(material)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMaterial.id === material.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{material.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Warranty: {material.warranty}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-blue-600">
                      ${material.pricePerSquareFoot.toFixed(2)}/sq ft
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Materials ({totalArea.toFixed(0)} sq ft):</span>
              <span className="font-medium">${quote.materialCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Labor:</span>
              <span className="font-medium">${quote.laborCost.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <p className="text-sm font-medium text-gray-600 mb-2">Additional Costs:</p>
              <div className="pl-4 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Permits:</span>
                  <span>${quote.additionalCosts.permits.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Old Roof Disposal:</span>
                  <span>${quote.additionalCosts.disposal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Underlayment:</span>
                  <span>${quote.additionalCosts.underlayment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Flashing & Trim:</span>
                  <span>${quote.additionalCosts.flashing.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="border-t-2 border-gray-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total Estimate:</span>
                <span className="text-3xl font-bold text-green-600">
                  ${quote.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> This is an estimated quote based on the measurements provided.
            Final pricing may vary based on actual site conditions, accessibility, and specific
            requirements. A detailed on-site inspection is recommended for an accurate quote.
          </p>
        </div>

        <button
          onClick={handleGenerateQuote}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
        >
          Finalize Quote
        </button>
      </div>
    </div>
  );
};

// Helper to access totalArea directly
const totalArea = (measurement: RoofMeasurement) => measurement.totalArea;
