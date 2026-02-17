import { IntakeWorkflow } from "@/components/intake/IntakeWorkflow";
import { getIntakeConfig } from "@/lib/intake";

export default async function Home() {
  // Fetch intake config on the server
  const intakeConfig = await getIntakeConfig();

  return (
    <main className="min-h-screen bg-white">
      <IntakeWorkflow initialConfig={intakeConfig} />
    </main>
  );
}
