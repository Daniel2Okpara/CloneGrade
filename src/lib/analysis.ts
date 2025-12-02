export interface ImageStats {
    dominantColors: string[];
    brightness: number;
    contrast: number;
    saturation: number;
}

export async function analyzeImage(imageUrl: string): Promise<ImageStats> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            // Resize for performance (analyze a smaller version)
            const MAX_SIZE = 256;
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            // Basic stats
            let totalBrightness = 0;
            let totalSaturation = 0;
            const colorCounts: { [key: string]: number } = {};

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Brightness (Luma)
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                totalBrightness += brightness;

                // Saturation (HSL)
                const max = Math.max(r, g, b) / 255;
                const min = Math.min(r, g, b) / 255;
                const l = (max + min) / 2;
                let s = 0;
                if (max !== min) {
                    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
                }
                totalSaturation += s;

                // Color quantization (very simple for now: round to nearest 32)
                const qR = Math.round(r / 32) * 32;
                const qG = Math.round(g / 32) * 32;
                const qB = Math.round(b / 32) * 32;
                const key = `${qR},${qG},${qB}`;
                colorCounts[key] = (colorCounts[key] || 0) + 1;
            }

            const pixelCount = width * height;
            const avgBrightness = (totalBrightness / pixelCount) / 255; // 0-1
            const avgSaturation = totalSaturation / pixelCount; // 0-1

            // Contrast (Standard Deviation of brightness)
            let sumSqDiff = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                sumSqDiff += Math.pow(brightness - avgBrightness, 2);
            }
            const contrast = Math.sqrt(sumSqDiff / pixelCount); // 0-0.5 approx

            // Sort colors
            const sortedColors = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([key]) => {
                    const [r, g, b] = key.split(',');
                    return `rgb(${r}, ${g}, ${b})`;
                });

            resolve({
                dominantColors: sortedColors,
                brightness: Math.round(avgBrightness * 100),
                contrast: Math.round(contrast * 200), // Scale up for readability
                saturation: Math.round(avgSaturation * 100)
            });
        };

        img.onerror = (err) => reject(err);
    });
}
