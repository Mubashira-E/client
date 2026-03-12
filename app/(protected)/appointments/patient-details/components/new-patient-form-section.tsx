"use client";

import type { CreateAppointmentSchema } from "../../book-appointment/schema/schema";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useGetAllNationalityQuery } from "@/queries/general/nationality/useGetAllNationalityQuery";

type PatientInfo = {
  patientTitle: string;
  patientsTitle: string;
  firstName: string;
  middleName: string;
  lastName: string;
  genderId: number;
  gender: string;
  maritalStatusId: number;
  maritalStatus: string;
  emiratesId: string;
  dateOfBirth: string;
  mobileNo: string;
  email: string;
  patientAddress: string;
  countryId: number;
  countryName: string;
};

type NewPatientFormSectionProps = {
  initialData?: PatientInfo;
};

const settingsFields = [
  { key: "patientsTitle", label: "Patient Title" },
  { key: "firstName", label: "First Name" },
  { key: "middleName", label: "Middle Name" },
  { key: "lastName", label: "Last Name" },
  { key: "genderId", label: "Gender" },
  { key: "maritalStatusId", label: "Marital Status" },
  { key: "emiratesId", label: "Emirates ID" },
  { key: "countryId", label: "Country" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "mobileNo", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "patientAddress", label: "Patient Address" },
] as const;

type FieldKey = (typeof settingsFields)[number]["key"];

function formatToHTMLDateValue(dateString: string): string {
  try {
    if (!dateString)
      return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString))
      return dateString;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime()))
      return "";
    return date.toISOString().split("T")[0];
  }
  catch {
    return "";
  }
}

function formatEmiratesId(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0)
    return "";
  if (digits.length <= 3)
    return digits;
  if (digits.length <= 7)
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 14)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 14)}-${digits.slice(14, 15)}`;
}

const genderData = [
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
];

const maritalStatusData = [
  { id: 1, name: "Single" },
  { id: 2, name: "Married" },
  { id: 3, name: "Divorced" },
  { id: 4, name: "Widowed" },
];

export function NewPatientFormSection({
  initialData,
}: NewPatientFormSectionProps) {
  const { control, trigger, setValue }
    = useFormContext<CreateAppointmentSchema>();

  const { nationalities, isLoading: loadingNationalities }
    = useGetAllNationalityQuery({
      pageSize: 300,
      pageNumber: 1,
    });

  const [fieldConfig, setFieldConfig] = useState<Record<FieldKey, "m" | "o">>({
    patientsTitle: "m",
    firstName: "m",
    middleName: "o",
    lastName: "m",
    genderId: "m",
    maritalStatusId: "o",
    emiratesId: "m",
    countryId: "m",
    dateOfBirth: "m",
    mobileNo: "m",
    email: "o",
    patientAddress: "o",
  });

  const toggleField = (key: FieldKey) => {
    setFieldConfig(prev => ({
      ...prev,
      [key]: prev[key] === "m" ? "o" : "m",
    }));
  };

  // Signal to book-appointment-form that this is a new patient creation
  useEffect(() => {
    setValue("patientId", "new");
  }, [setValue]);

  useEffect(() => {
    if (initialData) {
      setValue("patientInfo.patientTitle", Number(initialData.patientTitle));
      setValue("patientInfo.patientsTitle", initialData.patientsTitle);
      setValue("patientInfo.firstName", initialData.firstName);
      setValue("patientInfo.middleName", initialData.middleName);
      setValue("patientInfo.lastName", initialData.lastName);
      setValue("patientInfo.genderId", initialData.genderId);
      setValue("patientInfo.maritalStatusId", initialData.maritalStatusId);
      setValue("patientInfo.emiratesId", initialData.emiratesId);
      setValue("patientInfo.dateOfBirth", initialData.dateOfBirth);
      setValue("patientInfo.mobileNo", initialData.mobileNo);
      setValue("patientInfo.email", initialData.email);
      setValue("patientInfo.patientAddress", initialData.patientAddress);
      setValue("patientInfo.countryName", initialData.countryName);
    }
  }, [initialData, setValue]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Field Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Toggle mandatory (m) / optional (o).
                </p>
              </div>
              <ScrollArea className="h-75 pr-4">
                <div className="grid gap-2">
                  {settingsFields.map(f => (
                    <div
                      key={f.key}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <span className="text-sm">{f.label}</span>
                      <Button
                        variant={
                          fieldConfig[f.key] === "m" ? "default" : "outline"
                        }
                        size="sm"
                        className="w-10 h-8 font-mono"
                        onClick={() => toggleField(f.key)}
                      >
                        {fieldConfig[f.key]}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Patient Title */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.patientsTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Patient Title
                  {fieldConfig.patientsTitle === "m" && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const titleMap: Record<string, number> = {
                        Mr: 1,
                        Mrs: 2,
                        Ms: 3,
                        Dr: 4,
                      };
                      const id = titleMap[value] ?? 0;
                      setValue("patientInfo.patientTitle", id);
                      setValue("patientInfo.patientTitleId", id);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name
                  {" "}
                  {fieldConfig.firstName === "m" && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter First Name"
                    {...field}
                    onBlur={() => trigger("patientInfo.firstName")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Middle Name */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Middle Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name
                  {" "}
                  {fieldConfig.lastName === "m" && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Last Name"
                    {...field}
                    onBlur={() => trigger("patientInfo.lastName")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Gender */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.genderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Gender
                  {" "}
                  {fieldConfig.genderId === "m" && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      setValue("patientInfo.genderId", Number(value));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderData.map(item => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
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

        {/* Marital Status */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.maritalStatusId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={value => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {maritalStatusData.map(item => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
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

        {/* Emirates ID */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.emiratesId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Emirates ID
                  {" "}
                  {fieldConfig.emiratesId === "m" && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="784-1992-1234567-1"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(formatEmiratesId(e.target.value));
                      trigger("patientInfo.emiratesId");
                    }}
                    onBlur={() => trigger("patientInfo.emiratesId")}
                    maxLength={19}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Country — stores nationality GUID in countryName field
            book-appointment-form reads this as nationalityId for POST /api/v1/patient */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.countryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Country
                  {" "}
                  {fieldConfig.countryId === "m" && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={loadingNationalities}
                    value={field.value ?? ""}
                    onValueChange={(guid) => {
                      // Store GUID directly — used as nationalityId in patient creation
                      field.onChange(guid);
                      setValue("patientInfo.countryId", 0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingNationalities ? "Loading..." : "Select country"
                        }
                      >
                        {field.value
                          ? (nationalities?.find(
                              (n: any) => n.nationalityId === field.value,
                            )?.nationalityName ?? "Select country")
                          : "Select country"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-96 overflow-y-auto">
                      {nationalities?.map((item: any) => (
                        <SelectItem
                          key={item.nationalityId}
                          value={item.nationalityId}
                        >
                          {item.nationalityName}
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

        {/* Date of Birth */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date of Birth
                  {" "}
                  {fieldConfig.dateOfBirth === "m" && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={formatToHTMLDateValue(field.value ?? "")}
                    onChange={(e) => {
                      const htmlDate = e.target.value;
                      if (htmlDate) {
                        const [year, month, day] = htmlDate.split("-");
                        field.onChange(`${day}/${month}/${year}`);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.mobileNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number
                  {" "}
                  {fieldConfig.mobileNo === "m" && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    smartCaret={true}
                    defaultCountry="AE"
                    international={true}
                    placeholder="Enter Mobile Number"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      trigger("patientInfo.mobileNo");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Email Address"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Patient Address */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="patientInfo.patientAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
