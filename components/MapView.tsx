import React, { useState, useCallback } from 'react';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Address, RoofFacet } from '../types';

interface MapViewProps {
  address: Address;
  onMeasurementComplete: (facets: RoofFacet[]) => void;
}

export const MapView: React.FC<MapViewProps> = ({ address, onMeasurementComplete }) => {
  const map = useMap();
  const geometryLib = useMapsLibrary('geometry');
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Array<{ lat: number; lng: number }>>([]);
  const [facets, setFacets] = useState<RoofFacet[]>([]);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

  const calculateArea = useCallback((points: Array<{ lat: number; lng: number }>) => {
    if (!geometryLib || points.length < 3) return 0;

    const path = points.map(p => new google.maps.LatLng(p.lat, p.lng));
    const area = geometryLib.spherical.computeArea(path);
    return area * 10.7639; // Convert square meters to square feet
  }, [geometryLib]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!isDrawing || !e.latLng) return;

    const newPoint = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    const newPoints = [...points, newPoint];
    setPoints(newPoints);

    if (polygon) {
      polygon.setMap(null);
    }

    const newPolygon = new google.maps.Polygon({
      paths: newPoints,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
    });
    setPolygon(newPolygon);
  }, [isDrawing, points, polygon, map]);

  const startDrawing = () => {
    setIsDrawing(true);
    setPoints([]);
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
    }
  };

  const completeDrawing = () => {
    if (points.length < 3) {
      alert('Please draw at least 3 points to create a roof facet');
      return;
    }

    const area = calculateArea(points);
    const newFacet: RoofFacet = {
      id: `facet-${Date.now()}`,
      area,
      angle: 0, // Default angle, can be adjusted
      points: [...points],
    };

    const updatedFacets = [...facets, newFacet];
    setFacets(updatedFacets);
    setIsDrawing(false);
    setPoints([]);

    if (polygon) {
      polygon.setOptions({ fillColor: '#0000FF', strokeColor: '#0000FF' });
    }
  };

  const clearDrawing = () => {
    setPoints([]);
    setIsDrawing(false);
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
    }
  };

  const clearAllFacets = () => {
    facets.forEach(() => {
      if (polygon) {
        polygon.setMap(null);
      }
    });
    setFacets([]);
    setPolygon(null);
  };

  const finalizeMeasurement = () => {
    if (facets.length === 0) {
      alert('Please draw at least one roof facet');
      return;
    }
    onMeasurementComplete(facets);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Trace Roof Outline</h2>
      <div className="mb-4 space-y-2">
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <p className="font-semibold mb-1">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Start Drawing" to begin tracing a roof section</li>
            <li>Click on the map to add points around the roof perimeter</li>
            <li>Click "Complete Facet" when finished with one section</li>
            <li>Repeat for additional roof sections if needed</li>
            <li>Click "Generate Quote" when all sections are traced</li>
          </ol>
        </div>
      </div>

      <div className="mb-4 border-2 border-gray-300 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <Map
          defaultCenter={address.coordinates}
          defaultZoom={20}
          mapTypeId="satellite"
          onClick={handleMapClick}
          disableDefaultUI={false}
          gestureHandling="greedy"
        />
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          {!isDrawing ? (
            <button
              onClick={startDrawing}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Start Drawing
            </button>
          ) : (
            <>
              <button
                onClick={completeDrawing}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Complete Facet ({points.length} points)
              </button>
              <button
                onClick={clearDrawing}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {facets.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Roof Sections: {facets.length}
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              {facets.map((facet, idx) => (
                <li key={facet.id}>
                  Section {idx + 1}: {facet.area.toFixed(2)} sq ft
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button
                onClick={finalizeMeasurement}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Generate Quote
              </button>
              <button
                onClick={clearAllFacets}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
