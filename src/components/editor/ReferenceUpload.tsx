import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ReferenceUploadProps {
  onUpload: (imageUrl: string) => void;
}

const ReferenceUpload = ({ onUpload }: ReferenceUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    } else {
      toast.error("Please upload an image file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    setIsAnalyzing(true);
    const reader = new FileReader();
    
    const isRAW = /\.(cr2|cr3|nef|nrw|arw|srf|sr2|orf|raf|dng|rw2|pef|ptx)$/i.test(file.name);
    
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (isRAW) {
        toast.success("Processing RAW image...");
      } else {
        toast.success("Analyzing reference image...");
      }
      onUpload(imageUrl);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4">Upload Reference Image</h2>
        <p className="text-lg text-muted-foreground">
          Choose a photo whose style and color grading you want to replicate
        </p>
      </motion.div>

      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center">
          {isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <p className="text-lg text-muted-foreground">
                Analyzing color grading and style...
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {isDragging ? (
                    <Upload className="w-10 h-10 text-primary" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-primary" />
                  )}
                </div>
              </motion.div>

              <h3 className="text-xl font-semibold mb-2">
                {isDragging ? "Drop your image here" : "Drag & drop your reference image"}
              </h3>
              <p className="text-muted-foreground mb-6">
                or click to browse from your computer
              </p>

              <label>
                <input
                  type="file"
                  accept="image/*,.cr2,.cr3,.nef,.nrw,.arw,.srf,.sr2,.orf,.raf,.dng,.rw2,.pef,.ptx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="hero" size="lg" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Image
                  </span>
                </Button>
              </label>

              <p className="text-sm text-muted-foreground mt-6">
                Supported formats: JPG, PNG, WebP, RAW (CR2, NEF, ARW, DNG, etc.) • Max 100MB
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReferenceUpload;
