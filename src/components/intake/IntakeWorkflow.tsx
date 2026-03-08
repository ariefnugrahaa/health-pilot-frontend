"use client";

import { useState } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { DynamicWizard } from "./dynamic/DynamicWizard";
import { IntakeConfig } from "@/types/intake";
import { defaultLandingPageSettings } from "@/types/landing-settings";

interface IntakeWorkflowProps {
  initialConfig: IntakeConfig | null;
}

export function IntakeWorkflow({ initialConfig }: IntakeWorkflowProps) {
  const [started, setStarted] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {!started ? (
        <WelcomeScreen
          onStart={() => setStarted(true)}
          landingSettings={defaultLandingPageSettings.beforeLogin}
        />
      ) : (
        <DynamicWizard initialConfig={initialConfig} />
      )}
    </div>
  );
}
