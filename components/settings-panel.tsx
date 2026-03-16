'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, X, Globe, Palette } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t, primaryHue, setPrimaryHue } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Draw color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = (angle + 1) * Math.PI / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = `hsl(${angle}, 80%, 55%)`;
      ctx.fill();
    }

    // Draw inner circle (dark)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'oklch(0.15 0.02 250 / 0.9)';
    ctx.fill();

    // Draw current selection indicator
    const selectedAngle = (primaryHue - 90) * Math.PI / 180;
    const indicatorRadius = radius * 0.75;
    const indicatorX = centerX + Math.cos(selectedAngle) * indicatorRadius;
    const indicatorY = centerY + Math.sin(selectedAngle) * indicatorRadius;

    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner indicator with selected color
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 6, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${primaryHue}, 80%, 55%)`;
    ctx.fill();
  }, [primaryHue, isOpen]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left - canvas.width / 2;
    const y = clientY - rect.top - canvas.height / 2;

    const distance = Math.sqrt(x * x + y * y);
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

    // Only respond to clicks in the color ring area
    if (distance > radius * 0.5 && distance < radius) {
      let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;
      setPrimaryHue(Math.round(angle));
    }
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 glass-strong rounded-full border border-glass-border hover:border-primary/50 hover:bg-primary/20 transition-all duration-300 hover:scale-110 shadow-lg group"
        title={t.settings.language}
      >
        <Settings className="w-6 h-6 text-foreground group-hover:text-primary transition-colors group-hover:rotate-90 duration-500" />
      </button>

      {/* Settings Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative glass-strong rounded-2xl border border-glass-border p-6 w-full max-w-sm animate-scale-in shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-3">
                <Globe className="w-4 h-4" />
                {t.settings.language}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    language === 'zh'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass hover:bg-foreground/10 text-foreground'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass hover:bg-foreground/10 text-foreground'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-3">
                <Palette className="w-4 h-4" />
                {t.settings.themeColor}
              </label>
              <div className="flex flex-col items-center">
                <canvas
                  ref={canvasRef}
                  width={180}
                  height={180}
                  className="cursor-pointer rounded-full"
                  onClick={handleCanvasInteraction}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onMouseMove={(e) => isDragging && handleCanvasInteraction(e)}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  onTouchMove={(e) => isDragging && handleCanvasInteraction(e)}
                />
                {/* Color Preview */}
                <div className="mt-4 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg shadow-lg"
                    style={{ backgroundColor: `hsl(${primaryHue}, 80%, 55%)` }}
                  />
                  <span className="text-sm text-foreground/60 font-mono">
                    Hue: {primaryHue}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick color presets */}
            <div className="mt-4 flex justify-center gap-2">
              {[155, 180, 220, 280, 320, 30, 60].map((hue) => (
                <button
                  key={hue}
                  onClick={() => setPrimaryHue(hue)}
                  className={`w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 ${
                    primaryHue === hue ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''
                  }`}
                  style={{ backgroundColor: `hsl(${hue}, 80%, 55%)` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
