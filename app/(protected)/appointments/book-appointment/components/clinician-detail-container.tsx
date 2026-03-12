"use client";

import type { CreateAppointmentSchema } from "../schema/schema";
import { addDays, format } from "date-fns";
import { Bed, BriefcaseMedical, Calendar, ChevronRight, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DatePickerButton } from "@/components/ui/date-picker-Button";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useGetAllClinicianQuery } from "@/queries/clinician/useGetAllClinicianQuery";
import { BookingSuccessModal } from "../modal/booking-success-modal";
import { ClinicianModal } from "../modal/clinician-modal";
import { PatientModal } from "../modal/patient-modal";
import { PreviewAppointmentModal } from "../modal/preview-appointment-modal";
import { AppointmentDetails } from "./appointment-details";
import { PatientDetails } from "./patient-details";
import { RoomAllocationFlow } from "./room-allocation/room-allocation-flow";
import { SlotSelection } from "./slot-selection";

function formatDateToDDMMYYYY(dateString: string) {
  try {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const day   = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year  = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  catch { return dateString; }
}

export function ClinicianDetailContainer({ isPending = false }: { isPending?: boolean }) {
  const router = useRouter();
  const { trigger, getValues, setValue, reset, watch } = useFormContext<CreateAppointmentSchema>();

  // ── Real API ─────────────────────────────────────────────────────
  const { clinicians, isLoading: loadingClinicians } = useGetAllClinicianQuery({
    pageSize:   100,
    pageNumber: 1,
  });

  // ── Watch form values ────────────────────────────────────────────
  const selectedClinicianId  = watch("clinicianId");
  const selectedRoomId       = watch("roomId");
  const selectedTreatmentId  = watch("treatmentId");

  // ── UI state ─────────────────────────────────────────────────────
  const [isModalOpen,              setIsModalOpen]              = useState(false);
  const [isPatientModalOpen,       setIsPatientModalOpen]       = useState(false);
  const [showReviewModal,          setShowReviewModal]          = useState(false);
  const [showBookingSuccessModal,  setShowBookingSuccessModal]  = useState(false);
  const [bookingData,              _setBookingData]             = useState<any>(null);
  const [isExistingPatient,        setIsExistingPatient]        = useState(true);
  const [bookOnSpecificDate,       setBookOnSpecificDate]       = useState(false);
  const [bookWithSpecificDoctor,   setBookWithSpecificDoctor]   = useState(true);
  const [bookRoomAllocation,       setBookRoomAllocation]       = useState(false);
  const [selectedPatient,          setSelectedPatient]          = useState<any>(null);
  const [selectedSlot,             setSelectedSlot]             = useState<string | null>(null);
  const [showPatientDetails,       setShowPatientDetails]       = useState(false);
  const [selectedDate,             setSelectedDate]             = useState<Date | null>(null);
  const [selectedDateId,           setSelectedDateId]           = useState("");
  const [showCalendarIcon,         setShowCalendarIcon]         = useState(true);
  const [calendarDate,             setCalendarDate]             = useState<Date | undefined>(undefined);

  const [, setClinicianSearchDate] = useQueryState("clinicianSearchDate", { defaultValue: "" });

  // ── Find selected clinician from real data ───────────────────────
  const selectedClinician = clinicians.find(c => c.clinicianId === selectedClinicianId);
  const selectedClinicianName = selectedClinician?.clinicianName ?? "";
  const selectedDepartmentName = selectedClinician?.medicalDepartmentName ?? "";
  const dynamicDates = useMemo(() => {
    const today = new Date();
    const dates = [
      { id: "today",    label: "Today",    date: today },
      { id: "tomorrow", label: "Tomorrow", date: addDays(today, 1) },
    ];
    for (let i = 2; i < 9; i++) {
      const date = addDays(today, i);
      dates.push({
        id:    `day-${i}`,
        label: `${format(date, "d")} ${format(date, "EEE")} ${format(date, "MMM")}`,
        date,
      });
    }
    return dates;
  }, []);

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
    setCalendarDate(date);
    setValue("bookedInfo.slotDate", formatDateToDDMMYYYY(date.toISOString()));
    const day   = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year  = date.getFullYear();
    setClinicianSearchDate(`${day}/${month}/${year}`);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleDateButtonClick = (dateId: string) => {
    setSelectedDateId(dateId);
    const selectedDateObj = dynamicDates.find(d => d.id === dateId)?.date;
    if (selectedDateObj) handleDateSelected(selectedDateObj);
  };

  const resetSelections = () => {
    setSelectedSlot(null);
    setSelectedDate(null);
    setSelectedDateId("");
    setCalendarDate(undefined);
    setShowCalendarIcon(true);
    setClinicianSearchDate("");
    setValue("bookedInfo", { slotDate: "", rotaName: "", slots: [] });
  };

  useEffect(() => {
    setClinicianSearchDate("");
  }, [setClinicianSearchDate]);

  const handleSaveAndNext = async () => {
    if (!selectedClinicianId) {
      toast.error("Please select a clinician before moving to next step");
      return;
    }

    const slots = getValues("bookedInfo.slots");
    if (!slots || slots.length === 0) {
      toast.error("Please select an appointment slot");
      return;
    }

    const isValid = await trigger(
      ["clinicianId", "bookedInfo.slotDate"],
      { shouldFocus: true },
    );

    if (!isValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setShowPatientDetails(true);
  };

  const handleReview = async () => {
    try {
      const values = getValues();

      const emiratesId = values.patientInfo?.emiratesId;
      if (emiratesId) {
        const emiratesIdRegex = /^\d{3}-\d{4}-\d{7}-\d$/;
        if (!emiratesIdRegex.test(emiratesId)) {
          toast.error("Emirates ID must be in format: XXX-XXXX-XXXXXXX-X");
          return;
        }
      }

      if (values.patientInfo?.patientsTitle) {
        const getTitleId = (title: string): number => {
          switch (title) {
            case "Mr":  return 1;
            case "Mrs": return 2;
            case "Ms":  return 3;
            case "Dr":  return 4;
            default:    return 0;
          }
        };
        setValue("patientInfo.patientTitle", getTitleId(values.patientInfo.patientsTitle));
      }

      if (!values.bookedInfo?.slotDate?.trim()) {
        toast.error("Slot date cannot be empty");
        return;
      }

      if (!values.bookedInfo?.slots?.length) {
        toast.error("Please ensure you have selected a valid appointment slot");
        return;
      }

      if (values.patientInfo?.dateOfBirth) {
        setValue("patientInfo.dateOfBirth", formatDateToDDMMYYYY(values.patientInfo.dateOfBirth));
      }

      setValue("bookedInfo.slotDate",     formatDateToDDMMYYYY(values.bookedInfo.slotDate));

      setShowReviewModal(true);
    }
    catch {
      toast.error("An error occurred while processing your request");
    }
  };

  const handleBookAppointment = () => {
    const values = getValues();

    // ── Slot is always required ───────────────────────────────────
    if (!values.bookedInfo?.slots?.length) {
      toast.error("Please select a valid appointment slot");
      return;
    }

    const existingPatientId = values.patientId ?? "";
    const isExisting = existingPatientId.length > 0;

    if (isExisting) {
      // ── EXISTING PATIENT: only patientId is needed, skip DOB/Emirates checks ──
      setValue("bookedInfo.slotDate", formatDateToDDMMYYYY(values.bookedInfo.slotDate));
    } else {
      // ── NEW PATIENT: validate Emirates ID format if provided ──────
      const emiratesId = values.patientInfo?.emiratesId;
      if (emiratesId) {
        const emiratesIdRegex = /^\d{3}-\d{4}-\d{7}-\d$/;
        if (!emiratesIdRegex.test(emiratesId)) {
          toast.error("Emirates ID must be in format: XXX-XXXX-XXXXXXX-X");
          return;
        }
      }

      // ── NEW PATIENT: DOB is required ─────────────────────────────
      if (!values.patientInfo?.dateOfBirth?.trim()) {
        toast.error("Date of Birth cannot be empty");
        return;
      }

      setValue("patientInfo.dateOfBirth", formatDateToDDMMYYYY(values.patientInfo.dateOfBirth));
      setValue("bookedInfo.slotDate",     formatDateToDDMMYYYY(values.bookedInfo.slotDate));
    }

    document.querySelector<HTMLFormElement>("form")?.requestSubmit();
  };

  const handleBack = () => {
    if (showPatientDetails) setShowPatientDetails(false);
    else router.back();
  };

  const [token] = useQueryState("token", { defaultValue: "" });
  useEffect(() => {
    if (token) reset();
  }, [reset, token]);

  // ── Patient step ─────────────────────────────────────────────────
  if (showPatientDetails) {
    return (
      <>
       <PreviewAppointmentModal
    isOpen={showReviewModal}
    onClose={() => setShowReviewModal(false)}
    onBookAppointment={handleBookAppointment}
    isCreatingAppointment={isPending}
    clinicianName={selectedClinicianName}
    departmentName={selectedDepartmentName}
  />
        <BookingSuccessModal
          isOpen={showBookingSuccessModal}
          onClose={() => setShowBookingSuccessModal(false)}
          bookingData={bookingData}
        />
        <PatientDetails
          isExistingPatient={isExistingPatient}
          setIsExistingPatient={setIsExistingPatient}
          onBack={handleBack}
          onReview={handleReview}
        />
      </>
    );
  }

  return (
    <section className="min-h-screen">
      <div>
        <div className="bg-white rounded-md p-6 border border-gray-200">

          {/* ── Booking Type ── */}
          <div className="space-y-3 mb-6">
            <FormLabel>
              Select Booking Type
              <span className="text-red-500">*</span>
            </FormLabel>
            <RadioGroup
              defaultValue="doctor"
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              onValueChange={(value) => {
                resetSelections();
                setBookWithSpecificDoctor(value === "doctor");
                setBookOnSpecificDate(value === "date");
                setBookRoomAllocation(value === "room");
                if (value !== "room") setSelectedPatient(null);
              }}
            >
              <div>
                <RadioGroupItem value="doctor" id="doctor" className="peer sr-only" />
                <Label
                  htmlFor="doctor"
                  className={cn(
                    "flex items-center justify-start rounded-md border border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-blue-500 cursor-pointer transition-all duration-200",
                    bookWithSpecificDoctor ? "border-blue-500 bg-blue-50" : "",
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Book with specific Doctor</p>
                    <p className="text-sm text-slate-500">Choose a doctor and view their available slots</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="date" id="date" className="peer sr-only" />
                <Label
                  htmlFor="date"
                  className={cn(
                    "flex items-center justify-start rounded-md border border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-teal-500 cursor-pointer transition-all duration-200",
                    bookOnSpecificDate ? "border-teal-500 bg-teal-50" : "",
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Book on specific Date</p>
                    <p className="text-sm text-slate-500">Choose a date to see all available doctors</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="room" id="room" className="peer sr-only" />
                <Label
                  htmlFor="room"
                  className={cn(
                    "flex items-center justify-start rounded-md border border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-indigo-500 cursor-pointer transition-all duration-200",
                    bookRoomAllocation ? "border-indigo-500 bg-indigo-50" : "",
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <Bed className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Room Allocation</p>
                    <p className="text-sm text-slate-500">Assign a room for specific patient</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* ════════════════════════════════════════════════════════
              BOOK WITH SPECIFIC DOCTOR
              Order: 1. Clinician → 2. Appointment Details → 3. Slots
          ════════════════════════════════════════════════════════ */}
          {bookWithSpecificDoctor && (
            <>
              {/* 1. Select Clinician */}
              <div className="mb-6">
                <FormLabel className="mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Select Clinician
                  <span className="text-red-500">*</span>
                </FormLabel>
                <button
                  className="w-full p-4 flex items-center justify-between cursor-pointer border border-gray-400 hover:border-primary transition-all duration-200 rounded-md"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  disabled={loadingClinicians}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <BriefcaseMedical className="h-6 w-6 text-white" />
                    </div>
                    {selectedClinician
                      ? (
                          <div className="ml-4 text-left">
                            <p className="text-slate-800 font-medium">
                              {selectedClinician.clinicianName} — Click to change
                            </p>
                            <p className="text-sm text-slate-500">
                              {selectedClinician.medicalDepartmentName}
                            </p>
                          </div>
                        )
                      : (
                          <div className="ml-4 text-left">
                            <p className="text-slate-800 font-medium">
                              {loadingClinicians ? "Loading clinicians..." : "Select Clinician"}
                            </p>
                            <p className="text-sm text-slate-500">
                              Choose a doctor to view their available slots
                            </p>
                          </div>
                        )}
                  </div>
                  <div className="bg-primary text-white rounded-full p-2">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </button>
              </div>

              {/* 2. Appointment Details — Room + Treatment + Department
                  Must be selected BEFORE slots load */}
              {selectedClinicianId && (
                <div className="mb-6">
                  <AppointmentDetails />
                </div>
              )}

              {/* 3. Slots — only fires when clinician + room + treatment all set */}
              {selectedClinicianId && (
                <div className="mb-10">
                  <SlotSelection
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    clinicianId={selectedClinicianId}
                    roomId={selectedRoomId || ""}
                    treatmentId={selectedTreatmentId || ""}
                  />
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════════
              BOOK ON SPECIFIC DATE
              Order: 1. Date picker → 2. Clinician modal → 3. Slots
          ════════════════════════════════════════════════════════ */}
          {bookOnSpecificDate && (
            <div className="mb-10">
              <FormLabel className="mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Select Date
                <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
                <div className="flex items-center xl:flex-row flex-col gap-2 w-full xl:w-auto">
                  <DatePickerButton
                    fromDate={new Date()}
                    date={calendarDate}
                    onDateChange={(date: Date | undefined) => {
                      if (date) {
                        handleDateSelected(date);
                        setShowCalendarIcon(false);
                      }
                    }}
                  >
                    <button type="button" className="p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer">
                      {calendarDate && !showCalendarIcon
                        ? (
                            <div className="text-white bg-blue-800 rounded-md px-4 py-1 h-8 font-medium text-sm flex items-center justify-center w-[120px]">
                              {format(calendarDate, "dd EEE MMM")}
                            </div>
                          )
                        : (
                            <div className="text-primary rounded-md px-4 py-1 h-8 font-medium text-sm flex items-center justify-center border border-primary w-[240px]">
                              Custom Date
                            </div>
                          )}
                    </button>
                  </DatePickerButton>

                  <div className="w-full xl:w-auto overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                      {dynamicDates.map(date => (
                        <Button
                          type="button"
                          key={date.id}
                          variant={selectedDateId === date.id ? "default" : "outline"}
                          className={cn(
                            "h-8 rounded-md whitespace-nowrap",
                            selectedDateId === date.id ? "bg-primary hover:bg-primary/80" : "text-gray-600",
                          )}
                          onClick={() => handleDateButtonClick(date.id)}
                        >
                          {date.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedClinicianId && (
                <div className="mt-6">
                  <SlotSelection
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    clinicianId={selectedClinicianId}
                    roomId={selectedRoomId || ""}
                    treatmentId={selectedTreatmentId || ""}
                    preselectedDate={selectedDate || undefined}
                    hideCalendar={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              ROOM ALLOCATION
          ════════════════════════════════════════════════════════ */}
          {bookRoomAllocation && (
            <div className="mb-10">
              <div className="mb-6">
                <FormLabel className="mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Select Patient
                  <span className="text-red-500">*</span>
                </FormLabel>
                <button
                  className="w-full p-4 flex items-center justify-between cursor-pointer border border-gray-400 hover:border-primary transition-all duration-200 rounded-md"
                  type="button"
                  onClick={() => setIsPatientModalOpen(true)}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    {selectedPatient
                      ? (
                          <div className="ml-4 text-left">
                            <p className="text-slate-800 font-medium">
                              {selectedPatient.name} — Click to change
                            </p>
                            <p className="text-sm text-slate-500">{selectedPatient.emrNumber}</p>
                          </div>
                        )
                      : (
                          <div className="ml-4 text-left">
                            <p className="text-slate-800 font-medium">Select Patient</p>
                            <p className="text-sm text-slate-500">Choose a patient to allocate a room</p>
                          </div>
                        )}
                  </div>
                  <div className="bg-primary text-white rounded-full p-2">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </button>
              </div>

              {selectedPatient && (
                <div className="mt-8">
                  <RoomAllocationFlow patient={selectedPatient} />
                </div>
              )}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="border-t border-gray-200 pt-6">
            {!bookRoomAllocation && (
              <div className="flex justify-end gap-3">
                <Button type="button" onClick={handleSaveAndNext}>
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ClinicianModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSelect={patient => setSelectedPatient(patient)}
        selectedPatientId={selectedPatient?.id}
      />
      <BookingSuccessModal
        isOpen={showBookingSuccessModal}
        onClose={() => setShowBookingSuccessModal(false)}
        bookingData={bookingData}
      />
    </section>
  );
}