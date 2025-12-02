import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Sliders, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Upload Reference",
      description: "Import any photo and let our AI analyze its unique color grading and style.",
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "Extract color curves, highlights, shadows, HSL patterns, and even fonts.",
    },
    {
      icon: Sliders,
      title: "Choose Edits",
      description: "Toggle which editing parameters to apply, with full control over intensity.",
    },
    {
      icon: Download,
      title: "Export & Save",
      description: "Download your edited image or save presets for future use.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroBg} 
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Photo Editing
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Clone Any Photo's Vibe
              <span className="block text-primary mt-2">Instantly</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Extract color grading, lighting, and style from any reference image. 
              Apply it to your photos with AI precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate("/editor")}
                className="min-w-[200px]"
              >
                Start Creating
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="min-w-[200px]"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to transform your photos with professional-grade color grading
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 relative"
        >
          <div className="max-w-3xl mx-auto text-center bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Transform Your Photos?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join photographers and creators who are already using CloneGrade to achieve stunning results.
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate("/editor")}
              className="min-w-[250px]"
            >
              Get Started Free
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
