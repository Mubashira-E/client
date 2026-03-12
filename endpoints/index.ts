export const authEndpoints = {
  login: "/api/v1/auth/login",
  logout: "/api/v1/auth/logout",
  userDetails: "/api/v1/auth/current-user",
};

export const userEndpoints = {
  getUsers: "/api/v1/auth",
  createUser: "/api/v1/auth",
  getUserById: "/api/v1/auth",
  updateUser: "/api/v1/auth",
  updateUserStatus: "/api/v1/auth",
};

export const generalEndpoints = {
  getLanguage: "/api/v1/language",
  getLanguageById: "/api/v1/language",
  createLanguage: "/api/v1/language",
  updateLanguage: "/api/v1/language",
  getLanguageDropdown: "/api/v1/language/dropdown",

  getMedicalDepartment: "/api/v1/medicaldepartment",
  getMedicalDepartmentById: "/api/v1/medicaldepartment",
  createMedicalDepartment: "/api/v1/medicaldepartment",
  patchMedicalDepartment: "/api/v1/medicaldepartment",
  deleteMedicalDepartment: "/api/v1/medicaldepartment",
  getMedicalDepartmentDropdown: "/api/v1/medicaldepartment/dropdown",

  getNationality: "/api/v1/nationality",
  getNationalityById: "/api/v1/nationality",
  createNationality: "/api/v1/nationality",
  getNationalityDropdown: "/api/v1/nationality/dropdown",

  getClinician: "/api/v1/clinician",
  getClinicianById: "/api/v1/clinician",
  createClinician: "/api/v1/clinician",
  updateClinician: "/api/v1/clinician",
  patchClinician: "/api/v1/clinician",
  deleteClinician: "/api/v1/clinician",

  getFacility: "/api/v1/facility",
  getFacilityById: "/api/v1/facility",
  createFacility: "/api/v1/facility",
  updateFacility: "/api/v1/facility",

  getRegulatory: "/api/v1/regulatory",
  getRegulatoryById: "/api/v1/regulatory",
  createRegulatory: "/api/v1/regulatory",
  updateRegulatory: "/api/v1/regulatory",

  getTreatment: "/api/v1/treatment",
  getTreatmentById: "/api/v1/treatment",
  createTreatment: "/api/v1/treatment",
  updateTreatment: "/api/v1/treatment",
  patchTreatment: "/api/v1/treatment",
  deleteTreatment: "/api/v1/treatment",

  importVisit: "/api/v1/visit/import",
  importTreatmentSession: "/api/v1/treatmentSession/import",
  importTreatment: "/api/v1/treatment/import",
  importPackage: "/api/v1/package/import",

  getSubServiceClassification: "/api/v1/sub-service-classification",
  getSubServiceClassificationById: "/api/v1/sub-service-classification",
  createSubServiceClassification: "/api/v1/sub-service-classification",
  updateSubServiceClassification: "/api/v1/sub-service-classification",
  deleteSubServiceClassification: "/api/v1/sub-service-classification",

  getServiceClassification: "/api/v1/service-classification",
  getServiceClassificationById: "/api/v1/service-classification",
  createServiceClassification: "/api/v1/service-classification",
  updateServiceClassification: "/api/v1/service-classification",
  // Patients
  getPatient: "/api/v1/patient",
  getPatientById: "/api/v1/patient",

  // Visits
  getVisit: "/api/v1/visit",
  getVisitById: "/api/v1/visit",

  // Jobs
  getJobStatus: "/api/v1/jobstatus",
  getJobById: "/api/v1/jobstatus",

  // Package Plans
  getPackage: "/api/v1/package",
  getPackageById: "/api/v1/package",
  createPackage: "/api/v1/package",
  updatePackage: "/api/v1/package",
  patchPackage: "/api/v1/package",
  deletePackage: "/api/v1/package",

  // Package Dependencies
  getTreatmentDropdown: "/api/v1/treatment/treatments/dropdown",
  getClinicianDropdown: "/api/v1/clinician/dropdown",
  getRoomTypeDropdown: "/api/v1/roomtype/dropdown",
  getDurationUnits: "/api/v1/treatment/duration-units",

  // Wellness Program
  getWellnessProgram: "/api/v1/wellnessprogram",
  getWellnessProgramById: "/api/v1/wellnessprogram",
  createWellnessProgram: "/api/v1/wellnessprogram",
  updateWellnessProgram: "/api/v1/wellnessprogram",
  patchWellnessProgram: "/api/v1/wellnessprogram",
  deleteWellnessProgram: "/api/v1/wellnessprogram",
  importWellnessProgram: "/api/v1/wellnessprogram/import",
};

export const roomEndpoints = {
  getRoomType: "/api/v1/roomtype",
  getRoomTypeById: "/api/v1/roomtype",
  createRoomType: "/api/v1/roomtype",
  updateRoomType: "/api/v1/roomtype",
  patchRoomType: "/api/v1/roomtype",
  deleteRoomType: "/api/v1/roomtype",
  // Rooms
  getRoom: "/api/v1/room",
  getRoomById: "/api/v1/room",
  createRoom: "/api/v1/room",
  updateRoom: "/api/v1/room",
  patchRoom: "/api/v1/room",
  deleteRoom: "/api/v1/room",
};

export const inventoryEndpoints = {
  getInventoryItem: "/api/v1/inventoryitem",
  getInventoryItemById: "/api/v1/inventoryitem",
  createInventoryItem: "/api/v1/inventoryitem",
  updateInventoryItem: "/api/v1/inventoryitem",
  patchInventoryItem: "/api/v1/inventoryitem",
  deleteInventoryItem: "/api/v1/inventoryitem",
  getUnits: "/api/v1/inventoryitem/units",
  // Item Category
  getItemCategory: "/api/v1/itemcategory",
  getItemCategoryById: "/api/v1/itemcategory",
  createItemCategory: "/api/v1/itemcategory",
  updateItemCategory: "/api/v1/itemcategory",
  patchItemCategory: "/api/v1/itemcategory",
  deleteItemCategory: "/api/v1/itemcategory",
};

export const roleEndpoints = {
  getRole: "/api/v1/role",
  getRoleById: "/api/v1/role",
  createRole: "/api/v1/role",
  updateRole: "/api/v1/role",
  deleteRole: "/api/v1/role",
  patchRoleStatus: "/api/v1/role",
  getPermissions: "/api/v1/permission/all",
};
export const visitEndpoints = {
  createVisit:      "/api/v1/visit",
  rescheduleVisit:  "/api/v1/visit/reschedule",
  changeStatus:     "/api/v1/visit/status",
  importVisit:      "/api/v1/visit/import",
  getDailyQueue:    "/api/v1/visit/daily-queue",
  getAvailableSlots: "/api/v1/slot/available",
};
