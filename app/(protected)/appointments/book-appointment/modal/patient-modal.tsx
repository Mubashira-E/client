"use client";

import type { PatientListItem } from "@/queries/visit/useGetAllPatientQuery";
import { Check, FileSearch, ScanSearch, Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import emptyImage from "@/public/assets/svg/common/empty.svg";
import { useGetAllPatientQuery } from "@/queries/visit/useGetAllPatientQuery";

// ── Map PatientListItem to the shape PatientModal consumers expect ──
export type Patient = {
  id:          string;
  name:        string;
  emrNumber:   string;
  emiratesId:  string;
  gender:      string;
  phoneNumber: string;
};

type PatientModalProps = {
  isOpen:            boolean;
  onClose:           () => void;
  onSelect:          (patient: Patient) => void;
  selectedPatientId?: string;
};

export function PatientModal({ isOpen, onClose, onSelect, selectedPatientId }: PatientModalProps) {
  const [searchFilter, setSearchFilter] = useState("");

  // ── Real API ─────────────────────────────────────────────────────
  const { patients, isLoading, isError } = useGetAllPatientQuery({
    pageSize:    100,
    pageNumber:  1,
    searchTerms: searchFilter || undefined,
  });

  const handleClearFilters = useCallback(() => {
    setSearchFilter("");
  }, []);

  // Map PatientListItem → Patient shape used by parent components
  const mapToPatient = (p: PatientListItem): Patient => ({
    id:          p.patientId,
    name:        p.patientName,
    emrNumber:   p.emrNumber,
    emiratesId:  p.emiratesId,
    gender:      "",   // not in PatientListItem — leave blank
    phoneNumber: "",   // not in PatientListItem — leave blank
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl min-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select Patient</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">

          {/* ── Search ── */}
          <div className="flex flex-col gap-2">
            <FormLabel>
              <ScanSearch className="w-4 h-4 text-primary" />
              Search with Name, EMR or Emirates ID
            </FormLabel>
            <div className="relative">
              <Input
                value={searchFilter}
                className="flex-grow"
                placeholder="Search with Name, EMR or Emirates ID"
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

          {/* ── Loading ── */}
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500 text-sm">Loading patients...</p>
            </div>
          )}

          {/* ── Error ── */}
          {isError && (
            <div className="flex items-center justify-center p-8">
              <p className="text-red-500 text-sm">Error loading patients. Please try again.</p>
            </div>
          )}

          {/* ── Empty ── */}
          {!isLoading && !isError && patients.length === 0 && (
            <section className="flex flex-col items-center justify-center p-4">
              <Image src={emptyImage} alt="Empty" width={240} height={240} />
              <h1 className="text-md font-semibold">No matching patients found</h1>
              <p className="text-gray-500 text-sm">Please try again with different criteria</p>
            </section>
          )}

          {/* ── Patient results ── */}
          {!isLoading && !isError && patients.length > 0 && (
            <div className="overflow-y-auto max-h-[50vh]">
              <FormLabel>
                <FileSearch className="w-4 h-4 text-primary" />
                Patient Results
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {patients.map(p => {
                  const patient = mapToPatient(p);
                  return (
                    <button
                      type="button"
                      key={patient.id}
                      onClick={() => {
                        onSelect(patient);
                        onClose();
                      }}
                      className={`flex items-center relative border rounded-md p-4 gap-3 cursor-pointer hover:bg-gray-100 transition-colors hover:border-primary ${
                        selectedPatientId === patient.id ? "border-primary bg-gray-100" : ""
                      }`}
                    >
                      {selectedPatientId === patient.id && (
                        <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <Avatar className="size-12">
                        <AvatarFallback className="flex items-center justify-center bg-primary text-primary-foreground font-bold">
                          {patient.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start justify-center">
                        <h3 className="font-semibold text-primary line-clamp-1 text-left">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {patient.emrNumber}
                          {" "}
                          | EMR
                        </p>
                        <p className="text-sm text-gray-600">{patient.emiratesId}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}