"use client";

import { Activity, AlertCircle, Calendar, ChevronLeft, CreditCard, Stethoscope } from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetVisitByIdQuery } from "@/queries/visit/useGetVisitByIdQuery";

type VisitDetailsPageProps = {
  visitId: string;
};

export function VisitDetailsPage({ visitId }: VisitDetailsPageProps) {
  const { visitDetails, isLoading, error } = useGetVisitByIdQuery(visitId);
  const [source] = useQueryState("source", parseAsString.withDefault(""));

  const showBackButton = source !== "patient";

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showBackButton && (
          <Link href="/patients/visit-list" className="flex items-center gap-0.5 text-primary">
            <ChevronLeft className="w-4 h-4" />
            <p className="text-sm">Back to Visit List</p>
          </Link>
        )}

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !visitDetails) {
    return (
      <div className="space-y-4">
        {showBackButton && (
          <Link href="/patients/visit-list" className="flex items-center gap-0.5 text-primary">
            <ChevronLeft className="w-4 h-4" />
            <p className="text-sm">Back to Visit List</p>
          </Link>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">Error</p>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Failed to load visit details. Please try again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showBackButton && (
        <Link href="/patients/visit-list" className="flex items-center gap-0.5 text-primary">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-sm">Back to Visit List</p>
        </Link>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">
                Visit #
                {visitDetails.visitNo}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{visitDetails.visitType}</Badge>
                <span className="text-sm text-muted-foreground">
                  {visitDetails.visitDate}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Visit ID</p>
              <p className="font-mono text-sm break-all">{visitDetails.visitId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Visit Date</p>
              <p className="text-sm">{visitDetails.visitDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
              <p className="text-sm">{visitDetails.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">EMR Number</p>
              <p className="text-sm">{visitDetails.emrNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Department</p>
              <p className="text-sm">{visitDetails.medicalDepartmentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Clinician</p>
              <p className="text-sm">{visitDetails.clinicianName}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Diagnoses</p>
                <p className="text-2xl font-bold">{visitDetails.diagnosis.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Procedures</p>
                <p className="text-2xl font-bold text-blue-600">{visitDetails.procedures.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Treatments</p>
                <p className="text-2xl font-bold text-green-600">{visitDetails.treatments.length}</p>
              </CardContent>
            </Card>
          </div>

          {visitDetails.diagnosis.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Diagnoses
                </CardTitle>
                <CardDescription>Medical diagnoses for this visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {visitDetails.diagnosis.map(diagnosis => (
                    <div key={diagnosis.icdCode} className="flex items-center gap-2">
                      <Badge variant="secondary">{diagnosis.icdCode}</Badge>
                      <span className="text-sm">{diagnosis.description}</span>
                      {diagnosis.diagnosisType && (
                        <Badge variant="outline" className="text-xs">
                          {diagnosis.diagnosisType}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {visitDetails.procedures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Procedures
                </CardTitle>
                <CardDescription>Medical procedures performed during this visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {visitDetails.procedures.map(procedure => (
                    <div key={procedure.cptCode} className="flex items-center gap-2">
                      <Badge variant="secondary">{procedure.cptCode}</Badge>
                      <span className="text-sm">{procedure.description}</span>
                      <Badge variant="outline" className="text-xs">
                        {procedure.procedureType}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {visitDetails.treatments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Treatments
                </CardTitle>
                <CardDescription>Treatments administered during this visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {visitDetails.treatments.map(treatment => (
                    <div key={treatment.treatmentCode} className="flex items-center gap-2">
                      <Badge variant="secondary">{treatment.treatmentCode}</Badge>
                      <span className="text-sm">{treatment.treatmentName}</span>
                      {treatment.description && (
                        <span className="text-xs text-muted-foreground">
                          -
                          {" "}
                          {treatment.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {visitDetails.bills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Information
                </CardTitle>
                <CardDescription>Financial details for this visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visitDetails.bills.map(bill => (
                    <div key={bill.billNo} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">
                            Bill #
                            {bill.billNo}
                          </p>
                          <Badge variant="outline">{bill.billType}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Gross Amount</p>
                          <p className="font-medium">
                            $
                            {bill.grossAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Insurance Amount</p>
                          <p className="font-medium">
                            $
                            {bill.insuranceAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Patient Amount</p>
                          <p className="font-medium">
                            $
                            {bill.patientAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">VAT Amount</p>
                          <p className="font-medium">
                            $
                            {bill.vatAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
