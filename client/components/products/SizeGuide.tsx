'use client';

import { useState } from 'react';

interface SizeGuideProps {
  productType: string;
}

interface SizeChartData {
  headers: string[];
  sizes: {
    label: string;
    measurements: string[];
  }[];
}

interface SizeCharts {
  [key: string]: {
    inches: SizeChartData;
    cm: SizeChartData;
  };
}

const SizeGuide = ({ productType }: SizeGuideProps) => {
  const [activeTab, setActiveTab] = useState<'inches' | 'cm'>('inches');
  
  // Get the appropriate size chart based on product type
  const sizeChart = getSizeChartForProductType(productType, activeTab);
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Size Guide</h3>
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            className={`px-4 py-2 text-sm ${
              activeTab === 'inches' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('inches')}
          >
            Inches
          </button>
          <button
            className={`px-4 py-2 text-sm ${
              activeTab === 'cm' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('cm')}
          >
            Centimeters
          </button>
        </div>
      </div>
      
      {/* Size Chart Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Size</th>
              {sizeChart.headers.map((header: string, index: number) => (
                <th key={index} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeChart.sizes.map((size: { label: string; measurements: string[] }, rowIndex: number) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium border-b border-gray-200">{size.label}</td>
                {size.measurements.map((measurement: string, colIndex: number) => (
                  <td key={colIndex} className="px-4 py-3 border-b border-gray-200">
                    {measurement}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* How to Measure */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">How to Measure</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <RulerIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Chest / Bust</h5>
              <p className="text-sm text-gray-600">
                Measure around the fullest part of your chest, keeping the measuring tape horizontal.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <RulerIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Waist</h5>
              <p className="text-sm text-gray-600">
                Measure around your natural waistline, keeping the tape comfortably loose.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <RulerIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Hips</h5>
              <p className="text-sm text-gray-600">
                Measure around the fullest part of your hips, about 8" below your waistline.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <RulerIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Inseam</h5>
              <p className="text-sm text-gray-600">
                Measure from the crotch to the bottom of the leg along the inner seam.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Size Guide Notes */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold mb-2 flex items-center">
          <InfoIcon className="w-4 h-4 mr-2 text-primary-600" />
          Notes
        </h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Vintage sizing may differ from modern sizing. Please refer to measurements rather than size labels.</li>
          <li>• All items are measured flat and then doubled where appropriate.</li>
          <li>• Allow for a 0.5-1" margin of error in measurements due to the vintage nature of the items.</li>
          <li>• If you're between sizes, we recommend sizing up for a more comfortable fit.</li>
        </ul>
      </div>
    </div>
  );
};

export default SizeGuide;

// Icon components
const RulerIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4Z" />
    <path d="M16 4V20" />
    <path d="M12 4V20" />
    <path d="M8 4V20" />
    <path d="M4 8H8" />
    <path d="M4 12H8" />
    <path d="M4 16H8" />
    <path d="M12 8H16" />
    <path d="M12 12H16" />
    <path d="M12 16H16" />
  </svg>
);

const InfoIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

