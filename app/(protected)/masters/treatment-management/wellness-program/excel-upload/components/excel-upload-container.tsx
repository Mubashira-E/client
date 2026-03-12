"use client";

import type { AxiosError } from "axios";
import type { ImportVisitErrorResponse } from "@/lib/visit-api";
import { useState } from "react";
import { toast } from "sonner";
import { BottomBorder } from "@/components/ui/BottomBorder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importWellnessFile } from "@/lib/visit-api";
import { useGetAllJobsQuery } from "@/queries/job/useGetAllJobsQuery";
import { FileUploadTab } from "./file-upload-tab";
import { InvalidRowsDialog } from "./invalid-rows-dialog";
import { JobListTab } from "./job-list-tab";
import { ValidationErrorDialog } from "./validation-error-dialog";

export function ExcelUploadContainer() {
  const [selectedTab, setSelectedTab] = useState("upload");
  const [showInvalidRowsDialog, setShowInvalidRowsDialog] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{
    file: File;
    rowsWithoutValues: number;
    validRowsCount?: number;
    missingColumns?: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<{
    title?: string;
    detail?: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const {
    jobs: apiJobs,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
    totalPages,
    totalItems,
  } = useGetAllJobsQuery({
    pageSize,
    pageNumber: currentPage,
    jobType: 6,
  });

  const allJobs = [...apiJobs];

  const uploadFile = async (
    file: File,
    continueOnInvalidRows: boolean = false,
  ) => {
    try {
      const data = await importWellnessFile(file, continueOnInvalidRows);

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

      const isMissingColumnsError
        = statusCode === 400
          && ((Array.isArray(errorData?.missingColumns)
            && errorData.missingColumns.length > 0)
          || (errorData?.type === "VALIDATION_ERROR"
            && errorData?.detail
              ?.toLowerCase()
              .includes("missing required columns")));

      if (isMissingColumnsError) {
        const missingColumnsList
          = Array.isArray(errorData?.missingColumns)
            && errorData.missingColumns.length > 0
            ? errorData.missingColumns.join(", ")
            : undefined;

        setValidationError({
          title: errorData?.title || "Missing Required Columns",
          detail:
            errorData?.detail
            || (missingColumnsList
              ? `The file is missing required columns: ${missingColumnsList}`
              : undefined),
        });
        setPendingUpload(null);
        return;
      }

      if (
        statusCode === 400
        && (errorData?.rowsWithoutValues
          || errorData?.detail?.includes("don't have")
          || errorData?.detail?.includes("don't have"))
      ) {
        let invalidRowsCount = errorData.rowsWithoutValues || 0;
        let validRowsCount: number | undefined;
        let missingColumns: string | undefined;

        if (errorData?.detail) {
          const invalidMatch = errorData.detail.match(
            /(\d+)\s+rows?\s+don['\u2019]t have\s+(\S.*?)(?:\.|$)/i,
          );
          if (invalidMatch) {
            if (invalidRowsCount === 0) {
              invalidRowsCount = Number.parseInt(invalidMatch[1], 10);
            }
            missingColumns = invalidMatch[2];
          }

          const validMatch = errorData.detail.match(
            /remaining\s+(\d+)\s+rows?/i,
          );
          if (validMatch) {
            validRowsCount = Number.parseInt(validMatch[1], 10);
          }
        }

        setPendingUpload(prev =>
          prev
            ? {
                ...prev,
                rowsWithoutValues: invalidRowsCount,
                validRowsCount,
                missingColumns,
              }
            : null,
        );
        setShowInvalidRowsDialog(true);
        return;
      }

      const errorMessage
        = typeof errorData === "string"
          ? errorData
          : errorData?.detail
            || errorData?.message
            || "Failed to upload file. Please try again.";
      toast.error(errorMessage);
      setPendingUpload(null);
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
  };

  return (
    <div className="flex flex-col">
      <section className="relative bg-white p-4  rounded-md">
        <Tabs
          defaultValue="upload"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="relative"
        >
          <div className="absolute top-[33px] left-0 w-full h-[1px] bg-gray-300" />
          <TabsList className="h-[38px] w-full justify-start">
            <TabsTrigger
              value="upload"
              className="group relative hover:text-primary cursor-pointer"
            >
              {selectedTab === "upload" && <BottomBorder />}
              <div className="flex items-center gap-2">
                <div className="text-sm">File Upload</div>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="group relative hover:text-primary cursor-pointer"
            >
              {selectedTab === "jobs" && <BottomBorder />}
              <div className="flex items-center gap-2">
                <div className="text-sm">
                  Upload History (
                  {totalItems}
                  )
                </div>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <FileUploadTab onFileUpload={handleFileUpload} />
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
            />
          </TabsContent>
        </Tabs>
      </section>

      <InvalidRowsDialog
        open={showInvalidRowsDialog}
        rowsWithoutValues={pendingUpload?.rowsWithoutValues || 0}
        validRowsCount={pendingUpload?.validRowsCount}
        missingColumns={pendingUpload?.missingColumns}
        onConfirm={handleInvalidRowsConfirm}
        onCancel={handleInvalidRowsCancel}
      />
      <ValidationErrorDialog
        open={Boolean(validationError)}
        title={validationError?.title}
        detail={validationError?.detail}
        onClose={() => setValidationError(null)}
      />
    </div>
  );
}
