export type TreatmentEntry = {
  id: string;
  name: string;
  durationMinutes: number;
  room?: string;
  notes?: string;
};

export type Visit = {
  id: string;
  date: string; // ISO date
  doctor: string;
  complaints: string;
  diagnosis: string;
  treatments: TreatmentEntry[];
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  address?: string;
  allergies?: string[];
  chronicConditions?: string[];
  bloodGroup?: string;
  emergencyContact?: { name: string; phone: string };
  ayurvedaProfile?: {
    prakriti?:
      | "Vata"
      | "Pitta"
      | "Kapha"
      | "Vata-Pitta"
      | "Pitta-Kapha"
      | "Vata-Kapha"
      | "Tridoshic";
    agni?: "Manda" | "Vishama" | "Tikshna" | "Sama";
    notes?: string;
  };
  lastVisit?: string;
  visits: Visit[];
};

export const patients: Patient[] = [
  {
    id: "P-1001",
    name: "Aarav Sharma",
    age: 34,
    gender: "Male",
    phone: "+91 98765 43210",
    email: "aarav.sharma@example.com",
    address: "Bengaluru, Karnataka",
    allergies: ["Peanuts"],
    chronicConditions: ["Hypertension"],
    bloodGroup: "B+",
    emergencyContact: { name: "Riya Sharma", phone: "+91 99876 54321" },
    ayurvedaProfile: { prakriti: "Vata-Pitta", agni: "Vishama", notes: "Sensitive to cold, dry skin" },
    lastVisit: "2025-09-15",
    visits: [
      {
        id: "V-2001",
        date: "2025-09-15",
        doctor: "Dr. Meera Nair",
        complaints: "Lower back pain, stiffness in mornings",
        diagnosis: "Vata aggravation with muscle stiffness",
        treatments: [
          {
            id: "T-1",
            name: "Abhyanga (Full Body Oil Massage)",
            durationMinutes: 60,
            room: "Room 203",
            notes: "Sesame oil",
          },
          { id: "T-2", name: "Swedana (Steam Therapy)", durationMinutes: 20, room: "Steam-2" },
        ],
      },
      {
        id: "V-2002",
        date: "2025-08-31",
        doctor: "Dr. Sanjay Rao",
        complaints: "Digestive discomfort",
        diagnosis: "Mild Agni imbalance",
        treatments: [{ id: "T-3", name: "Shirodhara", durationMinutes: 45, room: "Room 105", notes: "Medicated oil" }],
      },
    ],
  },
  {
    id: "P-1002",
    name: "Lakshmi Menon",
    age: 42,
    gender: "Female",
    phone: "+91 97654 32109",
    email: "lakshmi.menon@example.com",
    address: "Kochi, Kerala",
    allergies: [],
    chronicConditions: ["Hypothyroidism"],
    bloodGroup: "O+",
    emergencyContact: { name: "Arjun Menon", phone: "+91 99001 11223" },
    ayurvedaProfile: { prakriti: "Kapha", agni: "Manda", notes: "Prone to sluggishness" },
    lastVisit: "2025-09-18",
    visits: [
      {
        id: "V-3001",
        date: "2025-09-18",
        doctor: "Dr. Meera Nair",
        complaints: "Neck stiffness and stress",
        diagnosis: "Kapha aggravation with stress",
        treatments: [
          { id: "T-4", name: "Pizhichil", durationMinutes: 50, room: "Room 201" },
          { id: "T-5", name: "Nasya", durationMinutes: 15, room: "Therapy-1", notes: "Anu taila" },
        ],
      },
    ],
  },
  {
    id: "P-1003",
    name: "Rahul Verma",
    age: 29,
    gender: "Male",
    phone: "+91 96543 21098",
    address: "Pune, Maharashtra",
    ayurvedaProfile: { prakriti: "Pitta", agni: "Tikshna" },
    lastVisit: "2025-09-10",
    visits: [
      {
        id: "V-4001",
        date: "2025-09-10",
        doctor: "Dr. Sanjay Rao",
        complaints: "Acidity and irritability",
        diagnosis: "Pitta aggravation",
        treatments: [{ id: "T-6", name: "Takradhara", durationMinutes: 40, room: "Room 102", notes: "Buttermilk" }],
      },
    ],
  },
];

export function getPatientById(id: string): Patient | undefined {
  return patients.find(p => p.id === id);
}
