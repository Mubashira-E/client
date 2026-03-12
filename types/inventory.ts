export type InventoryItem = {
  id: number;
  itemName: string;
  itemCategory: string;
  batchNo: string;
  quantity: number;
  unit: string;
  manufacturingDate: string;
  expiryDate: string;
  storageCondition: string;
  storageLocation: string;
  remarks?: string;
  supplierName: string;
  supplierId: number;
  status: "Active" | "Inactive" | "Expired" | "Low Stock" | "Expiring Soon";
  createdDate: string;
  updatedDate: string;
};

export type Supplier = {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
  status: "Active" | "Inactive";
};

export type InventoryCategory = {
  id: number;
  name: string;
  description?: string;
};

export type StockAlert = {
  id: number;
  itemId: number;
  itemName: string;
  alertType: "Low Stock" | "Expiring Soon" | "Expired";
  message: string;
  severity: "Low" | "Medium" | "High";
  createdAt: string;
};

export type Unit = {
  id: number;
  name: string;
  abbreviation: string;
};

export type StorageCondition = {
  id: number;
  name: string;
  description?: string;
};
