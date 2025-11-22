import React, { useState } from 'react';
import { RoofMeasurement as RoofMeasurementType } from '../types';

interface RoofMeasurementProps {
  measurement: RoofMeasurementType;
  onUpdateMeasurement: (measurement: RoofMeasurementType) => void;
}

export const RoofMeasurement: React.FC<RoofMeasurementProps> = ({
  measurement,
  onUpdateMeasurement,
}) => {
  const [pitch, setPitch] = useState(measurement.pitch);
  const [complexity, setComplexity] = useState(measurement.complexity);

  const handleUpdate = () => {
    onUpdateMeasurement({
      ...measurement,
      pitch,
      complexity,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Roof Measurements</h2>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">Calculated Area</h3>
          <p className="text-3xl font-bold text-blue-600">
            {measurement.totalArea.toFixed(2)} sq ft
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ({(measurement.totalArea / 100).toFixed(2)} squares)
          </p>
        </div>

        <div>
          <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-2">
            Roof Pitch (e.g., 6 = 6/12 pitch)
          </label>
          <input
            type="number"
            id="pitch"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value) || 0)}
            min="0"
            max="12"
            step="0.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            Higher pitch requires more material and labor. Typical range: 4-8
          </p>
        </div>

        <div>
          <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-2">
            Roof Complexity
          </label>
          <select
            id="complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value as 'simple' | 'moderate' | 'complex')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="simple">Simple (1-2 sections, no valleys)</option>
            <option value="moderate">Moderate (3-4 sections, some valleys)</option>
            <option value="complex">Complex (5+ sections, multiple valleys/dormers)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Complexity affects labor costs and material waste
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">Roof Sections</h3>
          <div className="space-y-2">
            {measurement.facets.map((facet, idx) => (
              <div key={facet.id} className="flex justify-between text-sm">
                <span className="text-gray-600">Section {idx + 1}:</span>
                <span className="font-medium text-gray-800">{facet.area.toFixed(2)} sq ft</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Measurements
        </button>
      </div>
    </div>
  );
};
