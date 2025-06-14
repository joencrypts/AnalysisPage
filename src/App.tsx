import React, { useState, useCallback } from 'react';
import { Upload, FileImage, Download, ExternalLink, Building, Grid as Bridge, Loader as Road, Hammer, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  scenario?: string;
}

interface ScenarioData {
  id: string;
  name: string;
  icon: React.ReactNode;
  originalImage: string;
  recreatedImage: string;
  description: string;
  costEstimation: {
    title: string;
    breakdown: Array<{ item: string; cost: string }>;
    total: string;
  };
}

const scenarios: ScenarioData[] = [
  {
    id: 'building',
    name: 'Damaged Building',
    icon: <Building className="w-5 h-5" />,
    originalImage: '/public/old-area-building-broken-down-for-new-construction-in-shanghai-china-KTCFWJ.jpg',
    recreatedImage: '/public/182befd6-b011-486f-bb39-cc096cba9357.png',
    description: 'A dilapidated and partially collapsed multi-storey building, likely located in an older urban area undergoing redevelopment. The structure is a concrete and brick construction, exhibiting significant signs of neglect, decay, and structural damage. The exterior walls are crumbling, exposing brickwork, and large patches of plaster have peeled away. The ground floor is heavily damaged, with a partially destroyed entrance area and visible debris. Several windows are broken or missing entirely, and iron balcony railings are damaged or missing. The balconies and overhanging slabs are cracked and corroded, with some parts visibly sagging. The roof on the top right corner is partially collapsed, with internal structural elements visible. Inside, the building appears vacant and stripped, with no doors or fittings remaining.',
    costEstimation: {
      title: 'Estimated Repair Cost',
      breakdown: [
        { item: 'Structural Repairs (RCC slab/balcony reinforcement, columns, beams)', cost: '₹5,00,000 – ₹6,00,000' },
        { item: 'Wall Rebuilding (Brickwork, replastering)', cost: '₹3,00,000 – ₹3,50,000' },
        { item: 'Roof Repairs (Replacement, sealing, structural support)', cost: '₹2,00,000 – ₹2,50,000' },
        { item: 'Flooring (Debris removal, new flooring)', cost: '₹1,50,000 – ₹2,00,000' },
        { item: 'Doors & Windows (New fittings, frames, grills)', cost: '₹2,00,000 – ₹2,50,000' },
        { item: 'Plumbing & Sanitation (Re-piping, drainage)', cost: '₹1,00,000 – ₹1,50,000' },
        { item: 'Electrical Wiring (New wiring, fixtures, safety systems)', cost: '₹1,00,000 – ₹1,20,000' },
        { item: 'Exterior & Interior Painting', cost: '₹1,00,000 – ₹1,20,000' },
        { item: 'Debris Removal & Cleaning', cost: '₹50,000 – ₹70,000' },
        { item: 'Contingency (10%)', cost: '₹2,00,000 – ₹2,30,000' }
      ],
      total: '₹22,00,000 – ₹26,00,000'
    }
  },
  {
    id: 'flyover',
    name: 'Damaged Flyover',
    icon: <Bridge className="w-5 h-5" />,
    originalImage: '/public/IMG-20250411-WA0033.jpg',
    recreatedImage: '/public/68fd1bd6-80aa-4b2a-937e-d9802458509b.png',
    description: 'The primary focus is an elevated concrete structure supported by large cylindrical piers/pillars extending into the distance. The pier cap at the forefront is incomplete, with exposed mechanical assembly parts, suggesting active work. The structure uses precast segments with visible joint lines. Temporary metal scaffolding and safety railings are fixed on top. Below the structure, concrete barricades marked with safety signs are in place, with heavy construction materials and equipment visible. The road adjacent to the site is partially open to traffic. The scene illustrates the juxtaposition of urban development and ongoing infrastructure expansion, reflecting the growing need for improved public transportation or vehicular flow management.',
    costEstimation: {
      title: 'Estimated Repair Cost',
      breakdown: [
        { item: 'Structural Repairs (Beams, columns, slabs, cracks)', cost: '₹4,50,000 – ₹5,50,000' },
        { item: 'Wall Reconstruction (Brickwork, plastering)', cost: '₹3,00,000 – ₹3,50,000' },
        { item: 'Roof and Balcony Repairs', cost: '₹2,00,000 – ₹2,50,000' },
        { item: 'Plastering & Waterproofing', cost: '₹1,50,000 – ₹2,00,000' },
        { item: 'Flooring (Rubble removal, new flooring)', cost: '₹1,50,000 – ₹2,00,000' },
        { item: 'Doors & Windows (New frames, grills)', cost: '₹1,20,000 – ₹1,50,000' },
        { item: 'Plumbing & Drainage', cost: '₹1,00,000 – ₹1,20,000' },
        { item: 'Electrical Work (Wiring, safety systems)', cost: '₹90,000 – ₹1,10,000' },
        { item: 'Painting & Finishing', cost: '₹1,00,000 – ₹1,20,000' },
        { item: 'Debris Removal & Cleanup', cost: '₹40,000 – ₹60,000' },
        { item: 'Contingency (10%)', cost: '₹2,00,000 – ₹2,30,000' }
      ],
      total: '₹21,00,000 – ₹26,00,000'
    }
  },
  {
    id: 'road',
    name: 'Damaged Road',
    icon: <Road className="w-5 h-5" />,
    originalImage: '/public/1829697-road.jpg',
    recreatedImage: '/public/2367656d-3ec3-43cc-a0e6-a880b89fee4a.png',
    description: 'A badly damaged stretch of a major urban roadway, riddled with numerous deep potholes filled with water due to poor drainage and recent rain. This multi-lane asphalt road appears to be a busy highway with clear lane markings and a divider. The potholes are large and irregular, spanning across multiple lanes and creating serious hazards. Pooled water in these craters hides their depth, increasing accident risks. The road surface shows signs of neglect, with parts of the asphalt eroded. Poor drainage has caused water accumulation near barriers, suggesting inadequate stormwater management. The scene shows traffic flowing cautiously despite unsafe conditions.',
    costEstimation: {
      title: 'Estimated Repair Cost (for 300-500 sq.m. stretch)',
      breakdown: [
        { item: 'Pothole Cutting & Cleaning', cost: '₹20,000 – ₹30,000' },
        { item: 'Bitumen Cold Patch Mix (20-30 tons)', cost: '₹1,20,000 – ₹1,80,000' },
        { item: 'Road Resurfacing (Asphalt)', cost: '₹1,00,000 – ₹1,50,000' },
        { item: 'Drainage Fix / Water Outlet', cost: '₹30,000 – ₹50,000' },
        { item: 'Compaction & Rolling', cost: '₹30,000 – ₹40,000' },
        { item: 'Marking & Painting', cost: '₹20,000 – ₹30,000' },
        { item: 'Traffic Management & Signage', cost: '₹15,000 – ₹20,000' },
        { item: 'Labor Charges (5-7 days)', cost: '₹40,000 – ₹60,000' },
        { item: 'Contingency (10%)', cost: '₹35,000 – ₹50,000' }
      ],
      total: '₹3,50,000 – ₹5,00,000'
    }
  },
  {
    id: 'wall',
    name: 'Damaged Wall',
    icon: <Hammer className="w-5 h-5" />,
    originalImage: '/public/576276591M-1741586970695.jpg',
    recreatedImage: '/public/f95ea189-7c38-4a2f-bccd-33ac2c602a7b.png',
    description: 'The wall shows exposed and unevenly aligned bricks with deteriorating mortar joints. Only part of the wall has been plastered, particularly the middle section, while other areas have raw cement patches. The top of the wall appears uneven, with protruding bricks suggesting rushed construction. The wall is surrounded by a yellow-painted structure with black grills on the left, and muddy ground with trees on the right. The adjacent road is tarred with a concrete curb, though scattered with debris. The entire structure shows signs of neglect and poor craftsmanship, lacking proper finishing touches and weatherproofing.',
    costEstimation: {
      title: 'Estimated Repair Cost (for 20-25 feet long, 6-7 feet high wall)',
      breakdown: [
        { item: 'Surface Cleaning & Preparation', cost: '₹2,000 – ₹3,000' },
        { item: 'Cement Plastering (2 coats)', cost: '₹10,000 – ₹13,000' },
        { item: 'Repointing / Brick Refilling', cost: '₹2,500 – ₹4,000' },
        { item: 'Top Coping / Waterproofing', cost: '₹2,500 – ₹3,500' },
        { item: 'Primer + Weatherproof Paint', cost: '₹7,000 – ₹9,000' },
        { item: 'Debris Removal & Cleaning', cost: '₹1,000 – ₹1,500' },
        { item: 'Labor Charges (2-3 days)', cost: '₹3,000 – ₹4,000' }
      ],
      total: '₹28,000 – ₹40,000'
    }
  },
  {
    id: 'building2',
    name: 'Damaged Building (Commercial)',
    icon: <Building className="w-5 h-5" />,
    originalImage: '/public/earthquake-damage_0.jpg',
    recreatedImage: '/public/41fe7140-410d-48ea-94ad-87d92080159e.png',
    description: 'A severely damaged two-story building, likely impacted by a powerful earthquake or structural collapse. The front façade has completely caved in, exposing the interior of both floors. Furniture and household items are dislodged and visible, indicating a residential or mixed-use structure. Large portions of the exterior walls have crumbled, with bricks and concrete scattered across the ground. Window frames are either detached or hanging loosely, and support beams are snapped or dangerously tilted. The roof remains mostly intact but is precariously slanted. Electrical wiring and construction debris dangle from the ceiling and broken walls, presenting significant safety hazards. The scene conveys abrupt destruction with no visible rescue activity.',
    costEstimation: {
      title: 'Estimated Repair Cost',
      breakdown: [
        { item: 'Debris Removal & Demolition', cost: '₹80,000 – ₹1,20,000' },
        { item: 'Structural Assessment & Engineering', cost: '₹50,000 – ₹75,000' },
        { item: 'Foundation & Frame Reinforcement', cost: '₹3,50,000 – ₹5,00,000' },
        { item: 'Rebuilding Walls (Outer + Internal)', cost: '₹4,00,000 – ₹5,50,000' },
        { item: 'Roof and Slab Repair/Recasting', cost: '₹3,00,000 – ₹4,00,000' },
        { item: 'Plastering (internal & external)', cost: '₹1,50,000 – ₹2,00,000' },
        { item: 'Windows & Doors Replacement', cost: '₹1,20,000 – ₹1,80,000' },
        { item: 'Electrical & Plumbing Works', cost: '₹1,00,000 – ₹1,50,000' },
        { item: 'Painting (Interior + Exterior)', cost: '₹1,00,000 – ₹1,40,000' },
        { item: 'Finishing (Flooring, tiles, grills)', cost: '₹1,00,000 – ₹1,50,000' }
      ],
      total: '₹18,00,000 – ₹25,00,000'
    }
  }
];

