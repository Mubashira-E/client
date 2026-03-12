"use client";

import type { CreateAppointmentSchema } from "../schema/schema";
import { Building2, Check, FileSearch, Globe, Languages, ScanSearch, Search } from "lucide-react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import emptyImage from "@/public/assets/svg/common/empty.svg";
import errorImage from "@/public/assets/svg/common/error.svg";
import { useGetAllClinicianQuery } from "@/queries/clinician/useGetAllClinicianQuery";
import { useGetAllMedicalDepartmentQuery } from "@/queries/general/medical-department/useGetAllMedicalDepartmentQuery";
import { useGetAllNationalityQuery } from "@/queries/general/nationality/useGetAllNationalityQuery";
import { useGetAllLanguageQuery } from "@/queries/general/language/useGetAllLanguageQuery";
import { ClinicianSkeletonLoader } from "../components/clinician-skeleton-loader";

type ClinicianModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ClinicianModal({ isOpen, onClose }: ClinicianModalProps) {
  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", { defaultValue: "" });
  const [, setClinicianSearchDate] = useQueryState("clinicianSearchDate", { defaultValue: "" });

  // ── Local filter state (nationality and language are UI filters,
  //    not part of the appointment form schema) ──────────────────────────────
  const [languageFilter, setLanguageFilter] = React.useState("");
  const [nationalityFilter, setNationalityFilter] = React.useState("");

  const { control, trigger, watch, setValue } = useFormContext<CreateAppointmentSchema>();
  const selectedClinicianId = watch("clinicianId");
  const selectedDepartmentId = watch("departmentId");

  // ── Dropdown data ─────────────────────────────────────────────────────────
  const { medicalDepartments, isLoading: loadingDepts } = useGetAllMedicalDepartmentQuery({ pageSize: 100, pageNumber: 1 });
  const { nationalities, isLoading: loadingNats } = useGetAllNationalityQuery({ pageSize: 100, pageNumber: 1 });
  const { languages, isLoading: loadingLangs } = useGetAllLanguageQuery({ pageSize: 100, pageNumber: 1 });

  // ── Clinician list — all three filters sent to backend ────────────────────
  const { clinicians, isLoading, isError } = useGetAllClinicianQuery({
    pageSize: 100,
    pageNumber: 1,
    searchTerms: searchFilter || undefined,
    MedicalDepartmentId: selectedDepartmentId || undefined,
    LanguageId: languageFilter || undefined,
    NationalityId: nationalityFilter || undefined,
  });

  const handleClearFilters = useCallback(() => {
    setSearchFilter("");
    setLanguageFilter("");
    setNationalityFilter("");
    setValue("departmentId", undefined);
    setClinicianSearchDate("");
  }, [setSearchFilter, setValue, setClinicianSearchDate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl min-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select Clinician</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">

          {/* ── Filter dropdowns ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Nationality */}
            <div className="space-y-2">
              <FormItem>
                <FormLabel>
                  <Globe className="w-4 h-4 text-primary" />
                  Select Nationality
                </FormLabel>
                <Select
                  disabled={loadingNats}
                  value={nationalityFilter}
                  onValueChange={setNationalityFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingNats ? "Loading..." : "Eg: Indian"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {nationalities?.map((item: any) => (
                      <SelectItem key={item.nationalityId} value={item.nationalityId.toString()}>
                        {item.nationalityName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <FormItem>
                <FormLabel>
                  <Languages className="w-4 h-4 text-primary" />
                  Select Language
                </FormLabel>
                <Select
                  disabled={loadingLangs}
                  value={languageFilter}
                  onValueChange={setLanguageFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingLangs ? "Loading..." : "Eg: Hindi, English"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {languages?.map((item: any) => (
                      <SelectItem key={item.languageId} value={item.languageId.toString()}>
                        {item.languageName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Department — wired to form schema via FormField */}
            <div className="space-y-2">
              <FormField
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Building2 className="w-4 h-4 text-primary" />
                      Select Department
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={loadingDepts}
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                          trigger("departmentId");
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingDepts ? "Loading..." : "Eg: Ortho, Pediatrics"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {medicalDepartments?.map(dept => (
                            <SelectItem key={dept.medicalDepartmentId} value={dept.medicalDepartmentId}>
                              {dept.medicalDepartmentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ── Search ── */}
          <div className="flex flex-col gap-2">
            <FormLabel>
              <ScanSearch className="w-4 h-4 text-primary" />
              Search with Name or Department
            </FormLabel>
            <div className="relative">
              <Input
                value={searchFilter}
                className="flex-grow"
                placeholder="Search with Name or Department"
                onChange={e => setSearchFilter(e.target.value)}
              />
              <Search className="w-4 h-4 text-primary absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" className="text-primary h-4" variant="link" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>

          {isLoading && <ClinicianSkeletonLoader />}

          {isError && (
            <section className="flex flex-col items-center justify-center p-4">
              <Image src={errorImage} alt="Error" width={240} height={240} />
              <h1 className="text-md font-semibold">Error loading clinicians</h1>
              <p className="text-gray-500 text-sm">Please try again later</p>
            </section>
          )}

          {clinicians.length === 0 && !isError && !isLoading && (
            <section className="flex flex-col items-center justify-center p-4">
              <Image src={emptyImage} alt="Empty" width={240} height={240} />
              <h1 className="text-md font-semibold">No matching clinicians found</h1>
              <p className="text-gray-500 text-sm">Try clearing your filters or searching by name</p>
            </section>
          )}

          {clinicians.length > 0 && !isError && !isLoading && (
            <div className="overflow-y-auto max-h-[50vh]">
              <FormLabel>
                <FileSearch className="w-4 h-4 text-primary" />
                Clinician Results
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {clinicians.map(clinician => (
                  <button
                    type="button"
                    key={clinician.clinicianId}
                    onClick={() => {
                      setValue("clinicianId", clinician.clinicianId);
                      onClose();
                    }}
                    className={`flex items-center relative border rounded-md p-4 gap-3 cursor-pointer hover:bg-gray-100 transition-colors hover:border-primary ${
                      selectedClinicianId === clinician.clinicianId ? "border-primary bg-gray-100" : ""
                    }`}
                  >
                    {selectedClinicianId === clinician.clinicianId && (
                      <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <Avatar className="size-12">
                      <AvatarFallback className="flex items-center justify-center bg-primary text-primary-foreground font-bold">
                        {clinician.clinicianName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                      <h3 className="font-semibold text-primary line-clamp-1 text-left">
                        {clinician.clinicianName}
                      </h3>
                      <p className="text-sm text-gray-600">{clinician.medicalDepartmentName}</p>
                      {clinician.languageName && (
                        <p className="text-xs text-gray-400">{clinician.languageName}</p>
                      )}
                      <p className="text-sm text-gray-600">{clinician.clinicianCode}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}