"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ServerCog,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetJobByIdQuery } from "@/queries/job/useGetJobByIdQuery";

type JobDetailsPageProps = {
  jobId: string;
};

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    badgeVariant: "secondary" as const,
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-900",
    iconColor: "text-amber-600",
    dotColor: "bg-amber-500",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    badgeVariant: "inProgress" as const,
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900",
    iconColor: "text-blue-600",
    dotColor: "bg-blue-500",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    badgeVariant: "done" as const,
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-900",
    iconColor: "text-teal-600",
    dotColor: "bg-teal-500",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    badgeVariant: "destructive" as const,
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900",
    iconColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  success: {
    icon: CheckCircle2,
    label: "Success",
    badgeVariant: "done" as const,
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-900",
    iconColor: "text-teal-600",
    dotColor: "bg-teal-500",
  },
  error: {
    icon: XCircle,
    label: "Error",
    badgeVariant: "destructive" as const,
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900",
    iconColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  completedwitherrors: {
    icon: AlertCircle,
    label: "Completed With Errors",
    badgeVariant: "destructive" as const,
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-red-600",
    iconColor: "text-red-700",
    dotColor: "bg-orange-500",
  },
  in_progress: {
    icon: Loader2,
    label: "In Progress",
    badgeVariant: "inProgress" as const,
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900",
    iconColor: "text-blue-600",
    dotColor: "bg-blue-500",
  },
  active: {
    icon: CheckCircle2,
    label: "Active",
    badgeVariant: "done" as const,
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-900",
    iconColor: "text-teal-600",
    dotColor: "bg-teal-500",
  },
  undermaintenance: {
    icon: AlertCircle,
    label: "Under Maintenance",
    badgeVariant: "destructive" as const,
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    borderColor: "border-gray-200 dark:border-gray-900",
    iconColor: "text-gray-600",
    dotColor: "bg-gray-500",
  },
  unknown: {
    icon: Clock,
    label: "Unknown",
    badgeVariant: "outline" as const,
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    borderColor: "border-gray-200 dark:border-gray-900",
    iconColor: "text-gray-400",
    dotColor: "bg-gray-400",
  },
};

export function JobDetailsPage({ jobId }: JobDetailsPageProps) {
  const router = useRouter();
  const { jobDetails, isLoading, error } = useGetJobByIdQuery(jobId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group p-0 h-auto"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Jobs</span>
        </Button>

        <div className="space-y-6">
          {/* Header Card Skeleton */}
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="w-12 h-12 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-7 w-64" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-primary/10">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics Card Skeleton */}
          <Card className="border-primary shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-primary/10">
                {["total", "inserted", "failed", "success"].map(stat => (
                  <div key={stat} className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group p-0 h-auto"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Jobs</span>
        </Button>

        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-red-900 dark:text-red-100 mb-2">
                  Unable to Load Job Details
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 max-w-md">
                  We encountered an error while fetching the job information.
                  Please try again later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const normalizedStatus = jobDetails.status?.toLowerCase() || "unknown";
  const config
    = statusConfig[normalizedStatus as keyof typeof statusConfig]
      || statusConfig.unknown;
  const StatusIcon = config.icon;

  const successRate
    = jobDetails.totalRows > 0
      ? ((jobDetails.rowsInserted / jobDetails.totalRows) * 100).toFixed(1)
      : "0";

  const isAnimating
    = normalizedStatus === "processing" || normalizedStatus === "in_progress";

  return (
    <div className="space-y-6 p-6">
      {/* Back Navigation */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group p-0 h-auto"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Jobs</span>
      </Button>

      {/* Header Card */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 relative">
            <ServerCog
              className="absolute right-2 size-16 text-primary opacity-10"
              strokeWidth={1}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <StatusIcon
                    className={`h-6 w-6 ${config.iconColor} ${isAnimating ? "animate-spin" : ""}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground truncate mb-1">
                    {jobDetails.fileName}
                  </h1>
                  <Badge
                    variant={config.badgeVariant}
                    className="gap-1.5 text-white"
                  >
                    {config.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Job Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-primary/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                  Job ID
                </p>
                <p className="font-mono text-sm text-foreground truncate">
                  {jobDetails.jobId}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                  Started At
                </p>
                <p className="text-sm text-foreground">
                  {new Date(jobDetails.startedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                  Completed At
                </p>
                <p className="text-sm text-foreground">
                  {jobDetails.completedAt
                    ? new Date(jobDetails.completedAt).toLocaleString()
                    : "In Progress..."}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Card */}
      {jobDetails.totalRows > 0 && (
        <Card className="border-primary shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Processing Statistics
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {jobDetails.rowsInserted + jobDetails.rowsFailed}
                {" "}
                /
                {" "}
                {jobDetails.totalRows}
                {" "}
                rows
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress
                value={
                  ((jobDetails.rowsInserted + jobDetails.rowsFailed)
                    / jobDetails.totalRows)
                  * 100
                }
                className="h-2"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {jobDetails.rowsInserted}
                  {" "}
                  successful
                </span>
                <span>
                  {jobDetails.rowsFailed}
                  {" "}
                  failed
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-primary/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Total Rows
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {jobDetails.totalRows.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Rows Inserted
                  </p>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {jobDetails.rowsInserted.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Rows Failed
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {jobDetails.rowsFailed.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-primary dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-primary dark:text-purple-400">
                    {successRate}
                    %
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {jobDetails.errorMessage && (
        <Card
          className={`${config.borderColor} border-l-4 bg-red-50/50 dark:bg-red-950/10`}
        >
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  Error Occurred
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                  {jobDetails.errorMessage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Details */}
      {jobDetails.validationDetails
        && jobDetails.validationDetails.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Validation Issues</h2>
            </div>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 border-0"
            >
              {jobDetails.validationDetails.length}
              {" "}
              {jobDetails.validationDetails.length === 1 ? "issue" : "issues"}
            </Badge>
          </div>

          <div className="space-y-3">
            {jobDetails.validationDetails.map(detail => (
              <div
                key={detail}
                className="bg-white dark:bg-card rounded-md border border-primary/10 hover:border-primary/20 transition-colors"
              >
                <div className="p-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                    <p className="text-sm text-foreground leading-relaxed flex-1">
                      {detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
