// components/patient-details.tsx
// Updated: wires patientId into form when existing patient is selected

import { Search, UserRoundPlus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { CreateAppointmentSchema } from "../schema/schema";
import { ExistingPatientFormSection } from "../../patient-details/components/existing-patient-form-section";
import { NewPatientFormSection } from "../../patient-details/components/new-patient-form-section";

type PatientDetailsProps = {
  onBack:               () => void;
  onReview:             () => void;
  isExistingPatient:    boolean;
  setIsExistingPatient: (value: boolean) => void;
};

export function PatientDetails({
  isExistingPatient,
  setIsExistingPatient,
  onBack,
  onReview,
}: PatientDetailsProps) {
  const { watch } = useFormContext<CreateAppointmentSchema>();
  const patientInfo = watch("patientInfo");
  const patientId   = watch("patientId");

  // ── Enable Preview button based on patient type ──────────────
  const isPreviewEnabled = isExistingPatient
    ? Boolean(patientId)  // ← existing patient: needs patientId set in form
    : Boolean(           // ← new patient: needs required fields filled
        patientInfo?.firstName
        && patientInfo?.patientsTitle
        && patientInfo?.dateOfBirth
        && patientInfo?.genderId,
      );

  return (
    <section className="bg-white rounded-md p-6 border border-gray-200">
      <div className="space-y-3 mb-6">
        <FormLabel>Select Patient Type</FormLabel>
        <RadioGroup
          defaultValue="existing"
          className="grid grid-cols-2 gap-4"
          onValueChange={value => setIsExistingPatient(value === "existing")}
        >
          <div>
            <RadioGroupItem value="existing" id="existing" className="peer sr-only" />
            <Label
              htmlFor="existing"
              className={cn(
                "flex items-center justify-start rounded-md border border-slate-200 bg-white p-4 hover:bg-slate-50 cursor-pointer transition-all duration-200",
                isExistingPatient ? "border-orange-500 bg-orange-50" : "",
              )}
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                <Search className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Search Existing Patient</p>
                <p className="text-sm text-slate-500">Search by MRN, Mobile Number or Emirates ID</p>
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="new-patient" id="new-patient" className="peer sr-only" />
            <Label
              htmlFor="new-patient"
              className={cn(
                "flex items-center justify-start rounded-md border border-slate-200 bg-white p-4 hover:bg-slate-50 cursor-pointer transition-all duration-200",
                !isExistingPatient ? "border-green-500 bg-green-50" : "",
              )}
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <UserRoundPlus className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Book New Patient</p>
                <p className="text-sm text-slate-500">Create a new patient record</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="bg-white">
        {isExistingPatient
          ? <ExistingPatientFormSection onSelectPatient={onReview} />
          : <NewPatientFormSection />}

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="text-gray-600" onClick={onBack}>
              Back
            </Button>
            <Button type="button" onClick={onReview} disabled={!isPreviewEnabled}>
              Preview
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}