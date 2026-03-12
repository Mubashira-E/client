type AddClinicianLicenseHeaderProps = {
  clinicianLicenseId?: string;
};

export function AddClinicianLicenseHeader({ clinicianLicenseId }: AddClinicianLicenseHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {clinicianLicenseId
            ? "Edit Clinician License"
            : "Add Clinician License"}
        </h1>
        <p className="text-gray-600 text-sm">
          {clinicianLicenseId
            ? "Update an existing clinician license"
            : "Create a new clinician license entry"}
        </p>
      </div>
    </div>
  );
}
