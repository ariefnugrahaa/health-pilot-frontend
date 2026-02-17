"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
    data: any;
}

export function Step5HealthSummary({ data }: StepProps) {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-primary tracking-tight">Your Health Summary</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Based on the information you provided, here's an overview of patterns we noticed.
                </p>
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-primary">Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                    Based on the information you provided, your overall lifestyle appears well-balanced. We've observed consistent routines that support daily well-being, indicating a proactive approach to managing your health.
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { title: "Energy and Fatigue", desc: "You reported feeling tired most days." },
                    { title: "Digestive Patterns", desc: "Occasional bloating after meals." },
                    { title: "Sleep Quality", desc: "Inconsistent sleep patterns." }
                ].map((item, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <Button size="lg" className="w-full md:w-auto">View Recommended Next Steps</Button>
            </div>
        </div>
    );
}
