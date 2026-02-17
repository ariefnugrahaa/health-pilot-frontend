import { IntakeWorkflow } from "@/components/intake/IntakeWorkflow";
import { getIntakeConfig } from "@/lib/intake";

export default async function IntakePage() {
    // Fetch intake config on the server
    const intakeConfig = await getIntakeConfig();

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4">
            <div className="container mx-auto">
                <IntakeWorkflow initialConfig={intakeConfig} />
            </div>
        </div>
    );
}
