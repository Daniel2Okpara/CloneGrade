import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

interface EditControlsProps {
  referenceImage: string;
  analysisData: {
    highlights: number;
    shadows: number;
    contrast: number;
    saturation: number;
    temperature: number;
    tint: number;
    vibrance: number;
    clarity: number;
  };
  onEditSelection: (selected: Set<string>) => void;
  onProceed: () => void;
}

const EditControls = ({
  referenceImage,
  analysisData,
  onEditSelection,
  onProceed,
}: EditControlsProps) => {
  const [selectedEdits, setSelectedEdits] = useState<Set<string>>(
    new Set()
  );

  const handleToggle = (key: string) => {
    const newSelected = new Set(selectedEdits);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedEdits(newSelected);
    onEditSelection(newSelected);
  };

  const handleSelectAll = () => {
    const allKeys = Object.keys(analysisData);
    setSelectedEdits(new Set(allKeys));
    onEditSelection(new Set(allKeys));
  };

  const handleDeselectAll = () => {
    setSelectedEdits(new Set());
    onEditSelection(new Set());
  };

  const handleProceed = () => {
    if (selectedEdits.size === 0) {
      toast.error("Please select at least one edit parameter");
      return;
    }
    onProceed();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4">Select Adjustments to Copy</h2>
        <p className="text-lg text-muted-foreground mb-4">
          Choose which color grading parameters to copy from the reference image
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="gap-2"
          >
            <Square className="w-4 h-4" />
            Deselect All
          </Button>
          <div className="text-sm font-medium text-primary">
            {selectedEdits.size} of {Object.keys(analysisData).length} selected
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Reference Image - Read Only */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Reference Image
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Original)
            </span>
          </h3>
          <div className="rounded-lg overflow-hidden bg-muted border border-border h-[600px]">
            <img
              src={referenceImage}
              alt="Reference image"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Select adjustments to transfer to your target images
          </p>
        </Card>

        {/* Edit Controls */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Detected Adjustments</h3>

          <div className="space-y-3">
            {Object.entries(analysisData).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedEdits.has(key)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
                onClick={() => handleToggle(key)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedEdits.has(key)}
                    onCheckedChange={() => handleToggle(key)}
                  />
                  <div>
                    <p className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className={`text-sm font-medium ${
                      selectedEdits.has(key) ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {value > 0 ? "+" : ""}{value}
                    </p>
                  </div>
                </div>
                
                {/* Visual indicator bar */}
                <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      selectedEdits.has(key) ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    style={{
                      width: `${Math.abs(value)}%`,
                      marginLeft: value < 0 ? `${50 - Math.abs(value / 2)}%` : "50%",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="hero"
          size="lg"
          onClick={handleProceed}
          className="min-w-[200px]"
        >
          Apply to Target Image
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default EditControls;
