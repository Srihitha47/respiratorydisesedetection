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
  city: string;
  lat: number;
  lng: number;
}

export const CITIES = [
  "All Cities",
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
] as const;

export const MOCK_DOCTORS: Doctor[] = [
  // Bengaluru
  { id: "1", name: "Dr. Priya Sharma", specialty: "Pulmonologist", hospital: "Apollo Hospital", rating: 4.8, distance: "2.3 km", availability: "Mon-Sat, 9AM-5PM", phone: "+91 98765 43210", address: "MG Road", city: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { id: "2", name: "Dr. Rajesh Kumar", specialty: "Respiratory Medicine", hospital: "Fortis Healthcare", rating: 4.6, distance: "4.1 km", availability: "Mon-Fri, 10AM-6PM", phone: "+91 98765 43211", address: "Whitefield", city: "Bengaluru", lat: 12.9698, lng: 77.7500 },
  { id: "3", name: "Dr. Ananya Patel", specialty: "Chest Physician", hospital: "Manipal Hospital", rating: 4.9, distance: "5.7 km", availability: "Tue-Sat, 8AM-4PM", phone: "+91 98765 43212", address: "HAL Airport Road", city: "Bengaluru", lat: 12.9592, lng: 77.6474 },
  { id: "4", name: "Dr. Vikram Singh", specialty: "Pulmonologist", hospital: "NIMHANS", rating: 4.7, distance: "6.2 km", availability: "Mon-Fri, 9AM-3PM", phone: "+91 98765 43213", address: "Hosur Road", city: "Bengaluru", lat: 12.9426, lng: 77.5969 },
  { id: "5", name: "Dr. Meera Reddy", specialty: "Thoracic Medicine", hospital: "Columbia Asia", rating: 4.5, distance: "3.8 km", availability: "Mon-Sat, 10AM-7PM", phone: "+91 98765 43214", address: "Hebbal", city: "Bengaluru", lat: 13.0358, lng: 77.5970 },
  { id: "6", name: "Dr. Arun Nair", specialty: "Pulmonary Critical Care", hospital: "Sakra World Hospital", rating: 4.8, distance: "7.1 km", availability: "Mon-Fri, 8AM-5PM", phone: "+91 98765 43215", address: "Bellandur", city: "Bengaluru", lat: 12.9260, lng: 77.6762 },

  // Mumbai
  { id: "7", name: "Dr. Sanjay Deshmukh", specialty: "Pulmonologist", hospital: "Lilavati Hospital", rating: 4.9, distance: "1.8 km", availability: "Mon-Sat, 9AM-6PM", phone: "+91 22 2640 1234", address: "Bandra West", city: "Mumbai", lat: 19.0596, lng: 72.8295 },
  { id: "8", name: "Dr. Kavita Menon", specialty: "Respiratory Medicine", hospital: "Hinduja Hospital", rating: 4.7, distance: "3.5 km", availability: "Mon-Fri, 10AM-5PM", phone: "+91 22 2444 9199", address: "Mahim", city: "Mumbai", lat: 19.0428, lng: 72.8410 },
  { id: "9", name: "Dr. Farhan Shaikh", specialty: "Chest Physician", hospital: "Breach Candy Hospital", rating: 4.6, distance: "5.2 km", availability: "Tue-Sat, 9AM-4PM", phone: "+91 22 2366 7788", address: "Breach Candy", city: "Mumbai", lat: 18.9710, lng: 72.8054 },
  { id: "10", name: "Dr. Nisha Joshi", specialty: "Pulmonary Critical Care", hospital: "Kokilaben Hospital", rating: 4.8, distance: "4.6 km", availability: "Mon-Sat, 8AM-5PM", phone: "+91 22 3066 6666", address: "Andheri West", city: "Mumbai", lat: 19.1307, lng: 72.8259 },

  // Delhi
  { id: "11", name: "Dr. Amit Gupta", specialty: "Pulmonologist", hospital: "AIIMS Delhi", rating: 4.9, distance: "2.1 km", availability: "Mon-Sat, 9AM-4PM", phone: "+91 11 2658 8500", address: "Ansari Nagar", city: "Delhi", lat: 28.5672, lng: 77.2100 },
  { id: "12", name: "Dr. Pooja Verma", specialty: "Respiratory Medicine", hospital: "Max Super Speciality", rating: 4.7, distance: "6.3 km", availability: "Mon-Fri, 10AM-6PM", phone: "+91 11 2651 5050", address: "Saket", city: "Delhi", lat: 28.5244, lng: 77.2066 },
  { id: "13", name: "Dr. Rohit Malhotra", specialty: "Thoracic Medicine", hospital: "Sir Ganga Ram Hospital", rating: 4.8, distance: "3.9 km", availability: "Mon-Sat, 9AM-5PM", phone: "+91 11 2575 0000", address: "Rajinder Nagar", city: "Delhi", lat: 28.6370, lng: 77.1883 },

  // Chennai
  { id: "14", name: "Dr. Lakshmi Iyer", specialty: "Pulmonologist", hospital: "Apollo Chennai", rating: 4.8, distance: "2.8 km", availability: "Mon-Sat, 9AM-5PM", phone: "+91 44 2829 3333", address: "Greams Road", city: "Chennai", lat: 13.0604, lng: 80.2496 },
  { id: "15", name: "Dr. Suresh Babu", specialty: "Chest Physician", hospital: "MIOT International", rating: 4.6, distance: "5.4 km", availability: "Mon-Fri, 10AM-6PM", phone: "+91 44 4200 0000", address: "Manapakkam", city: "Chennai", lat: 13.0110, lng: 80.1679 },
  { id: "16", name: "Dr. Revathi Krishnan", specialty: "Respiratory Medicine", hospital: "Fortis Malar", rating: 4.7, distance: "4.0 km", availability: "Tue-Sat, 8AM-4PM", phone: "+91 44 4289 2222", address: "Adyar", city: "Chennai", lat: 13.0067, lng: 80.2572 },

  // Hyderabad
  { id: "17", name: "Dr. Ravi Teja", specialty: "Pulmonologist", hospital: "KIMS Hospital", rating: 4.8, distance: "3.1 km", availability: "Mon-Sat, 9AM-5PM", phone: "+91 40 4488 5000", address: "Secunderabad", city: "Hyderabad", lat: 17.4399, lng: 78.4983 },
  { id: "18", name: "Dr. Swathi Reddy", specialty: "Pulmonary Critical Care", hospital: "AIG Hospitals", rating: 4.7, distance: "6.8 km", availability: "Mon-Fri, 10AM-6PM", phone: "+91 40 4244 4222", address: "Gachibowli", city: "Hyderabad", lat: 17.4400, lng: 78.3489 },

  // Kolkata
  { id: "19", name: "Dr. Arnab Chatterjee", specialty: "Pulmonologist", hospital: "AMRI Hospital", rating: 4.6, distance: "2.5 km", availability: "Mon-Sat, 9AM-5PM", phone: "+91 33 6626 0000", address: "Dhakuria", city: "Kolkata", lat: 22.5070, lng: 88.3616 },
  { id: "20", name: "Dr. Shalini Bose", specialty: "Respiratory Medicine", hospital: "Medica Superspecialty", rating: 4.8, distance: "4.2 km", availability: "Mon-Fri, 10AM-6PM", phone: "+91 33 6652 0000", address: "Mukundapur", city: "Kolkata", lat: 22.5103, lng: 88.3920 },

  // Pune
  { id: "21", name: "Dr. Manish Kulkarni", specialty: "Pulmonologist", hospital: "Ruby Hall Clinic", rating: 4.7, distance: "1.9 km", availability: "Mon-Sat, 9AM-5PM", phone: "+91 20 6645 5100", address: "Sassoon Road", city: "Pune", lat: 18.5196, lng: 73.8553 },
  { id: "22", name: "Dr. Sneha Deshpande", specialty: "Chest Physician", hospital: "Jehangir Hospital", rating: 4.9, distance: "3.3 km", availability: "Mon-Fri, 10AM-6PM", phone: "+91 20 6681 4444", address: "Sassoon Road", city: "Pune", lat: 18.5293, lng: 73.8740 },
];
