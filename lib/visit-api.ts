import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type ImportVisitResponse = {
  message: string;
  jobId?: string;
  rowsWithoutValues?: number;
  validationErrors?: string[];
};

export type ImportVisitErrorResponse = {
  message?: string;
  errors?: string[];
  rowsWithoutValues?: number;
  missingColumns?: string[];
  // RFC 7807 Problem Details format
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  severity?: string;
};

export async function importVisitFile(
  file: File,
  continueOnInvalidRows: boolean = false,
): Promise<ImportVisitResponse> {
  const formData = new FormData();
  formData.append("File", file);
  // Only send ContinueOnInvalidRows when true (backend defaults to false)
  if (continueOnInvalidRows) {
    formData.append("ContinueOnInvalidRows", "true");
  }

  const response = await api.post<ImportVisitResponse>(generalEndpoints.importVisit, formData);

  return response.data;
}

export async function importTreatmentSessionFile(
  file: File,
  continueOnInvalidRows: boolean = false,
): Promise<ImportVisitResponse> {
  const formData = new FormData();
  formData.append("File", file);
  // Only send ContinueOnInvalidRows when true (backend defaults to false)
  if (continueOnInvalidRows) {
    formData.append("ContinueOnInvalidRows", "true");
  }

  const response = await api.post<ImportVisitResponse>(generalEndpoints.importTreatmentSession, formData);

  return response.data;
}

export async function importTreatmentFile(
  file: File,
  continueOnInvalidRows: boolean = false,
): Promise<ImportVisitResponse> {
  const formData = new FormData();
  formData.append("File", file);
  // Only send ContinueOnInvalidRows when true (backend defaults to false)
  if (continueOnInvalidRows) {
    formData.append("ContinueOnInvalidRows", "true");
  }

  const response = await api.post<ImportVisitResponse>(generalEndpoints.importTreatment, formData);

  return response.data;
}

export async function importPackageFile(
  file: File,
  continueOnInvalidRows: boolean = false,
): Promise<ImportVisitResponse> {
  const formData = new FormData();
  formData.append("File", file);
  // Only send ContinueOnInvalidRows when true (backend defaults to false)
  if (continueOnInvalidRows) {
    formData.append("ContinueOnInvalidRows", "true");
  }

  const response = await api.post<ImportVisitResponse>(generalEndpoints.importPackage, formData);

  return response.data;
}

export async function importWellnessFile(
  file: File,
  continueOnInvalidRows: boolean = false,
): Promise<ImportVisitResponse> {
  const formData = new FormData();
  formData.append("File", file);
  // Only send ContinueOnInvalidRows when true (backend defaults to false)
  if (continueOnInvalidRows) {
    formData.append("ContinueOnInvalidRows", "true");
  }

  const response = await api.post<ImportVisitResponse>(generalEndpoints.importWellnessProgram, formData);

  return response.data;
}
