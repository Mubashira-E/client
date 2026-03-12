export type ClinicianLicenseResponse = {
  clinicianLicenseId: number;
  clinician: string;
  clinicianLicense: string;
  medicalDepartmentID: number;
  medicalDepartment: string;
  issuedDate: string;
  expiryDate: string;
  isNurse: boolean;
  isExternal: boolean;
  externalFacilityID: number;
  externalFacilityName: string;
  facilityID: number;
  regulatoryID: number;
  major: string;
  auhProfession: string;
  category: string;
  clinicianProfilePath: string;
  nationalityID: number;
  nationality: string;
  genderId: number;
  gender: string;
  experience: number;
  description: string;
  signatureUrl: string;
  languages: string[];
};

export type ClinicianLicenseRequest = {
  clinician: string;
  clinicianLicense: string;
  medicalDepartmentID: number;
  issuedDate: string;
  expiryDate: string;
  isNurse: boolean;
  isExternal: boolean;
  externalFacilityID: number;
  facilityID: number;
  regulatoryID: number;
  major: string;
  auhProfession: string;
  category: string;
  clinicianProfilePath: string;
  nationalityID: number;
  genderId: number;
  experience: number;
  description: string;
  signatureUrl: string;
  languageIds: number[];
};

export type ClinicianLicenseApiResponse = {
  status: string;
  message: string;
  data: ClinicianLicenseResponse[];
  pageSize: number;
  pageNumber: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  headers: any;
};

export type ClinicianLicenseSingleApiResponse = {
  status: string;
  message: string;
  data: ClinicianLicenseResponse;
  errorCode: string;
  fieldName: string;
};

export type DropdownOption = {
  id: number;
  name: string;
};

export type LanguageDropdownResponse = {
  languageId: number;
  languageName: string;
};

export type RegulatoryDropdownResponse = {
  regulatoryId: number;
  regulatory: string;
};

export type FacilityDropdownResponse = {
  facilityId: number;
  facility: string;
};

export type NationalityDropdownResponse = {
  nationalityId: number;
  nationality: string;
};

export type GenderDropdownResponse = {
  genderId: number;
  gender: string;
};

export type MedicalDepartmentDropdownResponse = {
  medicalDepartmentId: number;
  medicalDepartment: string;
  status: string;
};
