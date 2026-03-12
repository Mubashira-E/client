import type { CreateAppointmentSchema } from "../../book-appointment/schema/schema";
import {
  Check,
  ChevronRight,
  Hash,
  IdCard,
  Search,
  Smartphone,
  UserRoundSearch,
} from "lucide-react";
import Image from "next/image";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import emptyImage from "@/public/assets/svg/common/empty.svg";
import errorImage from "@/public/assets/svg/common/error.svg";
import searchImage from "@/public/assets/svg/search.svg";
import { useGetAllPatientQuery } from "@/queries/visit/useGetAllPatientQuery";
import { PatientSearchSkeleton } from "./existing-patient-loader";

type ExistingPatientFormSectionProps = {
  onSelectPatient: () => void;
};

export function ExistingPatientFormSection({
  onSelectPatient,
}: ExistingPatientFormSectionProps) {
  const { setValue, watch } = useFormContext<CreateAppointmentSchema>();

  const [mrnNo, setMrnNo] = useQueryState(
    "mrnNo",
    parseAsString.withDefault(""),
  );
  const [mobileNo, setMobileNo] = useQueryState(
    "mobileNo",
    parseAsString.withDefault(""),
  );
  const [emiratesId, setEmiratesId] = useQueryState(
    "emiratesId",
    parseAsString.withDefault(""),
  );

  const [searchTerms, setSearchTerms] = useState("");

  const {
    patients,
    isLoading: isPatientSearchLoading,
    isError,
  } = useGetAllPatientQuery({
    pageSize: 20,
    pageNumber: 1,
    searchTerms: searchTerms || undefined,
    useSearch: true,
  });

  const handleInputChange
    = (field: "mrnNo" | "mobileNo" | "emiratesId") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (field) {
          case "mrnNo":
            setMrnNo(e.target.value);
            break;
          case "mobileNo":
            setMobileNo(e.target.value);
            break;
          case "emiratesId":
            setEmiratesId(e.target.value);
            break;
        }
      };

  const handleSearch = () => {
    const term = mrnNo.trim() || mobileNo.trim() || emiratesId.trim();
    setSearchTerms(term);
  };

  const handleSelectPatient = (patient: any) => {
    const isAlreadySelected = watch("patientId") === patient.patientId;

    if (isAlreadySelected) {
      setValue("patientId", "");
      // ... (resetting other fields as before)
    }
    else {
      setValue("patientId", patient.patientId);
      setValue("patientInfo.mrn", patient.emrNumber);
      setValue("patientInfo.firstName", patient.patientName);
      setValue("patientInfo.emiratesId", patient.emiratesId || "");

      onSelectPatient();
    }
  };

  const renderSearchResults = () => {
    if (isPatientSearchLoading)
      return <PatientSearchSkeleton />;

    if (isError) {
      return (
        <section className="flex flex-col items-center justify-center my-8 border rounded-md p-4">
          <Image src={errorImage} alt="Error" width={320} height={320} />
          <h1 className="text-xl font-bold">Error loading data</h1>
          <p className="text-gray-500 text-sm">Please try again later</p>
        </section>
      );
    }

    if (!searchTerms) {
      return (
        <section className="flex flex-col items-center justify-center my-8 border rounded-md p-4">
          <Image src={searchImage} alt="Search" width={320} height={320} />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold">
              Enter MRN, Mobile OR Emirates ID
            </h1>
            <p className="text-gray-500 text-sm">to search for patient</p>
          </div>
        </section>
      );
    }

    if (!patients.length) {
      return (
        <section className="flex flex-col items-center justify-center my-8 border rounded-md p-4">
          <Image src={emptyImage} alt="Empty" width={320} height={320} />
          <h1 className="text-xl font-bold">No Matching Patients Found</h1>
          <p className="text-gray-500 text-sm">Please try different criteria</p>
        </section>
      );
    }

    return (
      <section className="flex flex-col gap-4">
        <FormLabel className="mt-2 col-span-3">
          <UserRoundSearch className="w-4 h-4 text-primary" />
          Search Results
        </FormLabel>
        <div className="grid grid-cols-1 gap-4">
          {patients.map((patient: any) => {
            const isSelected = watch("patientId") === patient.patientId;
            return (
              <Card
                key={patient.patientId}
                className={cn(
                  "overflow-hidden transition-all p-0",
                  isSelected
                    ? "border-primary ring-1 ring-primary"
                    : "hover:border-primary/50",
                )}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="flex items-start gap-4 p-6 grow">
                    <Avatar className="h-12 w-12 border">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {patient.patientName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grow">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold">
                          {patient.patientName}
                        </h3>
                        <Badge className="w-fit">
                          EMR
                          {patient.emrNumber}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">
                            Emirates ID:
                          </span>
                          <span className="font-medium">
                            {patient.emiratesId || "—"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">
                            Nationality:
                          </span>
                          <span className="font-medium">
                            {patient.nationalityName || "—"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">{patient.age}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-center items-center p-6">
                    <Button
                      type="button"
                      // cn is used here to toggle the button variant based on selection state
                      variant={isSelected ? "secondary" : "default"}
                      className={cn(
                        "gap-2",
                        isSelected
                        && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                      )}
                      onClick={() => handleSelectPatient(patient)}
                    >
                      {isSelected
                        ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Selected</span>
                            </>
                          )
                        : (
                            <>
                              <span>Select</span>
                              <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <section>
      <div className="flex flex-col md:flex-row gap-4 md:gap-3 mb-4 md:mb-6 items-end">
        <div className="space-y-2 w-full md:flex-1">
          <FormLabel className="mt-2 col-span-3">
            <Hash className="w-4 h-4 text-primary" />
            MRN No
          </FormLabel>
          <Input
            placeholder="Enter MRN"
            value={mrnNo}
            onChange={handleInputChange("mrnNo")}
          />
        </div>

        <div className="space-y-2 w-full md:flex-1">
          <FormLabel className="mt-2 col-span-3">
            <Smartphone className="w-4 h-4 text-primary" />
            Mobile No
          </FormLabel>
          <Input
            placeholder="Enter Mobile Number"
            value={mobileNo}
            onChange={handleInputChange("mobileNo")}
          />
        </div>

        <div className="space-y-2 w-full md:flex-1">
          <FormLabel className="mt-2 col-span-3">
            <IdCard className="w-4 h-4 text-primary" />
            Emirates ID
          </FormLabel>
          <Input
            placeholder="Enter Emirates ID"
            value={emiratesId}
            onChange={handleInputChange("emiratesId")}
          />
        </div>

        <Button
          variant="default"
          onClick={handleSearch}
          disabled={
            isPatientSearchLoading || (!mrnNo && !mobileNo && !emiratesId)
          }
          isLoading={isPatientSearchLoading}
        >
          <Search className="size-4" />
        </Button>
      </div>

      <div className="overflow-y-auto min-h-75">{renderSearchResults()}</div>
    </section>
  );
}
