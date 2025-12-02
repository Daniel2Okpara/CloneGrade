import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReferenceUpload from "@/components/editor/ReferenceUpload";
import EditControls from "@/components/editor/EditControls";
import TargetEditor from "@/components/editor/TargetEditor";

type EditorStep = "upload" | "controls" | "apply";

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

const Editor = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<EditorStep>("upload");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [selectedEdits, setSelectedEdits] = useState<Set<string>>(new Set());

  const steps = [
    { id: "upload", label: "Upload Reference", icon: Upload },
    { id: "controls", label: "Select Edits", icon: Sparkles },
    { id: "apply", label: "Apply & Export", icon: Check },
  ];

  const handleReferenceUpload = (imageUrl: string) => {
    setReferenceImage(imageUrl);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisData({
        highlights: 65,
        shadows: -45,
        contrast: 30,
        saturation: 25,
        temperature: 15,
        tint: -5,
        vibrance: 40,
        clarity: 20,
      });
      setCurrentStep("controls");
    }, 2000);
  };

  const handleEditSelection = (selected: Set<string>) => {
    setSelectedEdits(selected);
  };

  const handleProceedToApply = () => {
    setCurrentStep("apply");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">CloneGrade Editor</h1>
            </div>

            {/* Step Indicator */}
            <div className="hidden md:flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : steps.findIndex(s => s.id === currentStep) > index
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-border mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReferenceUpload onUpload={handleReferenceUpload} />
            </motion.div>
          )}

          {currentStep === "controls" && analysisData && (
            <motion.div
              key="controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EditControls
                referenceImage={referenceImage!}
                analysisData={analysisData}
                onEditSelection={handleEditSelection}
                onProceed={handleProceedToApply}
              />
            </motion.div>
          )}

          {currentStep === "apply" && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TargetEditor
                analysisData={analysisData!}
                selectedEdits={selectedEdits}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Editor;
