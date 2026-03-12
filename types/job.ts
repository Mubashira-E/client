export type JobStatus = "pending" | "processing" | "completed" | "failed" | "Processing" | "CompletedWithErrors";

export type JobListItem = {
  jobId: string;
  fileName: string;
  status: JobStatus;
  totalRows: number;
  rowsInserted: number;
  rowsFailed: number;
  createdOn: string;
};

export type Job = JobListItem;

export type JobListApiResponse = {
  items: JobListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type JobDetails = {
  jobId: string;
  fileName: string;
  status: JobStatus;
  errorMessage?: string;
  validationDetails?: string[];
  totalRows: number;
  rowsInserted: number;
  rowsFailed: number;
  startedAt: string;
  completedAt?: string;
};
