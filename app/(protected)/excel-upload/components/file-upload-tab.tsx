"use client";

import Lottie from "lottie-react";
import { ArrowUpFromLine, Download } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import ExcelLogo from "@/public/assets/images/excel-logo.png";
import excelUploadAnimation from "@/public/assets/lotties/excel-upload.json";
import uploadingFileAnimation from "@/public/assets/lotties/excel-uploading.json";

type FileUploadTabProps = {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
  uploadType: "demographics" | "advance" | "session" | null;
  onUploadTypeChange: (value: "demographics" | "advance" | "session" | null) => void;
  uploadOptions: { value: "demographics" | "advance" | "session"; label: string }[];
};

export function FileUploadTab({
  onFileUpload,
  isUploading = false,
  uploadType,
  onUploadTypeChange,
  uploadOptions,
}: FileUploadTabProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleUpload = () => {
    if (uploadedFile) {
      if (!uploadType) {
        toast.error("Please select the type of Excel file before uploading.");
        return;
      }
      onFileUpload(uploadedFile);
      setUploadedFile(null);
      toast.success("Upload started - Your file is being processed");
    }
  };

  const templateDownloadMap: Record<"demographics" | "advance" | "session", string> = {
    demographics: "/assets/Excel/Patient_template.xlsx",
    advance: "/assets/Excel/Advance_Payment_Excel.xlsx",
    session: "/assets/Excel/CONSOLIDATED_SESSIONS.xlsx",
  };

  const selectedTemplateDownload = uploadType ? templateDownloadMap[uploadType] : templateDownloadMap.demographics;

  const handleUploadTypeChange = useCallback((value: string) => {
    if (value && ["demographics", "advance", "session"].includes(value)) {
      onUploadTypeChange(value as "demographics" | "advance" | "session");
    }
  }, [onUploadTypeChange]);

  const selectValue = useMemo(() => {
    return uploadType || undefined;
  }, [uploadType]);

  return (
    <section className="space-y-4 border rounded-md p-4 bg-white mt-4">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Upload Excel File</h3>
          <p className="text-sm text-muted-foreground">
            Upload your Excel file containing patient data. Supported formats:
            .xls, .xlsx
          </p>
        </div>
        <Button variant="outline" asChild>
          <a
            href={selectedTemplateDownload}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="size-4 mr-2" />
            Download Sample Excel
          </a>
        </Button>
      </section>

      <section className="grid gap-2 md:grid-cols-[260px_1fr] items-end">
        <div className="space-y-2">
          <Label htmlFor="upload-type">Select File Type</Label>
          <Select
            value={selectValue}
            onValueChange={handleUploadTypeChange}
            disabled={isUploading}
          >
            <SelectTrigger id="upload-type" className="w-full md:w-[260px]">
              <SelectValue placeholder="Choose the Excel template" />
            </SelectTrigger>
            <SelectContent>
              {uploadOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground md:ml-2">
          Ensure the file matches the selected template. This helps us validate the columns correctly.
        </p>
      </section>

      <section
        {...getRootProps()}
        className={cn(
          "border-1 border-dashed cursor-pointer transition-colors rounded-md p-8 bg-white hover:bg-gray-50",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          isUploading && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <Lottie
            loop={true}
            autoplay={true}
            className="size-64"
            animationData={
              isUploading ? uploadingFileAnimation : excelUploadAnimation
            }
          />
          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop your Excel file here"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button variant="outline" type="button">
              Browse Files
            </Button>
          </div>
        </div>
      </section>

      {uploadedFile && (
        <>
          <h4 className="text-lg font-semibold">Confirm the file details</h4>
          <section className="bg-white border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={ExcelLogo}
                  alt="Excel Logo"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)}
                    {" "}
                    MB
                  </p>
                  {uploadType && (
                    <p className="text-xs text-muted-foreground">
                      Selected type:
                      {" "}
                      {uploadOptions.find(option => option.value === uploadType)?.label}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleUpload} disabled={isUploading}>
                  <ArrowUpFromLine className="size-4" />
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      <div className="bg-gray-50 border rounded-md px-6 py-4 hover:bg-gray-100 transition-colors">
        <div className="flex items-start gap-3">
          <div className="text-md">
            <p className="font-semibold mb-1">File Requirements</p>
            <ul className="text-sm space-y-1">
              <li>• Maximum file size: 10MB</li>
              <li>• Supported formats: .xlsx, .xls</li>
              <li>• File must contain all mandatory columns</li>
              <li>• First row should contain column headers</li>
              <li>• Data should start from the second row</li>
              <li>• Empty rows will be skipped during processing</li>
              <li>• Special characters in data should be properly formatted</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
