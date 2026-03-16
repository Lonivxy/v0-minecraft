'use client';

import { SettingsProvider } from '@/lib/settings-context';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import ServerStatus from '@/components/server-status';
import FeaturesSection from '@/components/features-section';
import Footer from '@/components/footer';
import SettingsPanel from '@/components/settings-panel';

export default function Home() {
  return (
    <SettingsProvider>
      <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
        {/* Gradient background effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-1/3 -right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <HeroSection />
          <ServerStatus />
          <FeaturesSection />
          <Footer />
        </div>

        {/* Settings Panel */}
        <SettingsPanel />
      </main>
    </SettingsProvider>
  );
}
