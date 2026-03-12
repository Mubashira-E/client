export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Only used during creation
  avatar?: string;
  roles: string[];
  status: "active" | "inactive" | "pending";
  createdAt: string;
};

export const defaultUsers: User[] = [
  {
    id: "1",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@ayurvedichospital.com",
    avatar: "/professional-man-avatar.png",
    roles: ["administrator"],
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@ayurvedichospital.com",
    avatar: "/professional-woman-avatar.png",
    roles: ["doctor"],
    status: "active",
    createdAt: "2024-02-15",
  },
  {
    id: "3",
    firstName: "Anil",
    lastName: "Patel",
    email: "anil.patel@ayurvedichospital.com",
    avatar: "/professional-man-avatar.png",
    roles: ["doctor"],
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "4",
    firstName: "Meera",
    lastName: "Nair",
    email: "meera.nair@ayurvedichospital.com",
    avatar: "/professional-woman-avatar.png",
    roles: ["nurse"],
    status: "active",
    createdAt: "2024-03-10",
  },
  {
    id: "5",
    firstName: "Kavita",
    lastName: "Desai",
    email: "kavita.desai@ayurvedichospital.com",
    avatar: "/professional-woman-avatar.png",
    roles: ["receptionist"],
    status: "active",
    createdAt: "2024-04-05",
  },
  {
    id: "6",
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram.singh@ayurvedichospital.com",
    avatar: "/professional-man-avatar.png",
    roles: ["pharmacist"],
    status: "active",
    createdAt: "2024-05-12",
  },
  {
    id: "7",
    firstName: "Sunita",
    lastName: "Reddy",
    email: "sunita.reddy@ayurvedichospital.com",
    avatar: "/professional-woman-avatar.png",
    roles: ["billing-staff"],
    status: "active",
    createdAt: "2024-06-01",
  },
  {
    id: "8",
    firstName: "Arjun",
    lastName: "Menon",
    email: "arjun.menon@ayurvedichospital.com",
    avatar: "/professional-man-avatar.png",
    roles: ["doctor", "administrator"],
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "9",
    firstName: "Ramesh",
    lastName: "Iyer",
    email: "ramesh.iyer@ayurvedichospital.com",
    avatar: "/professional-man-avatar.png",
    roles: ["nurse"],
    status: "inactive",
    createdAt: "2024-03-15",
  },
  {
    id: "10",
    firstName: "Lakshmi",
    lastName: "Venkatesh",
    email: "lakshmi.venkatesh@ayurvedichospital.com",
    roles: [],
    status: "pending",
    createdAt: "2024-07-10",
  },
];
