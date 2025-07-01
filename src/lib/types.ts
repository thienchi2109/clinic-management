export interface Patient {
  id: string;
  name: string;
  birthYear: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  phone: string;
  lastVisit: string;
  avatarUrl: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Medication {
  id:string;
  name: string;
  batchNo: string;
  expiryDate: string;
  stock: number;
}

export interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface PatientDocument {
  id: string;
  name: string;
  type: 'Ultrasound' | 'X-Ray' | 'Blood Test' | 'Prescription';
  uploadDate: string;
  url: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Bác sĩ' | 'Điều dưỡng';
  avatarUrl: string;
  phone: string;
  email: string;
}
