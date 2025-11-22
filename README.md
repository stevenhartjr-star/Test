# RoofQuote Pro - Geospatial Roofing Estimation Platform

A modern web application that leverages geospatial technology to provide accurate roofing measurements and instant cost estimates for roofing contractors and homeowners.

## Features

- **Address Search**: Enter any property address to locate and view it on satellite imagery
- **Geospatial Roof Measurement**: Draw roof sections directly on satellite imagery to get accurate measurements
- **Automatic Area Calculation**: Real-time calculation of roof area in square feet
- **Roof Pitch & Complexity**: Adjust roof pitch and complexity for precise estimates
- **Material Selection**: Choose from multiple roofing materials (Asphalt, Metal, Tile, etc.)
- **Comprehensive Pricing**: Detailed cost breakdown including:
  - Material costs
  - Labor costs (adjusted for pitch and complexity)
  - Permits
  - Disposal fees
  - Underlayment and flashing
- **Interactive Progress Tracking**: Step-by-step workflow from address to final quote
- **Print-Ready Quotes**: Generate professional quotes for clients

## Technology Stack

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Google Maps API** - Geospatial mapping and geocoding
- **@vis.gl/react-google-maps** - React components for Google Maps
- **Tailwind CSS** - Utility-first CSS framework

## Prerequisites

- Node.js (v16 or higher)
- A Google Maps API key with the following APIs enabled:
  - Maps JavaScript API
  - Geocoding API
  - Places API (optional, for enhanced address search)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd roofing-quote-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Google Maps API Key

Create a `.env.local` file in the root directory:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**How to get a Google Maps API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
4. Go to "Credentials" and create an API key
5. Copy the API key to your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Usage Guide

### Step 1: Enter Address
- Enter the complete property address in the search field
- Click "Search Address" to locate the property

### Step 2: Trace Roof
- Click "Start Drawing" to begin tracing a roof section
- Click on the map to add points around the roof perimeter
- Click "Complete Facet" when finished with one section
- Repeat for additional roof sections if the roof has multiple facets
- Click "Generate Quote" when all sections are traced

### Step 3: Adjust Measurements
- Review the calculated total area
- Adjust the roof pitch (typical range: 4-8)
- Select the appropriate complexity level:
  - **Simple**: 1-2 sections, no valleys
  - **Moderate**: 3-4 sections, some valleys
  - **Complex**: 5+ sections, multiple valleys/dormers
- Click "Update Measurements"

### Step 4: Generate Quote
- Select the desired roofing material
- Review the detailed cost breakdown
- Click "Finalize Quote" to complete
- Print or share the quote with your client

## Pricing Configuration

The application uses the following pricing structure:

### Materials (per sq ft)
- 3-Tab Asphalt Shingles: $1.50
- Architectural Asphalt Shingles: $2.25
- Metal Roofing: $4.50
- Clay/Concrete Tile: $6.00

### Labor
- Base rate: $2.50/sq ft
- Pitch adjustment:
  - 6/12 - 7/12: +$0.50/sq ft
  - 8/12+: +$1.00/sq ft
- Complexity multiplier:
  - Simple: 1.0x
  - Moderate: 1.15x
  - Complex: 1.35x

### Additional Costs
- Permits: $500 flat fee
- Disposal: $100 per square (100 sq ft)
- Underlayment: $0.50/sq ft
- Flashing: $150 per roof section

*Note: These prices can be customized in `components/QuoteCalculator.tsx`*

## Customization

### Adjusting Pricing
Edit `components/QuoteCalculator.tsx` to modify:
- Material prices
- Labor rates
- Additional cost formulas

### Adding New Materials
Add new material options to the `MATERIAL_OPTIONS` array in `components/QuoteCalculator.tsx`

### Styling
The application uses Tailwind CSS. Modify component styles by changing className attributes.

## Project Structure

```
/
├── components/
│   ├── AddressSearch.tsx    # Address input and geocoding
│   ├── MapView.tsx          # Satellite map with drawing tools
│   ├── RoofMeasurement.tsx  # Measurement adjustment interface
│   └── QuoteCalculator.tsx  # Pricing and quote generation
├── App.tsx                  # Main application component
├── types.ts                 # TypeScript type definitions
├── index.tsx               # Application entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Troubleshooting

### Maps not loading
- Verify your API key is correct in `.env.local`
- Ensure billing is enabled on your Google Cloud project
- Check that the required APIs are enabled

### Inaccurate measurements
- Use the highest zoom level possible when tracing
- Trace as closely to the roof edge as possible
- For complex roofs, break into multiple facets

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure you're using Node.js v16 or higher

## Future Enhancements

- Save quotes to database
- Email/SMS quote delivery
- Historical quote tracking
- Advanced roof detection with AI
- 3D roof visualization
- Integration with CRM systems
- Mobile app version

## License

This project is a prototype for demonstration purposes.

## Support

For questions or issues, please contact your development team.

---

**Built with ❤️ for roofing contractors**
