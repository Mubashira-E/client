"use client";
import type { DateRange } from "@/components/ui/datepicker-dropdown";
import {
  Activity,
  Funnel,
  SearchIcon,
  SlidersHorizontal,
  TextSelect,
} from "lucide-react";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  useQueryState,
} from "nuqs";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/datepicker-dropdown";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useGetAllVisitQuery } from "@/queries/visit/useGetAllVisitQuery";
import { useAppointmentListStore } from "../stores/useAppointmentListStores";
import { areAllColumnsSelected, getAllColumnIds, getColumns } from "./data";

type AppointmentsHeaderProps = {
  isExternal?: boolean;
};

export function AppointmentsHeader({
  isExternal = false,
}: AppointmentsHeaderProps) {
  const { visibleColumns, setVisibleColumns } = useAppointmentListStore();

  const [isFilterOpen, setIsFilterOpen] = useQueryState(
    "isFilterOpen",
    parseAsBoolean.withDefault(false),
  );
  const [clinicianId, setClinicianId] = useQueryState(
    "clinicianId",
    parseAsInteger.withDefault(-1),
  );
  const [searchFilter, setSearchFilter] = useQueryState(
    "searchFilter",
    parseAsString.withDefault(""),
  );
  const [appointmentStatusId, setAppointmentStatusId] = useQueryState(
    "appointmentStatusId",
    parseAsInteger.withDefault(-1),
  );
  const [medicalDepartmentId, setMedicalDepartmentId] = useQueryState(
    "medicalDepartmentId",
    parseAsInteger.withDefault(0),
  );

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
    0,
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999,
  );

  const [fromDate, setFromDate] = useQueryState(
    "fromDate",
    parseAsIsoDate.withDefault(startOfDay),
  );
  const [toDate, setToDate] = useQueryState(
    "toDate",
    parseAsIsoDate.withDefault(endOfDay),
  );

  const selectedRange: DateRange = {
    from: new Date(fromDate),
    to: new Date(toDate),
  };

  const handleRangeChange = (range: DateRange) => {
    if (range.from)
      setFromDate(range.from);
    if (range.to)
      setToDate(range.to);
  };

  const { totalItems: totalAppointmentCount, isPending: statsLoading }
    = useGetAllVisitQuery({
      pageSize: 1,
      pageNumber: 1,
    });

  const { visits: recentVisits } = useGetAllVisitQuery({
    pageSize: 1,
    pageNumber: 1,
  });
  const latestVisit = recentVisits[0] ?? null;

  const outpatientCount = totalAppointmentCount;

  const appointmentStatuses = {
    data: {
      data: [
        { appointmentStatusId: 1, appointmentStatus: "Confirmed" },
        { appointmentStatusId: 2, appointmentStatus: "Pending" },
        { appointmentStatusId: 3, appointmentStatus: "Cancelled" },
        { appointmentStatusId: 4, appointmentStatus: "Rescheduled" },
        { appointmentStatusId: 5, appointmentStatus: "Arrived" },
      ],
    },
  };

  const clinicians = {
    data: [
      { clinicianId: 1, clinicianName: "Dr. Sarah Wilson" },
      { clinicianId: 2, clinicianName: "Dr. James Chen" },
      { clinicianId: 3, clinicianName: "Dr. Emily Brown" },
    ],
  };

  const medicalDepartmentDDl = {
    data: [
      { medicalDepartmentId: 1, medicalDepartment: "General Medicine" },
      { medicalDepartmentId: 2, medicalDepartment: "Dermatology" },
      { medicalDepartmentId: 3, medicalDepartment: "Pediatrics" },
    ],
  };

  const allColumns = getColumns();

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1)
      return;
    setVisibleColumns(
      visibleColumns.includes(columnId)
        ? visibleColumns.filter(id => id !== columnId)
        : [...visibleColumns, columnId],
    );
  };

  const selectAllColumns = () => setVisibleColumns(getAllColumnIds());
  const deselectAllColumns = () => setVisibleColumns([]);
  const isAllSelected = areAllColumnsSelected(visibleColumns);

  function formatVisitDate(dateStr?: string): string {
    if (!dateStr)
      return "—";
    return dateStr.replace(/-/g, "/");
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Appointment List</h1>
        <p className="text-sm text-gray-600 -mt-1">
          Manage your appointments here.
        </p>
      </div>

      {!isExternal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-white rounded-md p-4 flex border flex-1 relative">
            <TextSelect
              className="absolute top-6 right-8 size-14 text-cyan-800 opacity-50"
              strokeWidth={1}
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-medium text-gray-800">
                Appointment Statistics
              </h2>

              <div className="flex gap-6 flex-wrap sm:flex-nowrap">
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-gray-800">
                    {statsLoading ? "—" : totalAppointmentCount}
                  </p>
                  <p className="text-xs text-primary uppercase">
                    Total Appointments
                  </p>
                </div>

                <div className="hidden sm:block w-px h-full bg-gray-200" />

                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-gray-800">
                    {statsLoading ? "—" : outpatientCount}
                  </p>
                  <p className="text-xs text-green-600 uppercase">
                    Total Visits
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md p-4 flex border flex-1 relative">
            <Activity
              className="absolute top-6 right-8 size-14 text-green-600 opacity-50"
              strokeWidth={1}
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-medium text-gray-800">
                Recently Added Appointments
              </h2>

              {statsLoading
                ? (
                    <p className="text-xs text-gray-400">Loading...</p>
                  )
                : latestVisit
                  ? (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-gray-800">
                            Patient Name
                          </p>
                          <p className="text-xs text-gray-600">
                            {latestVisit.patientName}
                          </p>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-gray-800">
                              Clinician Name
                            </p>
                            <p className="text-xs text-gray-600">
                              {latestVisit.clinicianName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-gray-800">
                            Department
                          </p>
                          <p className="text-xs text-gray-600">
                            {latestVisit.medicalDepartmentName}
                          </p>
                        </div>
                        <div className="text-xs text-gray-600">
                          Visit Date:
                          {" "}
                          {formatVisitDate(latestVisit.visitDate)}
                        </div>
                      </>
                    )
                  : (
                      <p className="text-xs text-gray-400">No appointments yet</p>
                    )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col bg-white rounded-lg">
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 pt-4">
          <div className="flex gap-2 ml-auto">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns
                    <SlidersHorizontal className="size-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-70 max-h-75 overflow-y-auto"
                >
                  <DropdownMenuCheckboxItem
                    checked={isAllSelected}
                    onCheckedChange={() =>
                      isAllSelected ? deselectAllColumns() : selectAllColumns()}
                    className="text-xs whitespace-normal wrap-break-word leading-tight py-2 font-medium"
                  >
                    <span className="block w-full">
                      {isAllSelected
                        ? "Deselect All Columns"
                        : "Select All Columns"}
                    </span>
                  </DropdownMenuCheckboxItem>

                  <div className="h-px bg-gray-200 my-1" />

                  {allColumns.map(column => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={visibleColumns.includes(column.id)}
                      onCheckedChange={() => toggleColumn(column.id)}
                      className="text-xs whitespace-normal wrap-break-word leading-tight py-2"
                    >
                      <span className="block w-full">{column.name}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                Filter
                <Funnel className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {isFilterOpen && (
          <div className="flex flex-col gap-2 bg-white rounded-lg px-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-end items-stretch gap-2 flex-wrap">
              <div className="relative w-full sm:w-70">
                <Input
                  value={searchFilter}
                  className="w-full pl-10"
                  placeholder="Search..."
                  onChange={e => setSearchFilter(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="w-full sm:w-auto">
                <DateRangePicker
                  range={selectedRange}
                  onSelectedRangeChanged={handleRangeChange}
                />
              </div>

              <div className="w-full sm:w-55">
                <Select
                  value={
                    appointmentStatusId <= 0
                      ? ""
                      : appointmentStatusId.toString()
                  }
                  onValueChange={e =>
                    setAppointmentStatusId(Number.parseInt(e))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Appointment Status" />
                  </SelectTrigger>
                  <SelectContent className="max-h-100 overflow-y-auto">
                    <SelectGroup>
                      {appointmentStatuses.data.data.map(item => (
                        <SelectItem
                          key={item.appointmentStatusId}
                          value={item.appointmentStatusId.toString()}
                        >
                          {item.appointmentStatus}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {!isExternal && (
                <div className="w-full sm:w-55">
                  <Select
                    value={clinicianId <= 0 ? "" : clinicianId.toString()}
                    onValueChange={e => setClinicianId(Number.parseInt(e))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by Clinician" />
                    </SelectTrigger>
                    <SelectContent className="max-h-100 overflow-y-auto">
                      <SelectGroup>
                        {clinicians.data.map(item => (
                          <SelectItem
                            key={item.clinicianId}
                            value={item.clinicianId.toString()}
                          >
                            {item.clinicianName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!isExternal && (
                <div className="w-full sm:w-55">
                  <Select
                    value={
                      medicalDepartmentId === 0
                        ? ""
                        : medicalDepartmentId.toString()
                    }
                    onValueChange={e =>
                      setMedicalDepartmentId(Number.parseInt(e))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {medicalDepartmentDDl.data.map(item => (
                          <SelectItem
                            key={item.medicalDepartmentId}
                            value={item.medicalDepartmentId.toString()}
                          >
                            {item.medicalDepartment}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                variant="link"
                className="whitespace-nowrap"
                onClick={() => {
                  if (!isExternal) {
                    setClinicianId(-1);
                    setMedicalDepartmentId(0);
                  }
                  setSearchFilter("");
                  setToDate(endOfDay);
                  setFromDate(startOfDay);
                  setAppointmentStatusId(-1);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
