'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ImageUploader from "@/components/ImageUploader";
import EditDNAPanel from "@/components/EditDNAPanel";
import { analyzeImage, ImageStats } from "@/lib/analysis";

export default function Home() {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = async (file: File) => {
    const url = URL.createObjectURL(file);
    setReferenceImage(url);
    setIsAnalyzing(true);

    try {
      const result = await analyzeImage(url);
      setStats(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Header />

      <main style={{
        paddingTop: '64px',
        paddingRight: '320px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          {/* Main Workspace */}
          <div style={{
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Reference Image</h2>

              {referenceImage ? (
                <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={referenceImage} alt="Reference" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', background: 'black' }} />
                  {isAnalyzing && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 600
                    }}>
                      Analyzing...
                    </div>
                  )}
                </div>
              ) : (
                <ImageUploader
                  onUpload={handleUpload}
                  label="Upload Reference Image"
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Sidebar>
        <EditDNAPanel stats={stats} />
      </Sidebar>
    </div>
  );
}
