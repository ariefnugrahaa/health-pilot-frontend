"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/core/stores/auth.store";
import { DynamicWizard } from "@/components/intake/dynamic/DynamicWizard";
import { WelcomeScreen } from "@/components/intake/WelcomeScreen";
import { CustomerHome } from "./CustomerHome";
import { IntakeConfig } from "@/types/intake";
import { LandingPageSettings } from "@/types/landing-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { hasPendingIntake } from "@/lib/pending-intake";

interface HomeContentProps {
  intakeConfig: IntakeConfig | null;
  landingSettings: LandingPageSettings;
}

export function HomeContent({
  intakeConfig,
  landingSettings,
}: HomeContentProps) {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  // (auth state is persisted in localStorage)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for pending intake after login and auto-start wizard
  useEffect(() => {
    if (mounted && isAuthenticated && hasPendingIntake() && intakeConfig) {
      console.log("Found pending intake, auto-starting wizard...");
      setStarted(true);
    }
  }, [mounted, isAuthenticated, intakeConfig]);

  if (!mounted) {
    // Loading state while checking auth
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8 py-12">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-64 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user has started the intake, show the wizard
  if (started && intakeConfig) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <DynamicWizard
            initialConfig={intakeConfig}
            onBack={() => setStarted(false)}
          />
        </div>
      </div>
    );
  }

  // Show landing view based on auth state
  if (isAuthenticated) {
    return (
      <CustomerHome
        onStart={() => setStarted(true)}
        landingSettings={landingSettings.afterLogin}
      />
    );
  }

  // Not authenticated - show welcome screen with intake option
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <WelcomeScreen
          onStart={() => setStarted(true)}
          landingSettings={landingSettings.beforeLogin}
        />
      </div>
    </main>
  );
}
