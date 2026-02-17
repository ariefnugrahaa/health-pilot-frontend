"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Mail, Save } from "lucide-react";

interface SummaryErrorProps {
  error?: string;
  onRetry?: () => void;
  onSaveLater?: () => void;
  onContactSupport?: () => void;
}

export function SummaryError({
  error = "We couldn't generate your health summary. Please try again.",
  onRetry,
  onSaveLater,
  onContactSupport,
}: SummaryErrorProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">
          We encountered an issue while generating your health summary
        </p>
      </div>

      {/* Error Alert */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>

      {/* Explanation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What happened?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Our AI service may be temporarily unavailable, or there might be an issue with your connection.
            Your data has been saved safely.
          </p>
          <p>
            You can try again, save your progress and continue later, or contact our support team for assistance.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSaveLater}
          >
            <Save className="mr-2 h-4 w-4" />
            Save & Continue Later
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onContactSupport}
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Support Info */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>If the problem persists, please reach out to our support team:</p>
        <p className="font-medium">
          <a href="mailto:support@healthpilot.com" className="underline hover:text-foreground">
            support@healthpilot.com
          </a>
        </p>
      </div>
    </div>
  );
}
