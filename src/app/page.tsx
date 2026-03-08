import { HomeContent } from "@/components/home";
import { getIntakeConfig } from "@/lib/intake";
import { getLandingSettings } from "@/lib/landing-settings";

export default async function Home() {
  const [intakeConfig, landingSettings] = await Promise.all([
    getIntakeConfig(),
    getLandingSettings(),
  ]);

  return (
    <HomeContent
      intakeConfig={intakeConfig}
      landingSettings={landingSettings}
    />
  );
}