// Mock function to get size chart data based on product type
function getSizeChartForProductType(productType: string, unit: 'inches' | 'cm'): SizeChartData {
  // Default to clothing if product type is not recognized
  const type = ['jacket', 'shirt', 'dress', 'pants', 'skirt'].includes(productType.toLowerCase()) 
    ? productType.toLowerCase() 
    : 'clothing';
  
  const sizeCharts: SizeCharts = {
    jacket: {
      inches: {
        headers: ['Chest', 'Shoulder', 'Sleeve Length', 'Length'],
        sizes: [
          { label: 'XS', measurements: ['34-36"', '15"', '23"', '25"'] },
          { label: 'S', measurements: ['36-38"', '16"', '24"', '26"'] },
          { label: 'M', measurements: ['38-40"', '17"', '25"', '27"'] },
          { label: 'L', measurements: ['40-42"', '18"', '26"', '28"'] },
          { label: 'XL', measurements: ['42-44"', '19"', '27"', '29"'] },
          { label: 'XXL', measurements: ['44-46"', '20"', '28"', '30"'] }
        ]
      },
      cm: {
        headers: ['Chest', 'Shoulder', 'Sleeve Length', 'Length'],
        sizes: [
          { label: 'XS', measurements: ['86-91cm', '38cm', '58cm', '64cm'] },
          { label: 'S', measurements: ['91-97cm', '41cm', '61cm', '66cm'] },
          { label: 'M', measurements: ['97-102cm', '43cm', '64cm', '69cm'] },
          { label: 'L', measurements: ['102-107cm', '46cm', '66cm', '71cm'] },
          { label: 'XL', measurements: ['107-112cm', '48cm', '69cm', '74cm'] },
          { label: 'XXL', measurements: ['112-117cm', '51cm', '71cm', '76cm'] }
        ]
      }
    },
    shirt: {
      inches: {
        headers: ['Chest', 'Shoulder', 'Sleeve Length', 'Length'],
        sizes: [
          { label: 'XS', measurements: ['34-36"', '15"', '23"', '27"'] },
          { label: 'S', measurements: ['36-38"', '16"', '24"', '28"'] },
          { label: 'M', measurements: ['38-40"', '17"', '25"', '29"'] },
          { label: 'L', measurements: ['40-42"', '18"', '26"', '30"'] },
          { label: 'XL', measurements: ['42-44"', '19"', '27"', '31"'] },
          { label: 'XXL', measurements: ['44-46"', '20"', '28"', '32"'] }
        ]
      },
      cm: {
        headers: ['Chest', 'Shoulder', 'Sleeve Length', 'Length'],
        sizes: [
          { label: 'XS', measurements: ['86-91cm', '38cm', '58cm', '69cm'] },
          { label: 'S', measurements: ['91-97cm', '41cm', '61cm', '71cm'] },
          { label: 'M', measurements: ['97-102cm', '43cm', '64cm', '74cm'] },
          { label: 'L', measurements: ['102-107cm', '46cm', '66cm', '76cm'] },
          { label: 'XL', measurements: ['107-112cm', '48cm', '69cm', '79cm'] },
          { label: 'XXL', measurements: ['112-117cm', '51cm', '71cm', '81cm'] }
        ]
      }
    },
    pants: {
      inches: {
        headers: ['Waist', 'Hip', 'Inseam', 'Leg Opening'],
        sizes: [
          { label: '28', measurements: ['28"', '36"', '30"', '12"'] },
          { label: '30', measurements: ['30"', '38"', '30"', '12.5"'] },
          { label: '32', measurements: ['32"', '40"', '31"', '13"'] },
          { label: '34', measurements: ['34"', '42"', '31"', '13.5"'] },
          { label: '36', measurements: ['36"', '44"', '32"', '14"'] },
          { label: '38', measurements: ['38"', '46"', '32"', '14.5"'] }
        ]
      },
      cm: {
        headers: ['Waist', 'Hip', 'Inseam', 'Leg Opening'],
        sizes: [
          { label: '28', measurements: ['71cm', '91cm', '76cm', '30cm'] },
          { label: '30', measurements: ['76cm', '97cm', '76cm', '32cm'] },
          { label: '32', measurements: ['81cm', '102cm', '79cm', '33cm'] },
          { label: '34', measurements: ['86cm', '107cm', '79cm', '34cm'] },
          { label: '36', measurements: ['91cm', '112cm', '81cm', '36cm'] },
          { label: '38', measurements: ['97cm', '117cm', '81cm', '37cm'] }
        ]
      }
    },
    dress: {
      inches: {
        headers: ['Bust', 'Waist', 'Hip', 'Length'],
        sizes: [
          { label: 'XS', measurements: ['32-34"', '24-26"', '34-36"', '36"'] },
          { label: 'S', measurements: ['34-36"', '26-28"', '36-38"', '37"'] },
          { label: 'M', measurements: ['36-38"', '28-30"', '38-40"', '38"'] },
          { label: 'L', measurements: ['38-40"', '30-32"', '40-42"', '39"'] },
          { label: 'XL', measurements: ['40-42"', '32-34"', '42-44"', '40"'] },
          { label: 'XXL', measurements: ['42-44"', '34-36"', '44-46"', '41"'] }
        ]
      },
      cm: {
        headers: ['Bust', 'Waist', 'Hip', 'Length'],
        sizes: [
          { label: 'XS', measurements: ['81-86cm', '61-66cm', '86-91cm', '91cm'] },
          { label: 'S', measurements: ['86-91cm', '66-71cm', '91-97cm', '94cm'] },
          { label: 'M', measurements: ['91-97cm', '71-76cm', '97-102cm', '97cm'] },
          { label: 'L', measurements: ['97-102cm', '76-81cm', '102-107cm', '99cm'] },
          { label: 'XL', measurements: ['102-107cm', '81-86cm', '107-112cm', '102cm'] },
          { label: 'XXL', measurements: ['107-112cm', '86-91cm', '112-117cm', '104cm'] }
        ]
      }
    },
    skirt: {
      inches: {
        headers: ['Waist', 'Hip', 'Length'],
        sizes: [
          { label: 'XS', measurements: ['24-26"', '34-36"', '16"'] },
          { label: 'S', measurements: ['26-28"', '36-38"', '17"'] },
          { label: 'M', measurements: ['28-30"', '38-40"', '18"'] },
          { label: 'L', measurements: ['30-32"', '40-42"', '19"'] },
          { label: 'XL', measurements: ['32-34"', '42-44"', '20"'] },
          { label: 'XXL', measurements: ['34-36"', '44-46"', '21"'] }
        ]
      },
      cm: {
        headers: ['Waist', 'Hip', 'Length'],
        sizes: [
          { label: 'XS', measurements: ['61-66cm', '86-91cm', '41cm'] },
          { label: 'S', measurements: ['66-71cm', '91-97cm', '43cm'] },
          { label: 'M', measurements: ['71-76cm', '97-102cm', '46cm'] },
          { label: 'L', measurements: ['76-81cm', '102-107cm', '48cm'] },
          { label: 'XL', measurements: ['81-86cm', '107-112cm', '51cm'] },
          { label: 'XXL', measurements: ['86-91cm', '112-117cm', '53cm'] }
        ]
      }
    },
    clothing: {
      inches: {
        headers: ['Chest/Bust', 'Waist', 'Hip'],
        sizes: [
          { label: 'XS', measurements: ['32-34"', '24-26"', '34-36"'] },
          { label: 'S', measurements: ['34-36"', '26-28"', '36-38"'] },
          { label: 'M', measurements: ['36-38"', '28-30"', '38-40"'] },
          { label: 'L', measurements: ['38-40"', '30-32"', '40-42"'] },
          { label: 'XL', measurements: ['40-42"', '32-34"', '42-44"'] },
          { label: 'XXL', measurements: ['42-44"', '34-36"', '44-46"'] }
        ]
      },
      cm: {
        headers: ['Chest/Bust', 'Waist', 'Hip'],
        sizes: [
          { label: 'XS', measurements: ['81-86cm', '61-66cm', '86-91cm'] },
          { label: 'S', measurements: ['86-91cm', '66-71cm', '91-97cm'] },
          { label: 'M', measurements: ['91-97cm', '71-76cm', '97-102cm'] },
          { label: 'L', measurements: ['97-102cm', '76-81cm', '102-107cm'] },
          { label: 'XL', measurements: ['102-107cm', '81-86cm', '107-112cm'] },
          { label: 'XXL', measurements: ['107-112cm', '86-91cm', '112-117cm'] }
        ]
      }
    }
  };
  
  return sizeCharts[type][unit];
} 