export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  distance: string;
  availability: string;
  phone: string;
  address: string;
}

export const MOCK_DOCTORS: Doctor[] = [
  { id: "1", name: "Dr. Priya Sharma", specialty: "Pulmonologist", hospital: "Apollo Hospital", rating: 4.8, distance: "2.3 km", availability: "Mon-Sat, 9AM-5PM", phone: "+91 98765 43210", address: "MG Road, Bengaluru" },
  { id: "2", name: "Dr. Rajesh Kumar", specialty: "Respiratory Medicine", hospital: "Fortis Healthcare", rating: 4.6, distance: "4.1 km", availability: "Mon-Fri, 10AM-6PM", phone: "+91 98765 43211", address: "Whitefield, Bengaluru" },
  { id: "3", name: "Dr. Ananya Patel", specialty: "Chest Physician", hospital: "Manipal Hospital", rating: 4.9, distance: "5.7 km", availability: "Tue-Sat, 8AM-4PM", phone: "+91 98765 43212", address: "HAL Airport Road, Bengaluru" },
  { id: "4", name: "Dr. Vikram Singh", specialty: "Pulmonologist", hospital: "NIMHANS", rating: 4.7, distance: "6.2 km", availability: "Mon-Fri, 9AM-3PM", phone: "+91 98765 43213", address: "Hosur Road, Bengaluru" },
  { id: "5", name: "Dr. Meera Reddy", specialty: "Thoracic Medicine", hospital: "Columbia Asia", rating: 4.5, distance: "3.8 km", availability: "Mon-Sat, 10AM-7PM", phone: "+91 98765 43214", address: "Hebbal, Bengaluru" },
  { id: "6", name: "Dr. Arun Nair", specialty: "Pulmonary Critical Care", hospital: "Sakra World Hospital", rating: 4.8, distance: "7.1 km", availability: "Mon-Fri, 8AM-5PM", phone: "+91 98765 43215", address: "Bellandur, Bengaluru" },
];
