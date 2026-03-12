"use client";

import type { Job } from "@/types/job";
import Lottie from "lottie-react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimeAgo } from "@/lib/date-time-utils";
import ExcelLogo from "@/public/assets/images/excel-logo.png";
import infoAnimation from "@/public/assets/lotties/info.json";
import notFoundAnimation from "@/public/assets/lotties/not-found.json";

type JobListTabProps = {
  jobs: Job[];
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  lastRefreshTime?: Date | null;
};

function getStatusConfig() {
  return {
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "secondary" as const,
      color: "text-gray-500",
    },
    processing: {
      icon: Loader2,
      label: "Processing",
      variant: "default" as const,
      color: "text-gray-500",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      variant: "default" as const,
      color: "text-gray-500",
    },
    failed: {
      icon: XCircle,
      label: "Failed",
      variant: "destructive" as const,
      color: "text-gray-500",
    },
    success: {
      icon: CheckCircle,
      label: "Success",
      variant: "default" as const,
      color: "text-green-600",
    },
    error: {
      icon: XCircle,
      label: "Error",
      variant: "destructive" as const,
      color: "text-red-600",
    },
    completedwitherrors: {
      icon: XCircle,
      label: "Completed With Errors",
      variant: "destructive" as const,
      color: "text-white",
    },
    in_progress: {
      icon: Loader2,
      label: "In Progress",
      variant: "default" as const,
      color: "text-blue-600",
    },
    active: {
      icon: CheckCircle,
      label: "Active",
      variant: "default" as const,
      color: "text-green-600",
    },
    undermaintenance: {
      icon: XCircle,
      label: "Under Maintenance",
      variant: "destructive" as const,
      color: "text-orange-600",
    },
    unknown: {
      icon: Clock,
      label: "Unknown",
      variant: "outline" as const,
      color: "text-gray-400",
    },
  };
}

function JobListSkeleton() {
  return (
    <section className="space-y-3 max-h-[60vh] overflow-y-auto mt-6">
      {Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map(id => (
        <section key={id} className="bg-white border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-10 rounded" />
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}

export function JobListTab({
  jobs,
  currentPage,
  totalPages,
  totalItems,
  isLoading,
  onPageChange,
  onRefresh,
  lastRefreshTime,
}: JobListTabProps) {
  const router = useRouter();
  const statusConfig = getStatusConfig();
  const [showInProgressModal, setShowInProgressModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeAgoText, setTimeAgoText] = useState<string>("");

  // Update the time ago text every 10 seconds
  useEffect(() => {
    const updateTimeAgo = () => {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setTimeAgoText(formatTimeAgo(lastRefreshTime ?? null));
    };

    updateTimeAgo(); // Initial update

    const interval = setInterval(updateTimeAgo, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [lastRefreshTime]);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  const handleViewJobDetails = (jobId: string, status: string) => {
    if (status === "completed" || status === "success" || status === "active" || status === "completedwitherrors") {
      router.push(`/excel-upload/job/${jobId}`);
    }
    else {
      setShowInProgressModal(true);
    }
  };

  if (isLoading && jobs.length === 0) {
    return <JobListSkeleton />;
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center mt-12">
        <Lottie
          loop={true}
          autoplay={true}
          className="size-64"
          animationData={notFoundAnimation}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <h3 className="text-lg font-semibold">No Uploads Yet</h3>
          <p className="text-muted-foreground">
            Get started by uploading your first Excel file to track its progress
            here
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4 mt-6">
      {/* Refresh Header */}
      {onRefresh !== undefined && (
        <div className="flex items-center justify-between pb-3 border-b border-primary/10">
          <span className="text-sm text-muted-foreground">{timeAgoText}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      )}

      <section className="space-y-3 max-h-[620px] overflow-y-auto">
        {jobs.map((job) => {
          const normalizedStatus = job.status?.toLowerCase() || "unknown";
          const config
            = statusConfig[normalizedStatus as keyof typeof statusConfig]
              || statusConfig.unknown;
          const uploadedAt = new Date(job.createdOn);

          return (
            <section
              key={job.jobId}
              onClick={() => handleViewJobDetails(job.jobId, normalizedStatus)}
              className="bg-white border rounded-md p-4 hover:bg-gray-100 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Image
                    src={ExcelLogo}
                    alt="Excel Logo"
                    width={48}
                    height={48}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-primary">
                      {job.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {uploadedAt.toLocaleDateString()}
                        {" "}
                        at
                        {" "}
                        {uploadedAt.toLocaleTimeString()}
                      </span>
                      {job.rowsInserted !== undefined
                        && job.rowsInserted > 0 && (
                        <>
                          <span className="text-sm text-primary">•</span>
                          <span className="text-blue-900">
                            {job.rowsInserted}
                            {" "}
                            inserted
                          </span>
                        </>
                      )}
                      {job.rowsFailed !== undefined && job.rowsFailed > 0 && (
                        <>
                          <span className="text-sm text-primary">•</span>
                          <span className="text-destructive">
                            {job.rowsFailed}
                            {" "}
                            failed
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={config.variant}
                      className={
                        normalizedStatus === "completedwitherrors"
                          ? "text-white"
                          : ""
                      }
                    >
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </section>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/20">
          <div className="text-sm text-primary">
            Showing page
            {" "}
            {currentPage}
            {" "}
            of
            {" "}
            {totalPages}
            {" "}
            (
            {totalItems}
            {" "}
            total jobs
            )
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onPageChange(1);
              }}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm">
              Page
              {" "}
              {currentPage}
              {" "}
              of
              {" "}
              {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onPageChange(totalPages);
              }}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog
        open={showInProgressModal}
        onOpenChange={setShowInProgressModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lottie
                loop={false}
                autoplay={true}
                className="size-12"
                animationData={infoAnimation}
              />
              <AlertDialogTitle className="text-xl">
                Job Still Processing
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base leading-relaxed">
              This upload is currently being processed. Please wait a moment and
              check back shortly to view the details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowInProgressModal(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
