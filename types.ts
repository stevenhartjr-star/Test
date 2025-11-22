export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  formattedAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RoofMeasurement {
  totalArea: number; // square feet
  pitch: number; // roof pitch (e.g., 6/12)
  facets: RoofFacet[];
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface RoofFacet {
  id: string;
  area: number; // square feet
  angle: number; // degrees
  points: Array<{ lat: number; lng: number }>;
}

export interface MaterialOption {
  id: string;
  name: string;
  pricePerSquareFoot: number;
  warranty: string;
  description: string;
}

export interface Quote {
  id: string;
  address: Address;
  measurement: RoofMeasurement;
  selectedMaterial: MaterialOption;
  laborCost: number;
  materialCost: number;
  additionalCosts: {
    permits: number;
    disposal: number;
    underlayment: number;
    flashing: number;
  };
  totalCost: number;
  dateCreated: Date;
}

export interface DrawingMode {
  isActive: boolean;
  points: Array<{ lat: number; lng: number }>;
  currentFacet: RoofFacet | null;
}
