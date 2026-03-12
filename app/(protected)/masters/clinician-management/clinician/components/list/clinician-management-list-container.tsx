import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { useGetAllClinicianQuery } from "@/queries/clinician/useGetAllClinicianQuery";
import { ClinicianManagementTableError } from "../table/clinician-management-table-error";

import { ClinicianManagementListCard } from "./clinician-management-list-card";
import { ClinicianManagementListCardSkeleton } from "./clinician-management-list-card-skeleton";

export function ClinicianManagementListCardContainer() {
  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));

  const { clinicians, totalPages, isPending, isError }
  = useGetAllClinicianQuery({
    searchTerms: searchFilter,
    pageNumber: currentPage,
    pageSize: 10,
  });

  if (isError) {
    return <ClinicianManagementTableError />;
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ClinicianManagementListCardSkeleton key={`clinician-list-skeleton-${index + 1}`} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 rounded-md">
        {clinicians.map(clinicianItem => (
          <ClinicianManagementListCard
            key={clinicianItem.clinicianId}
            name={clinicianItem.clinicianName}
            clinicianLicense={clinicianItem.clinicianCode}
            clinicianDepartment={clinicianItem.medicalDepartmentId}
            clinician={clinicianItem}
            clinicianId={Number(clinicianItem.clinicianId)}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page
            {" "}
            {currentPage}
            {" "}
            of
            {" "}
            {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setCurrentPage(1);
              }}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage === 1 || isPending}
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
              variant="outline"
              size="icon"
              onClick={async () => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setCurrentPage(totalPages);
              }}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