function App() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const url = URL.createObjectURL(file);
        setUploadedImages(prev => [...prev, { id, file, url, scenario: undefined }]);
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const assignScenario = (imageId: string, scenarioId: string) => {
    setUploadedImages(prev => 
      prev.map(img => img.id === imageId ? { ...img, scenario: scenarioId } : img)
    );
    
    if (!selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(prev => [...prev, scenarioId]);
    }
  };

  const getSelectedScenarioData = () => {
    return selectedScenarios.map(scenarioId => 
      scenarios.find(s => s.id === scenarioId)
    ).filter(Boolean);
  };

  const analyzeImageName = (fileName: string): string | undefined => {
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerFileName.includes('building') && lowerFileName.includes('broken')) {
      return 'building';
    }
    if (lowerFileName.includes('flyover') || lowerFileName.includes('wa0033')) {
      return 'flyover';
    }
    if (lowerFileName.includes('road')) {
      return 'road';
    }
    if (lowerFileName.includes('wall') || lowerFileName.includes('576276591m')) {
      return 'wall';
    }
    if (lowerFileName.includes('earthquake') || lowerFileName.includes('damage_0')) {
      return 'building2';
    }
    return undefined;
  };

  const generateAssessment = () => {
    setIsGenerating(true);
    
    // Analyze each image and assign scenarios
    const updatedImages = uploadedImages.map(image => {
      const scenarioId = analyzeImageName(image.file.name);
      return { ...image, scenario: scenarioId };
    });

    // Update images with assigned scenarios
    setUploadedImages(updatedImages);
    
    // Update selected scenarios
    const newSelectedScenarios = [...new Set(updatedImages
      .map(img => img.scenario)
      .filter((scenario): scenario is string => scenario !== undefined))];
    
    setSelectedScenarios(newSelectedScenarios);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 transition-all duration-300 ease-in-out hover:shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-center">
            <img 
              src="/public/logo.png" 
              alt="Infrastructure Assessment Tool Logo" 
              className="h-8 sm:h-10 md:h-12 w-auto transform transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 ease-in-out hover:shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 animate-pulse" />
            Upload Infrastructure Images
          </h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <FileImage className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-400 mx-auto mb-3 sm:mb-4 transition-transform duration-300 hover:scale-110" />
            <p className="text-base sm:text-lg font-medium text-slate-700 mb-2 transition-colors duration-300">
              Drop images here or click to upload
            </p>
            <p className="text-sm sm:text-base text-slate-500 mb-3 sm:mb-4">
              Support for JPG, PNG, and other image formats
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-md cursor-pointer active:scale-95"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Choose Files
            </label>
          </div>
        </div>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 ease-in-out hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                Uploaded Images
              </h2>
              <button
                onClick={generateAssessment}
                disabled={isGenerating}
                className={`inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto transform hover:scale-105 active:scale-95 ${
                  isGenerating
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                } text-white text-sm sm:text-base`}
              >
                {isGenerating ? (
                  <>
                    <Road className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Hammer className="w-3 h-3 sm:w-4 sm:h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Generate Review
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {uploadedImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="relative group transition-all duration-300 transform hover:scale-[1.02] animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 transition-all duration-300 group-hover:shadow-md">
                    <img
                      src={image.url}
                      alt="Uploaded"
                      className="w-full h-full object-contain bg-slate-50 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {image.scenario && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs sm:text-sm rounded-b-lg transition-all duration-300 transform translate-y-0 group-hover:translate-y-[-4px]">
                      {scenarios.find(s => s.id === image.scenario)?.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assessment Results */}
        {selectedScenarios.length > 0 && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-6 sm:mb-8">
            {getSelectedScenarioData().map((scenario, index) => (
              <div 
                key={scenario!.id} 
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-slideUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 hover:from-blue-700 hover:to-blue-800">
                  <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                    <span className="transition-transform duration-300 group-hover:rotate-12">{scenario!.icon}</span>
                    <span className="ml-2">{scenario!.name} Assessment</span>
                  </h3>
                </div>
                
                <div className="p-4 sm:p-6">
                  {/* Image Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 transition-all duration-300 hover:shadow-md">
                      <h4 className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs sm:text-sm transition-all duration-300">Original Image</h4>
                      <img
                        src={scenario!.originalImage}
                        alt="Original"
                        className="w-full h-full object-contain bg-slate-50 transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 transition-all duration-300 hover:shadow-md">
                      <h4 className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs sm:text-sm transition-all duration-300">Review Image</h4>
                      <img
                        src={scenario!.recreatedImage}
                        alt="Reference"
                        className="w-full h-full object-contain bg-slate-50 transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4 sm:mb-6 transition-all duration-300">
                    <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 sm:mb-3">Assessment Description</h4>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{scenario!.description}</p>
                  </div>

                  {/* Cost Estimation */}
                  <div className="bg-slate-50 rounded-lg p-4 sm:p-6 transition-all duration-300 hover:bg-slate-100">
                    <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center">
                      <div className="bg-orange-100 p-1 rounded mr-2 transition-transform duration-300 hover:rotate-12">
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                      </div>
                      {scenario!.costEstimation.title}
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {scenario!.costEstimation.breakdown.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-slate-200 last:border-b-0 gap-1 sm:gap-0 transition-all duration-300 hover:bg-white hover:px-2 hover:rounded"
                        >
                          <span className="text-sm sm:text-base text-slate-700">{item.item}</span>
                          <span className="font-semibold text-sm sm:text-base text-slate-900">{item.cost}</span>
                        </div>
                      ))}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t-2 border-slate-300 gap-1 sm:gap-0 transition-all duration-300">
                        <span className="text-base sm:text-lg font-semibold text-slate-900">Total Estimated Cost</span>
                        <span className="text-lg sm:text-xl font-bold text-orange-600 transition-transform duration-300 hover:scale-105">{scenario!.costEstimation.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Section */}
        {uploadedImages.length > 0 && selectedScenarios.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 transition-all duration-300 hover:shadow-md animate-fadeIn">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Submit Assessment</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                Review and submit your assessment for further processing
              </p>
              <a
                href="https://example.com/submit-assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 hover:bg-green-700 hover:scale-105 hover:shadow-md active:scale-95 w-full sm:w-auto"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Submit Assessment
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 group-hover:rotate-12" />
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;