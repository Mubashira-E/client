"use client";

import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function AddClinicianLicenseForm() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Feature Not Available</AlertTitle>
        <AlertDescription>
          The Clinician License API is not available in the current Swagger specification.
          This feature has been temporarily disabled. Please contact your system administrator
          for more information.
        </AlertDescription>
      </Alert>

      <Button
        type="button"
        variant="outline"
        onClick={() => router.push("/masters/clinician-management?tab=clinician")}
      >
        Back to List
      </Button>
    </div>
  );
}
