"use client";

import {
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileUploadTabProps = {
  onFileUpload: (file: File) => void;
};

export function FileUploadTab({ onFileUpload }: FileUploadTabProps) {
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
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const handleUpload = () => {
    if (uploadedFile) {
      onFileUpload(uploadedFile);
      setUploadedFile(null);
      toast.success("Upload started - Your file is being processed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Excel File</h3>
        <p className="text-sm text-muted-foreground">
          Upload your Excel file containing wellness program data. Supported
          formats: .xls, .xls, .csv
        </p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed cursor-pointer transition-colors rounded-md p-8 bg-white",
          isDragActive
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/50",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-12 w-12 text-gray-500 mb-4" />
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
      </div>

      {uploadedFile && (
        <div className="bg-white border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-gray-500" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)}
                  {" "}
                  MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Button onClick={handleUpload}>Start Upload</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-md p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">File Requirements</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Maximum file size: 10MB</li>
              <li>• Supported formats: .xlsx, .xls, .csv</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
