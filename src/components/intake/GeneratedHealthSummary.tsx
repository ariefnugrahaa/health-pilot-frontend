"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, Info, Save, ChevronRight, AlertCircle } from "lucide-react";

interface HealthSummaryData {
  healthSummary: string;
  recommendations: string[];
  warnings: string[];
}

interface GeneratedHealthSummaryProps {
  data: HealthSummaryData;
  onNextSteps?: () => void;
  onWhyThis?: () => void;
  onSaveLater?: () => void;
}

export function GeneratedHealthSummary({
  data,
  onNextSteps,
  onWhyThis,
  onSaveLater,
}: GeneratedHealthSummaryProps) {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary tracking-tight">
          Your Health Summary
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on the information you provided, here's an overview of patterns we noticed. This is guidance only, not a medical diagnosis.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed">
          {data.healthSummary}
        </CardContent>
      </Card>

      {/* Warnings - if any */}
      {data.warnings && data.warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> {data.warnings.join(" ")}
          </AlertDescription>
        </Alert>
      )}

      {/* Key Signals & Patterns */}
      <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
        <AccordionItem value="item-1" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">Key Signals & Patterns</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              {data.recommendations.map((recommendation, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4 py-2">
                  <p className="text-sm text-foreground">{recommendation}</p>
                </div>
              ))}

              {/* CTA Bar */}
              <div className="mt-6 bg-primary/10 rounded-lg p-4 flex items-center justify-between">
                <p className="text-sm font-medium text-primary">
                  Want more accurate insights? Improve accuracy of your health summary
                </p>
                <Button variant="default" size="sm" className="gap-2">
                  Continue with detailed health intake
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* What This May Mean */}
        <AccordionItem value="item-2" className="border rounded-lg px-6 mt-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">What This May Mean</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                The patterns identified above are based on the information you provided during the intake process.
                These insights are meant to help you understand potential areas of focus for your health journey.
              </p>
              <p>
                Keep in mind that these observations are educational in nature and should be discussed with a
                qualified healthcare provider for personalized medical advice.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Limitations & Boundaries */}
        <AccordionItem value="item-3" className="border rounded-lg px-6 mt-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">Limitations & Boundaries</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Not a Diagnosis:</strong> This summary is not a medical diagnosis. Only a licensed
                healthcare provider can diagnose medical conditions.
              </p>
              <p>
                <strong>Informational Only:</strong> The recommendations provided are for educational purposes
                and should not replace professional medical advice.
              </p>
              <p>
                <strong>Consult a Professional:</strong> Before making any changes to your health routine,
                starting supplements, or beginning new treatments, please consult with a qualified healthcare provider.
              </p>
              <p>
                <strong>Data Limitations:</strong> This analysis is based solely on the self-reported information
                you provided. Additional testing or evaluation may reveal different insights.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Next Steps Preview */}
      <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Next Steps Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Based on your summary, we've prepared personalized guidance to help you explore these patterns further.
            This includes lifestyle adjustments, tracking suggestions, and when to consider professional support.
          </p>
          <ol className="space-y-3">
            {data.recommendations.slice(0, 3).map((recommendation, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-foreground pt-0.5">{recommendation}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="space-y-3">
        <Button size="lg" className="w-full" onClick={onNextSteps}>
          View recommended next steps
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onWhyThis}>
            <Info className="mr-2 h-4 w-4" />
            Why this summary?
          </Button>
          <Button variant="outline" className="flex-1" onClick={onSaveLater}>
            <Save className="mr-2 h-4 w-4" />
            Save / continue later
          </Button>
        </div>
      </div>
    </div>
  );
}
