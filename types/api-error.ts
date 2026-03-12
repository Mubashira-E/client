export type ApiErrorResponse = {
  type?: string;
  title?: string;
  detail?: string;
  instance?: string;
  severity?: string;
  status?: number;
  message?: string;
  errors?: Array<{ property: string; message: string }>;
};

export type ValidationErrorResponse = {
  type: "VALIDATION_ERROR";
  title: string;
  detail: string;
  instance: string;
  severity: "Warning" | "Error";
  status: number;
};
