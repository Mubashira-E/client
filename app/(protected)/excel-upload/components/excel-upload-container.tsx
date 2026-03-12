"use client";

import type { AxiosError } from "axios";
import type { ImportVisitErrorResponse } from "@/lib/visit-api";
import type { JobStatus } from "@/types/job";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importTreatmentSessionFile, importVisitFile } from "@/lib/visit-api";
import { useGetAllJobsQuery } from "@/queries/job";
import { FileUploadTab } from "./file-upload-tab";
import { InvalidRowsDialog } from "./invalid-rows-dialog";
import { JobListTab } from "./job-list-tab";
import { ValidationErrorDialog } from "./validation-error-dialog";

export type UploadJob = {
  jobId: string;
  fileName: string;
  status: JobStatus;
  totalRows: number;
  rowsInserted: number;
  rowsFailed: number;
  uploadedAt?: Date;
};

type UploadTemplate = "demographics" | "advance" | "session";

export function ExcelUploadContainer() {
  const [selectedTab, setSelectedTab] = useQueryState("tab", {
    defaultValue: "upload",
  });
  const [showInvalidRowsDialog, setShowInvalidRowsDialog] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{ file: File; rowsWithoutValues: number; validRowsCount?: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<UploadTemplate | null>("demographics");
  const [validationError, setValidationError] = useState<{ title?: string; detail?: string } | null>(null);

  const uploadOptions: { value: UploadTemplate; label: string }[] = useMemo(() => [
    { value: "demographics", label: "Demographic & Visit Details" },
    { value: "advance", label: "Advance Payment" },
    { value: "session", label: "Session Details" },
  ], []);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  const { jobs: apiJobs, isLoading: isLoadingJobs, refetch: refetchJobs, totalPages, totalItems } = useGetAllJobsQuery({
    pageSize,
    pageNumber: currentPage,
  });

  useEffect(() => {
    if (apiJobs.length > 0 || !isLoadingJobs) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setLastRefreshTime(new Date());
    }
  }, [apiJobs, isLoadingJobs]);

  const allJobs = [...apiJobs];

  const uploadFile = async (file: File, continueOnInvalidRows: boolean = false) => {
    setIsUploading(true);
    try {
      const importFunction = uploadType === "session" ? importTreatmentSessionFile : importVisitFile;
      const data = await importFunction(file, continueOnInvalidRows);

      if (data.jobId) {
        toast.success("File uploaded successfully! Processing has started.");
      }
      setSelectedTab("jobs");
      setCurrentPage(1);
      refetchJobs();
      setPendingUpload(null);
    }
    catch (err) {
      const error = err as AxiosError<ImportVisitErrorResponse>;
      const errorData = error.response?.data;
      const statusCode = error.response?.status;

      const isMissingColumnsError = statusCode === 400 && (
        (Array.isArray(errorData?.missingColumns) && errorData.missingColumns.length > 0)
        || (errorData?.type === "VALIDATION_ERROR" && errorData?.detail?.toLowerCase().includes("missing required columns"))
      );

      if (isMissingColumnsError) {
        const missingColumnsList = Array.isArray(errorData?.missingColumns) && errorData.missingColumns.length > 0
          ? errorData.missingColumns.join(", ")
          : undefined;

        setValidationError({
          title: errorData?.title || "Missing Required Columns",
          detail: errorData?.detail || (missingColumnsList ? `The file is missing required columns: ${missingColumnsList}` : undefined),
        });
        setPendingUpload(null);
        return;
      }

      if (statusCode === 400 && (errorData?.rowsWithoutValues || errorData?.detail?.includes("don't have") || errorData?.detail?.includes("don\u2019t have"))) {
        let invalidRowsCount = errorData.rowsWithoutValues || 0;
        let validRowsCount: number | undefined;

        if (!invalidRowsCount && errorData?.detail) {
          const invalidMatch = errorData.detail.match(/(\d+)\s+rows?\s+don['\u2019]t have/i);
          if (invalidMatch) {
            invalidRowsCount = Number.parseInt(invalidMatch[1], 10);
          }

          const validMatch = errorData.detail.match(/remaining\s+(\d+)\s+rows?/i);
          if (validMatch) {
            validRowsCount = Number.parseInt(validMatch[1], 10);
          }
        }

        setPendingUpload(prev =>
          prev ? { ...prev, rowsWithoutValues: invalidRowsCount, validRowsCount } : null,
        );
        setShowInvalidRowsDialog(true);
        return;
      }

      const errorMessage = typeof errorData === "string"
        ? errorData
        : (errorData?.detail || errorData?.message || "Failed to upload file. Please try again.");
      toast.error(errorMessage);
      setPendingUpload(null);
    }
    finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setValidationError(null);
    setPendingUpload({ file, rowsWithoutValues: 0, validRowsCount: undefined });

    uploadFile(file, false);
  };

  const handleInvalidRowsConfirm = () => {
    if (pendingUpload) {
      uploadFile(pendingUpload.file, true);
    }
    setShowInvalidRowsDialog(false);
  };

  const handleInvalidRowsCancel = () => {
    if (pendingUpload) {
      toast.info("Upload cancelled");
    }
    setShowInvalidRowsDialog(false);
    setPendingUpload(null);
  };

  const handleManualRefresh = async () => {
    await refetchJobs();
    setLastRefreshTime(new Date());
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium text-gray-800">Import Patient Records</h1>
          <p className="text-sm text-gray-600 -mt-1">Upload Excel files with patient details and monitor import progress</p>
        </div>

        <section className="relative">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="relative">
            <TabsList className="h-[38px] w-full justify-start">
              <TabsTrigger value="upload" className="group relative hover:text-primary cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="text-sm">File Upload</div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="group relative hover:text-primary cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    Upload History
                  </div>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <FileUploadTab
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
                uploadType={uploadType}
                onUploadTypeChange={setUploadType}
                uploadOptions={uploadOptions}
              />
            </TabsContent>

            <TabsContent value="jobs">
              <JobListTab
                jobs={allJobs}
                totalPages={totalPages}
                totalItems={totalItems}
                isLoading={isLoadingJobs}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onRefresh={handleManualRefresh}
                lastRefreshTime={lastRefreshTime}
              />
            </TabsContent>
          </Tabs>
        </section>
      </div>

      <InvalidRowsDialog
        open={showInvalidRowsDialog}
        rowsWithoutValues={pendingUpload?.rowsWithoutValues || 0}
        validRowsCount={pendingUpload?.validRowsCount}
        onConfirm={handleInvalidRowsConfirm}
        onCancel={handleInvalidRowsCancel}
      />
      <ValidationErrorDialog
        open={Boolean(validationError)}
        title={validationError?.title}
        detail={validationError?.detail}
        onClose={() => setValidationError(null)}
      />
    </>
  );
}
