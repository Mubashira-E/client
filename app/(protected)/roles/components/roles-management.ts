"use client";

export type Role = {
  id: string;
  name: string;
  description: string;
  notes?: string;
  permissions: string[];
  usersCount: number;
  createdAt: string;
  isSystem: boolean;
  isActive: boolean;
};

export type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export const defaultPermissions: Permission[] = [
  // Users Management
  { id: "users.read", name: "View Users", description: "View user profiles and lists", category: "Users" },
  { id: "users.create", name: "Create Users", description: "Create new user accounts", category: "Users" },
  { id: "users.update", name: "Update Users", description: "Modify user information", category: "Users" },
  { id: "users.delete", name: "Delete Users", description: "Remove user accounts", category: "Users" },
  // Roles Management
  { id: "roles.read", name: "View Roles", description: "View role configurations", category: "Roles" },
  { id: "roles.create", name: "Create Roles", description: "Create new roles", category: "Roles" },
  { id: "roles.update", name: "Update Roles", description: "Modify role permissions", category: "Roles" },
  { id: "roles.delete", name: "Delete Roles", description: "Remove roles", category: "Roles" },
  // Patients Management
  { id: "patients.read", name: "View Patients", description: "View patient records and information", category: "Patients" },
  { id: "patients.create", name: "Create Patients", description: "Register new patients", category: "Patients" },
  { id: "patients.update", name: "Update Patients", description: "Modify patient information", category: "Patients" },
  { id: "patients.delete", name: "Delete Patients", description: "Remove patient records", category: "Patients" },
  // Visits Management
  { id: "visits.read", name: "View Visits", description: "View patient visit records", category: "Visits" },
  { id: "visits.create", name: "Create Visits", description: "Create new visit records", category: "Visits" },
  { id: "visits.update", name: "Update Visits", description: "Modify visit information", category: "Visits" },
  { id: "visits.delete", name: "Delete Visits", description: "Remove visit records", category: "Visits" },
  // Treatments Management
  { id: "treatments.read", name: "View Treatments", description: "View treatment types and procedures", category: "Treatments" },
  { id: "treatments.create", name: "Create Treatments", description: "Add new treatment types", category: "Treatments" },
  { id: "treatments.update", name: "Update Treatments", description: "Modify treatment information", category: "Treatments" },
  { id: "treatments.delete", name: "Delete Treatments", description: "Remove treatment types", category: "Treatments" },
  // Rooms Management
  { id: "rooms.read", name: "View Rooms", description: "View room availability and details", category: "Rooms" },
  { id: "rooms.create", name: "Create Rooms", description: "Add new rooms", category: "Rooms" },
  { id: "rooms.update", name: "Update Rooms", description: "Modify room information", category: "Rooms" },
  { id: "rooms.delete", name: "Delete Rooms", description: "Remove rooms", category: "Rooms" },
  // Inventory Management
  { id: "inventory.read", name: "View Inventory", description: "View herbs, medicines, and supplies", category: "Inventory" },
  { id: "inventory.create", name: "Create Inventory", description: "Add new inventory items", category: "Inventory" },
  { id: "inventory.update", name: "Update Inventory", description: "Modify inventory stock and details", category: "Inventory" },
  { id: "inventory.delete", name: "Delete Inventory", description: "Remove inventory items", category: "Inventory" },
  // Clinicians Management
  { id: "clinicians.read", name: "View Clinicians", description: "View clinician profiles and schedules", category: "Clinicians" },
  { id: "clinicians.create", name: "Create Clinicians", description: "Add new clinicians", category: "Clinicians" },
  { id: "clinicians.update", name: "Update Clinicians", description: "Modify clinician information", category: "Clinicians" },
  { id: "clinicians.delete", name: "Delete Clinicians", description: "Remove clinician records", category: "Clinicians" },
  // Billing Management
  { id: "billing.read", name: "View Billing", description: "View billing and payment information", category: "Billing" },
  { id: "billing.create", name: "Create Bills", description: "Generate invoices and bills", category: "Billing" },
  { id: "billing.update", name: "Update Billing", description: "Modify billing information", category: "Billing" },
  { id: "billing.delete", name: "Delete Billing", description: "Remove billing records", category: "Billing" },
  // Reports & Analytics
  { id: "reports.read", name: "View Reports", description: "Access reports and analytics dashboard", category: "Reports" },
  // Settings
  { id: "settings.read", name: "View Settings", description: "View system settings", category: "Settings" },
  { id: "settings.update", name: "Update Settings", description: "Modify system settings", category: "Settings" },
];

export const defaultRoles: Role[] = [
  {
    id: "administrator",
    name: "Administrator",
    description: "Full system access with all permissions for hospital management",
    permissions: defaultPermissions.map(p => p.id),
    usersCount: 2,
    createdAt: "2024-01-15",
    isSystem: true,
    isActive: true,
  },
  {
    id: "doctor",
    name: "Doctor",
    description: "Ayurvedic physician with access to patient records, visits, and treatments",
    permissions: [
      "patients.read",
      "patients.create",
      "patients.update",
      "visits.read",
      "visits.create",
      "visits.update",
      "treatments.read",
      "clinicians.read",
      "inventory.read",
      "reports.read",
    ],
    usersCount: 8,
    createdAt: "2024-02-20",
    isSystem: true,
    isActive: true,
  },
  {
    id: "nurse",
    name: "Nurse",
    description: "Nursing staff with access to patient care and visit management",
    permissions: [
      "patients.read",
      "patients.update",
      "visits.read",
      "visits.create",
      "visits.update",
      "treatments.read",
      "rooms.read",
      "rooms.update",
      "inventory.read",
    ],
    usersCount: 15,
    createdAt: "2024-03-10",
    isSystem: false,
    isActive: true,
  },
  {
    id: "receptionist",
    name: "Receptionist",
    description: "Front desk staff managing appointments, patient registration, and room allocation",
    permissions: [
      "patients.read",
      "patients.create",
      "patients.update",
      "visits.read",
      "visits.create",
      "visits.update",
      "rooms.read",
      "rooms.update",
      "billing.read",
      "billing.create",
    ],
    usersCount: 5,
    createdAt: "2024-04-05",
    isSystem: false,
    isActive: true,
  },
  {
    id: "pharmacist",
    name: "Pharmacist",
    description: "Pharmacy staff managing herbs, medicines, and inventory",
    permissions: [
      "inventory.read",
      "inventory.create",
      "inventory.update",
      "patients.read",
      "visits.read",
      "treatments.read",
    ],
    usersCount: 4,
    createdAt: "2024-05-12",
    isSystem: false,
    isActive: true,
  },
  {
    id: "billing-staff",
    name: "Billing Staff",
    description: "Billing department managing invoices, payments, and financial records",
    permissions: [
      "billing.read",
      "billing.create",
      "billing.update",
      "patients.read",
      "visits.read",
      "reports.read",
    ],
    usersCount: 3,
    createdAt: "2024-06-01",
    isSystem: false,
    isActive: false,
  },
];
