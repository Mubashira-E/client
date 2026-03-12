"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { mockWellnessPrograms } from "@/app/(protected)/masters/treatment-management/wellness-program/components/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useGetAllPackageQuery } from "@/queries/masters/package-plans/useGetAllPackageQuery";
import { useGetAllTreatmentQuery } from "@/queries/masters/treatments/useGetAllTreatmentQuery";
import { useGetPatientByIdQuery } from "@/queries/patient/useGetPatientByIdQuery";
import SessionsList from "../../view/components/sessions-list";

type IngredientItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

const THERAPISTS = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen",
  "Dr. Priya Sharma",
  "Dr. Ahmed Hassan",
  "Dr. Emma Williams",
  "Dr. Raj Kumar",
  "Dr. Maria Garcia",
];

const ROOMS = [
  "Room 101",
  "Room 102",
  "Room 103",
  "Room 201",
  "Room 202",
  "Room 301",
  "Therapy Suite A",
  "Therapy Suite B",
];

export function NewVisitForm({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { id: "1", name: "Oil", quantity: 2, price: 50 },
    { id: "2", name: "Bandage", quantity: 1, price: 10 },
  ]);

  const [discount, setDiscount] = useState(10);
  const [selectedTreatmentCode, setSelectedTreatmentCode] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [selectedWellnessProgramId, setSelectedWellnessProgramId] = useState("");
  const [therapist, setTherapist] = useState("");
  const [room, setRoom] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  const { patientDetails: patient, isLoading } = useGetPatientByIdQuery(patientId);
  const {
    treatments,
    isLoading: treatmentsLoading,
    isError: treatmentsError,
  } = useGetAllTreatmentQuery({
    PageSize: 100,
    PageNumber: 1,
    SortOrderBy: true,
  });

  const { packages } = useGetAllPackageQuery({
    PageSize: 100,
    PageNumber: 1,
    SearchTerms: "",
    SortOrderBy: true,
  });

  const latestVisitTreatmentCode = patient?.latestVisit?.treatments?.[0]?.treatmentCode;
  const currentTreatmentCode = selectedTreatmentCode || latestVisitTreatmentCode || "";
  const selectedTreatment = treatments.find(t => t.treatmentCode === currentTreatmentCode);
  const packageOptions = packages;
  const wellnessProgramOptions = mockWellnessPrograms.filter(program => program.status === "active");
  const selectedPackage = packageOptions.find((pkg: any) => pkg.packageId === selectedPackageId);
  const selectedWellnessProgram = wellnessProgramOptions.find(program => program.id === selectedWellnessProgramId);

  const total = ingredients.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const finalPrice = total - discount;

  let treatmentPlaceholder = "Select treatment";
  if (treatmentsLoading) {
    treatmentPlaceholder = "Loading treatments...";
  }
  if (treatmentsError) {
    treatmentPlaceholder = "Failed to load treatments";
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setIngredients(ingredients.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item,
    ));
  };

  const handleCancel = () => {
    router.push("/patients/patient-list");
  };

  const handleConfirm = () => {
    toast.success("New visit created successfully");
    router.push("/patients/patient-list");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Patient Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Patient Name</Label>
          <div className="font-medium">{patient?.patientName || "N/A"}</div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">EMR NO</Label>
          <div className="font-medium">{patient?.emrNumber || "N/A"}</div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Emirates ID</Label>
          <div className="font-medium">{patient?.emiratesId || "N/A"}</div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Doctor</Label>
          <div className="font-medium">Dr. John Smith</div>
        </div>
      </div>

      {/* Treatment Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Treatment Details</h3>
        {selectedTreatment && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Treatment Name</Label>
              <div className="font-medium">{selectedTreatment.treatmentName}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Treatment Code</Label>
              <div className="font-medium">{selectedTreatment.treatmentCode}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Duration</Label>
              <div className="font-medium">{selectedTreatment.duration || "N/A"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Price</Label>
              <div className="font-medium">
                AED
                {" "}
                {selectedTreatment.price?.toLocaleString("en-AE", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label className="text-muted-foreground">Description</Label>
              <div className="font-medium text-sm text-muted-foreground">
                {selectedTreatment.description || "No description available"}
              </div>
            </div>
          </div>
        )}
        {!selectedTreatment && (
          <div className="text-sm text-muted-foreground border rounded-md p-4">
            Select a treatment to view its details.
          </div>
        )}
      </div>

      {/* Session Details Section */}
      <SessionsList total={10} completed={6} />

      {/* Treatment Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Session Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Treatment</Label>
            <Select
              value={currentTreatmentCode || undefined}
              onValueChange={setSelectedTreatmentCode}
              disabled={treatmentsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={treatmentPlaceholder} />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
                {treatments.map(treatmentOption => (
                  <SelectItem key={treatmentOption.treatmentId} value={treatmentOption.treatmentCode}>
                    {treatmentOption.treatmentName}
                  </SelectItem>
                ))}
                {!treatmentsLoading && !treatments.length && (
                  <SelectItem value="no-treatments" disabled>
                    No treatments available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Therapist</Label>
            <Select value={therapist} onValueChange={setTherapist}>
              <SelectTrigger>
                <SelectValue placeholder="Select therapist" />
              </SelectTrigger>
              <SelectContent>
                {THERAPISTS.map(therapistOption => (
                  <SelectItem key={therapistOption} value={therapistOption}>
                    {therapistOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Room</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {ROOMS.map(roomOption => (
                  <SelectItem key={roomOption} value={roomOption}>
                    {roomOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Input
              type="date"
              value={preferredDate}
              onChange={e => setPreferredDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Program Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Package Plan</Label>
            <Select
              value={selectedPackageId || undefined}
              onValueChange={setSelectedPackageId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select package plan" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
                {packageOptions.map((pkg: any) => (
                  <SelectItem key={pkg.packageId} value={pkg.packageId}>
                    {pkg.packageName}
                  </SelectItem>
                ))}
                {!packageOptions.length && (
                  <SelectItem value="no-packages" disabled>
                    No package plans available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedPackage && (
              <p className="text-sm text-muted-foreground">
                {selectedPackage.packageDescription}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Wellness Program</Label>
            <Select
              value={selectedWellnessProgramId || undefined}
              onValueChange={setSelectedWellnessProgramId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select wellness program" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
                {wellnessProgramOptions.map(program => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.programName}
                  </SelectItem>
                ))}
                {!wellnessProgramOptions.length && (
                  <SelectItem value="no-programs" disabled>
                    No wellness programs available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedWellnessProgram && (
              <p className="text-sm text-muted-foreground">
                {selectedWellnessProgram.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients and Pricing Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ingredients and Pricing</h3>
        <div className="border rounded-md">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted font-semibold border-b">
            <div>Ingredients</div>
            <div>Quantity (Adjustable)</div>
            <div>Price</div>
          </div>
          {ingredients.map(item => (
            <div key={item.id} className="grid grid-cols-3 gap-4 p-4 border-b">
              <div className="flex items-center">{item.name}</div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={e => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 0)}
                  className="w-16 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <div className="flex items-center">
                AED
                {item.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-md">
        <div className="space-y-2">
          <Label>Total</Label>
          <div className="text-2xl font-bold">
            AED
            {total}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Discount</Label>
          <Input
            type="number"
            value={discount}
            onChange={e => setDiscount(Number.parseInt(e.target.value) || 0)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label>Final Price</Label>
          <div className="text-2xl font-bold">
            AED
            {finalPrice}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleConfirm}>
          Create Visit
        </Button>
      </div>
    </div>
  );
}
