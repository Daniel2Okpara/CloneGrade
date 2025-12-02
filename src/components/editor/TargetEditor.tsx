import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface AnalysisData {
  highlights: number;
  shadows: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  vibrance: number;
  clarity: number;
}

interface TargetEditorProps {
  analysisData: AnalysisData;
  selectedEdits: Set<string>;
}

const TargetEditor = ({ analysisData, selectedEdits }: TargetEditorProps) => {
  const [targetImages, setTargetImages] = useState<string[]>([]);
  const [intensity, setIntensity] = useState([100]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Individual adjustment values (initialized from analysisData)
  const [adjustments, setAdjustments] = useState<AnalysisData>({
    highlights: analysisData.highlights || 0,
    shadows: analysisData.shadows || 0,
    contrast: analysisData.contrast || 0,
    saturation: analysisData.saturation || 0,
    temperature: analysisData.temperature || 0,
    tint: analysisData.tint || 0,
    vibrance: analysisData.vibrance || 0,
    clarity: analysisData.clarity || 0,
  });

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readers = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((images) => {
        setTargetImages((prev) => [...prev, ...images]);
        toast.success(`${files.length} image(s) loaded`);
      });
    }
  }, []);

  const handleAdjustmentChange = (key: keyof AnalysisData, value: number[]) => {
    setAdjustments(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleResetAdjustment = (key: keyof AnalysisData) => {
    setAdjustments(prev => ({ ...prev, [key]: analysisData[key] || 0 }));
  };

  const handleResetAll = () => {
    setAdjustments({
      highlights: analysisData.highlights || 0,
      shadows: analysisData.shadows || 0,
      contrast: analysisData.contrast || 0,
      saturation: analysisData.saturation || 0,
      temperature: analysisData.temperature || 0,
      tint: analysisData.tint || 0,
      vibrance: analysisData.vibrance || 0,
      clarity: analysisData.clarity || 0,
    });
    setIntensity([100]);
    toast.info("All adjustments reset to reference values");
  };

  const applyFilters = () => {
    return `
      contrast(${100 + adjustments.contrast * (intensity[0] / 100)}%)
      saturate(${100 + adjustments.saturation * (intensity[0] / 100)}%)
      brightness(${100 + adjustments.highlights * (intensity[0] / 200)}%)
      hue-rotate(${adjustments.temperature * (intensity[0] / 100) * 0.5}deg)
    `;
  };

  const handleExport = async () => {
    if (targetImages.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      for (let i = 0; i < targetImages.length; i++) {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error("Export failed"));
              return;
            }
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.filter = applyFilters();
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error("Export failed"));
                return;
              }
              
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `clonegrade-${i + 1}-${Date.now()}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              
              resolve();
            }, 'image/png');
          };
          
          img.onerror = () => {
            reject(new Error("Failed to load image for export"));
          };
          
          img.src = targetImages[i];
        });
      }
      
      toast.success(`${targetImages.length} image(s) exported successfully!`);
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPreset = (format: 'xmp' | 'dng' | 'cube') => {
    let presetContent = '';
    const timestamp = Date.now();
    
    if (format === 'xmp') {
      presetContent = `<?xml version="1.0" encoding="UTF-8"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description
      crs:Highlights2012="${adjustments.highlights}"
      crs:Shadows2012="${adjustments.shadows}"
      crs:Contrast2012="${adjustments.contrast}"
      crs:Saturation="${adjustments.saturation}"
      crs:Temperature="${adjustments.temperature}"
      crs:Tint="${adjustments.tint}"
      crs:Vibrance="${adjustments.vibrance}"
      crs:Clarity2012="${adjustments.clarity}"/>
  </rdf:RDF>
</x:xmpmeta>`;
    } else if (format === 'cube') {
      presetContent = `# CloneGrade LUT Export
TITLE "CloneGrade_${timestamp}"
LUT_3D_SIZE 33

# Generated adjustments:
# Contrast: ${adjustments.contrast}
# Saturation: ${adjustments.saturation}
# Highlights: ${adjustments.highlights}

0.0 0.0 0.0
1.0 1.0 1.0`;
    }
    
    const blob = new Blob([presetContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clonegrade-preset-${timestamp}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Preset exported as .${format.toUpperCase()}`);
  };


  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4">Apply & Export</h2>
        <p className="text-lg text-muted-foreground">
          Upload your target image and adjust the intensity of the applied edits
        </p>
      </motion.div>

      <div className="mb-8">
        {/* Target Images Upload */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Target Images {targetImages.length > 0 && `(${targetImages.length})`}
            </h3>
            <label>
              <input
                type="file"
                accept="image/*,.cr2,.cr3,.nef,.nrw,.arw,.srf,.sr2,.orf,.raf,.dng,.rw2,.pef,.ptx"
                onChange={handleImageUpload}
                multiple
                className="hidden"
              />
              <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Add Images
                </span>
              </Button>
            </label>
          </div>
          
          {targetImages.length === 0 ? (
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*,.cr2,.cr3,.nef,.nrw,.arw,.srf,.sr2,.orf,.raf,.dng,.rw2,.pef,.ptx"
                onChange={handleImageUpload}
                multiple
                className="hidden"
              />
              <div className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors bg-muted/30 flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Click to upload target images (batch supported)</p>
                <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, RAW formats (up to 100MB each)</p>
              </div>
            </label>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {targetImages.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                    <img
                      src={img}
                      alt={`Target ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Live Previews Grid */}
        {targetImages.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Live Previews</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {targetImages.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-black border border-border">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{ filter: applyFilters() }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Individual Adjustment Controls */}
      {targetImages.length > 0 && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Individual Adjustments</h3>
            <Button variant="ghost" size="sm" onClick={handleResetAll}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
          
          <div className="space-y-6">
            {(Object.entries(adjustments) as [keyof AnalysisData, number][])
              .filter(([key]) => selectedEdits.has(key))
              .map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-16 text-right">
                      {value > 0 ? "+" : ""}{value}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleResetAdjustment(key)}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-12">-100</span>
                  <Slider
                    value={[value]}
                    onValueChange={(val) => handleAdjustmentChange(key, val)}
                    min={-100}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">+100</span>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Overall Intensity</label>
                <span className="text-sm font-medium">{intensity[0]}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-12">0%</span>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  min={0}
                  max={200}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-12 text-right">200%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Intensity multiplier affects all adjustments proportionally
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Export Actions */}
      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Export Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Export Images</h4>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={targetImages.length === 0 || isProcessing}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isProcessing ? "Exporting..." : "Download Individual Images"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={targetImages.length === 0 || isProcessing}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as ZIP (Coming Soon)
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Export Presets</h4>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExportPreset('xmp')}
                  disabled={selectedEdits.size === 0}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as .XMP (Lightroom/Photoshop)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportPreset('cube')}
                  disabled={selectedEdits.size === 0}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as .CUBE (LUT for Premiere/Final Cut)
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setTargetImages([])}
            disabled={targetImages.length === 0}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Clear All Images
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TargetEditor;
