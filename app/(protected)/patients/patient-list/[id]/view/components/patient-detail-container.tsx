"use client";

import { Activity, AlertCircle, Eye, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPatientByIdQuery } from "@/queries/patient/useGetPatientByIdQuery";
import SessionsList from "./sessions-list";

type Props = { patientId: string };

export default function PatientDetailContainer({ patientId }: Props) {
  const router = useRouter();
  const { patientDetails, isLoading, error } = useGetPatientByIdQuery(patientId);

  const handleVisitClick = (visitId: string) => {
    router.push(`/patients/visit-list/${visitId}/view?source=patient`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !patientDetails) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Error</p>
              <p className="text-sm text-red-800 dark:text-red-200">
                Failed to load patient details. Please try again.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SessionsList total={10} completed={6} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle>Demographics</CardTitle>
            <CardDescription>Basic patient information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{patientDetails.patientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">EMR Number</span>
              <span className="font-medium">{patientDetails.emrNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Age</span>
              <span className="font-medium">{patientDetails.age}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nationality</span>
              <span className="font-medium">{patientDetails.nationalityName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Emirates ID</span>
              <span className="font-medium">{patientDetails.emiratesId}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle>Latest Visit</CardTitle>
            <CardDescription>Most recent visit information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {patientDetails.latestVisit
              ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Visit Number</span>
                      <span className="font-medium">{patientDetails.latestVisit.visitNo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Visit Date</span>
                      <span className="font-medium">{patientDetails.latestVisit.visitDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span className="font-medium">{patientDetails.latestVisit.medicalDepartmentName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Clinician</span>
                      <span className="font-medium">{patientDetails.latestVisit.clinicianName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Visit Type</span>
                      <Badge variant="outline">{patientDetails.latestVisit.visitType}</Badge>
                    </div>
                  </>
                )
              : (
                  <div className="text-muted-foreground">No visits recorded</div>
                )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle>Visit Summary</CardTitle>
            <CardDescription>Total visits and statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Visits</span>
              <span className="font-medium">{patientDetails.visit.length}</span>
            </div>
            {patientDetails.latestVisit && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Diagnoses</span>
                  <span className="font-medium">{patientDetails.latestVisit.diagnosis.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Procedures</span>
                  <span className="font-medium">{patientDetails.latestVisit.procedures.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Treatments</span>
                  <span className="font-medium">{patientDetails.latestVisit.treatments.length}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {patientDetails.latestVisit && (
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Latest Visit Details
            </CardTitle>
            <CardDescription>Diagnoses, procedures, and treatments from the most recent visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {patientDetails.latestVisit.diagnosis.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Diagnoses</h4>
                <div className="space-y-2">
                  {patientDetails.latestVisit.diagnosis.map(diagnosis => (
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
              </div>
            )}

            {patientDetails.latestVisit.procedures.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Procedures</h4>
                <div className="space-y-2">
                  {patientDetails.latestVisit.procedures.map(procedure => (
                    <div key={procedure.cptCode} className="flex items-center gap-2">
                      <Badge variant="secondary">{procedure.cptCode}</Badge>
                      <span className="text-sm">{procedure.description}</span>
                      <Badge variant="outline" className="text-xs">
                        {procedure.procedureType}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {patientDetails.latestVisit.treatments.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Treatments</h4>
                <div className="space-y-2">
                  {patientDetails.latestVisit.treatments.map(treatment => (
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
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Visit History
          </CardTitle>
          <CardDescription>Complete visit history for this patient. Click on any visit to view details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {patientDetails.visit.length > 0
            ? (
                patientDetails.visit.map(visit => (
                  <div
                    key={visit.visitId}
                    className="border rounded-lg shadow-none cursor-pointer hover:bg-gray-50 transition-colors group"
                    onClick={() => handleVisitClick(visit.visitId)}
                  >
                    <div className="p-4 flex items-center justify-between bg-muted/50 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-mono">
                          #
                          {visit.visitNo}
                        </Badge>
                        <div>
                          <div className="font-medium">
                            {visit.visitDate}
                            <span> • </span>
                            <span>{visit.clinicianName}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>{visit.medicalDepartmentName}</span>
                            <span> • </span>
                            <span>{visit.visitType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{visit.visitType}</Badge>
                        <Eye className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))
              )
            : (
                <div className="text-muted-foreground">No visits recorded for this patient yet.</div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}
