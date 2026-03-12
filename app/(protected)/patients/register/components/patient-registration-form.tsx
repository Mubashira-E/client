"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/lib/axios";
import { useGetAllNationalityQuery } from "@/queries/general/nationality/useGetAllNationalityQuery";

// ─── Zod Schema (mirrors POST /api/v1/patient body) ──────────────────────────

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.string().min(1, "Age is required"),
  mobileNumber: z.string().min(7, "Mobile number is required"),
  emiratesId: z
    .string()
    .optional()
    .refine(
      val => !val || /^\d{3}-\d{4}-\d{7}-\d$/.test(val),
      "Format: 784-1234-1234567-1",
    ),
  genderId: z.string().min(1, "Gender is required"),
  nationalityId: z.string().min(1, "Nationality is required"),
  address: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type PatientFormValues = z.infer<typeof patientSchema>;

// API payload type — converts string fields to numbers before POST
type PatientPayload = {
  firstName: string;
  lastName: string;
  age: number;
  mobileNumber: string;
  emiratesId?: string;
  genderId: number;
  nationalityId: string;
  address?: string;
  email?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEmiratesId(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3)
    return digits;
  if (digits.length <= 7)
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 14)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 14)}-${digits.slice(14, 15)}`;
}

const genderOptions = [
  { id: 1, label: "Male" },
  { id: 2, label: "Female" },
  { id: 3, label: "Other" },
];

// ─── Mutation ─────────────────────────────────────────────────────────────────

function useCreatePatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatientPayload) => api.post("/api/v1/patient", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/patient"] });
    },
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message)
    return null;
  return (
    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700 mb-1.5"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400",
    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
    hasError
      ? "border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400"
      : "border-slate-200 bg-white hover:border-slate-300",
  ].join(" ");
}

function selectClass(hasError: boolean) {
  return `${inputClass(hasError)} appearance-none cursor-pointer`;
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function PatientRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const { nationalities, isLoading: loadingNationalities }
    = useGetAllNationalityQuery({ pageSize: 300, pageNumber: 1 });

  const { mutateAsync, isPending } = useCreatePatientMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      emiratesId: "",
      address: "",
      email: "",
      nationalityId: "",
    },
  });

  const emiratesIdValue = watch("emiratesId") ?? "";

  async function onSubmit(values: PatientFormValues) {
    try {
      const payload: PatientPayload = {
        ...values,
        age: Number(values.age),
        genderId: Number(values.genderId),
      };
      await mutateAsync(payload);
      setSubmittedName(`${values.firstName} ${values.lastName}`);
      setSubmitted(true);
      reset();
    }
    catch {
      // error handled by mutation
    }
  }

  // ── Success Screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Patient Registered Successfully
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          <span className="font-medium text-slate-700">{submittedName}</span>
          {" "}
          has been added to the system.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Register Another Patient
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Patient Registration
          </h2>
          <p className="text-xs text-slate-500">
            Fill in the patient details below
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="p-6 space-y-6">
          {/* Section: Basic Info */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName" required>
                  First Name
                </Label>
                <input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="e.g. Ahmed"
                  className={inputClass(!!errors.firstName)}
                />
                <FieldError message={errors.firstName?.message} />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName" required>
                  Last Name
                </Label>
                <input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="e.g. Al Mansoori"
                  className={inputClass(!!errors.lastName)}
                />
                <FieldError message={errors.lastName?.message} />
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age" required>
                  Age
                </Label>
                <input
                  id="age"
                  type="number"
                  min={0}
                  max={150}
                  {...register("age", { valueAsNumber: true })}
                  placeholder="e.g. 32"
                  className={inputClass(!!errors.age)}
                />
                <FieldError message={errors.age?.message} />
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor="genderId" required>
                  Gender
                </Label>
                <select
                  id="genderId"
                  {...register("genderId", { valueAsNumber: true })}
                  className={selectClass(!!errors.genderId)}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.genderId?.message} />
              </div>

              {/* Emirates ID */}
              <div>
                <Label htmlFor="emiratesId">Emirates ID</Label>
                <input
                  id="emiratesId"
                  value={emiratesIdValue}
                  onChange={e =>
                    setValue("emiratesId", formatEmiratesId(e.target.value), {
                      shouldValidate: true,
                    })}
                  placeholder="784-1234-1234567-1"
                  maxLength={18}
                  className={inputClass(!!errors.emiratesId)}
                />
                <FieldError message={errors.emiratesId?.message} />
              </div>

              {/* Nationality */}
              <div>
                <Label htmlFor="nationalityId" required>
                  Nationality
                </Label>
                <select
                  id="nationalityId"
                  {...register("nationalityId")}
                  disabled={loadingNationalities}
                  className={selectClass(!!errors.nationalityId)}
                >
                  <option value="">
                    {loadingNationalities ? "Loading…" : "Select nationality"}
                  </option>
                  {nationalities.map((n: any) => (
                    <option key={n.nationalityId} value={n.nationalityId}>
                      {n.nationalityName}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.nationalityId?.message} />
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Section: Contact */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Mobile */}
              <div>
                <Label htmlFor="mobileNumber" required>
                  Mobile Number
                </Label>
                <input
                  id="mobileNumber"
                  {...register("mobileNumber")}
                  placeholder="+971 50 000 0000"
                  className={inputClass(!!errors.mobileNumber)}
                />
                <FieldError message={errors.mobileNumber?.message} />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="patient@example.com"
                  className={inputClass(!!errors.email)}
                />
                <FieldError message={errors.email?.message} />
              </div>

              {/* Address */}
              <div className="md:col-span-2 lg:col-span-1">
                <Label htmlFor="address">Address</Label>
                <input
                  id="address"
                  {...register("address")}
                  placeholder="e.g. Dubai, UAE"
                  className={inputClass(!!errors.address)}
                />
                <FieldError message={errors.address?.message} />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Fields marked
            {" "}
            <span className="text-red-500 font-medium">*</span>
            {" "}
            are required
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending
              ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering…
                  </>
                )
              : (
                  <>
                    Register Patient
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
          </button>
        </div>
      </form>
    </div>
  );
}
