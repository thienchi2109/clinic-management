import { Patient, Appointment, Medication, Invoice, PatientDocument } from './types';

// Hardcode dates to prevent hydration errors from `new Date()`
const staticToday = '2024-07-30';
const staticExpiringSoon = '2024-08-14'; // 15 days from staticToday
const staticExpired = '2024-07-25'; // 5 days before staticToday


export const patients: Patient[] = [
  { id: 'PAT001', name: 'John Doe', age: 45, gender: 'Male', lastVisit: '2023-10-15', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'PAT002', name: 'Jane Smith', age: 34, gender: 'Female', lastVisit: '2023-11-01', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'PAT003', name: 'Emily Jones', age: 28, gender: 'Female', lastVisit: '2023-11-20', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'PAT004', name: 'Michael Brown', age: 56, gender: 'Male', lastVisit: '2023-12-05', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'PAT005', name: 'Chris Wilson', age: 41, gender: 'Male', lastVisit: '2024-01-02', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const appointments: Appointment[] = [
  { id: 'APP001', patientName: 'John Doe', doctorName: 'Dr. Adams', date: staticToday, time: '09:00 AM', status: 'Scheduled' },
  { id: 'APP002', patientName: 'Jane Smith', doctorName: 'Dr. Carter', date: staticToday, time: '10:30 AM', status: 'Scheduled' },
  { id: 'APP003', patientName: 'Emily Jones', doctorName: 'Dr. Adams', date: staticToday, time: '11:15 AM', status: 'Completed' },
  { id: 'APP004', patientName: 'Robert Paulson', doctorName: 'Dr. Shaw', date: '2024-06-28', time: '02:00 PM', status: 'Cancelled' },
  { id: 'APP005', patientName: 'Sarah Connor', doctorName: 'Dr. Carter', date: '2024-07-01', time: '09:30 AM', status: 'Scheduled' },
];

export const medications: Medication[] = [
  { id: 'MED001', name: 'Paracetamol 500mg', batchNo: 'B0123', expiryDate: '2025-12-31', stock: 150 },
  { id: 'MED002', name: 'Amoxicillin 250mg', batchNo: 'B0456', expiryDate: staticExpiringSoon, stock: 75 },
  { id: 'MED003', name: 'Ibuprofen 200mg', batchNo: 'B0789', expiryDate: '2024-08-31', stock: 200 },
  { id: 'MED004', name: 'Aspirin 100mg', batchNo: 'B1011', expiryDate: staticExpired, stock: 40 },
  { id: 'MED005', name: 'Lisinopril 10mg', batchNo: 'B1213', expiryDate: '2026-01-31', stock: 90 },
];

export const invoices: Invoice[] = [
  { id: 'INV001', patientName: 'John Doe', date: '2023-10-15', amount: 150.00, status: 'Paid' },
  { id: 'INV002', patientName: 'Jane Smith', date: '2023-11-01', amount: 75.50, status: 'Paid' },
  { id: 'INV003', patientName: 'Emily Jones', date: '2023-11-20', amount: 200.00, status: 'Pending' },
  { id: 'INV004', patientName: 'Michael Brown', date: '2023-12-05', amount: 310.75, status: 'Overdue' },
  { id: 'INV005', patientName: 'Chris Wilson', date: '2024-01-02', amount: 50.00, status: 'Paid' },
];

export const documents: PatientDocument[] = [
  { id: 'DOC001', name: 'Ultrasound_Scan_Abdomen.pdf', type: 'Ultrasound', uploadDate: '2023-10-15', url: '#' },
  { id: 'DOC002', name: 'Blood_Test_Results_Jan23.pdf', type: 'Blood Test', uploadDate: '2023-10-14', url: '#' },
  { id: 'DOC003', name: 'Chest_XRay_Report.pdf', type: 'X-Ray', uploadDate: '2023-09-20', url: '#' },
  { id: 'DOC004', name: 'Prescription_Amoxicillin.pdf', type: 'Prescription', uploadDate: '2023-10-15', url: '#' },
];
