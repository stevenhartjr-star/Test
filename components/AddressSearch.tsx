import React, { useState } from 'react';
import { Address } from '../types';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface AddressSearchProps {
  onAddressSelect: (address: Address) => void;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({ onAddressSelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const geocodingLib = useMapsLibrary('geocoding');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setError('Please enter an address');
      return;
    }

    if (!geocodingLib) {
      setError('Maps library not loaded yet. Please wait...');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const geocoder = new geocodingLib.Geocoder();
      const result = await geocoder.geocode({ address: searchValue });

      if (result.results && result.results.length > 0) {
        const place = result.results[0];
        const addressComponents = place.address_components || [];

        let street = '';
        let city = '';
        let state = '';
        let zipCode = '';

        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('street_number')) {
            street = component.long_name + ' ';
          }
          if (types.includes('route')) {
            street += component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
          if (types.includes('postal_code')) {
            zipCode = component.long_name;
          }
        });

        const address: Address = {
          street: street.trim(),
          city,
          state,
          zipCode,
          formattedAddress: place.formatted_address || searchValue,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        };

        onAddressSelect(address);
        setSearchValue('');
      } else {
        setError('Address not found. Please try a different search.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to search address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Property Address</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <input
            type="text"
            id="address"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="123 Main St, City, State ZIP"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            disabled={isLoading}
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search Address'}
        </button>
      </form>
    </div>
  );
};
