import { Patient, Appointment, Medication, Invoice, PatientDocument, Staff, MedicalRecord } from './types';

// Hardcode dates to prevent hydration errors from `new Date()`
export const staticToday = '2024-07-30';
const staticExpiringSoon = '2024-08-14'; // 15 days from staticToday
const staticExpired = '2024-07-25'; // 5 days before staticToday

export const documents: PatientDocument[] = [
  { id: 'DOC001', name: 'Ultrasound_Scan_Abdomen.pdf', type: 'Ultrasound', uploadDate: '2023-10-15', url: '#' },
  { id: 'DOC002', name: 'Blood_Test_Results_Jan23.pdf', type: 'Blood Test', uploadDate: '2023-10-14', url: '#' },
  { id: 'DOC003', name: 'Chest_XRay_Report.pdf', type: 'X-Ray', uploadDate: '2023-09-20', url: '#' },
  { id: 'DOC004', name: 'Prescription_Amoxicillin.pdf', type: 'Prescription', uploadDate: '2023-10-15', url: '#' },
];


export const patients: Patient[] = [
  { id: 'PAT001', name: 'Nguyễn Văn An', birthYear: 1979, gender: 'Male', address: '123 Đường Chính, Quận 1, TP.HCM', phone: '0901234567', lastVisit: '2023-10-15', avatarUrl: 'https://placehold.co/100x100.png', medicalHistory: 'Tiền sử cao huyết áp, dị ứng với penicillin.', documents: documents.slice(0, 2) },
  { id: 'PAT002', name: 'Trần Thị Bích', birthYear: 1990, gender: 'Female', address: '456 Đường Sồi, Quận 3, TP.HCM', phone: '0902345678', lastVisit: staticToday, avatarUrl: 'https://placehold.co/100x100.png', medicalHistory: 'Không có bệnh mãn tính.', documents: [] },
  { id: 'PAT003', name: 'Lê Thị Cẩm', birthYear: 1996, gender: 'Female', address: '789 Đường Thông, Quận 5, TP.HCM', phone: '0903456789', lastVisit: staticToday, avatarUrl: 'https://placehold.co/100x100.png', medicalHistory: 'Hen suyễn từ nhỏ.', documents: [documents[2]] },
  { id: 'PAT004', name: 'Phạm Văn Dũng', birthYear: 1968, gender: 'Male', address: '101 Đường Phong, Quận 10, TP.HCM', phone: '0904567890', lastVisit: '2023-12-05', avatarUrl: 'https://placehold.co/100x100.png', medicalHistory: 'Tiểu đường type 2.', documents: [] },
  { id: 'PAT005', name: 'Hoàng Văn Em', birthYear: 1983, gender: 'Male', address: '212 Đường Bạch Dương, Q.Tân Bình, TP.HCM', phone: '0905678901', lastVisit: '2024-01-02', avatarUrl: 'https://placehold.co/100x100.png', medicalHistory: 'Đau dạ dày, thường xuyên stress.', documents: [] },
];

export const staff: Staff[] = [
    { id: 'STAFF001', name: 'Bs. Minh', role: 'Bác sĩ', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-123-4567', email: 'minh.bs@clinic.com', password: 'minh123' },
    { id: 'STAFF002', name: 'Bs. Hải', role: 'Bác sĩ', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-234-5678', email: 'hai.bs@clinic.com', password: 'hai123' },
    { id: 'STAFF003', name: 'Bs. Hoài', role: 'Bác sĩ', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-345-6789', email: 'hoai.bs@clinic.com', password: 'hoai123' },
    { id: 'STAFF004', name: 'Bs. Linh', role: 'Bác sĩ', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-456-7890', email: 'linh.bs@clinic.com', password: 'linh123' },
    { id: 'STAFF005', name: 'Đd. Hạnh', role: 'Điều dưỡng', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-567-8901', email: 'hanh.dd@clinic.com', password: 'hanh123' },
    { id: 'STAFF006', name: 'Đd. Hoa', role: 'Điều dưỡng', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-678-9012', email: 'hoa.dd@clinic.com', password: 'hoa123' },
    { id: 'STAFF007', name: 'Bs. An', role: 'Bác sĩ', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-789-0123', email: 'an.bs@clinic.com', password: 'an123' },
    { id: 'STAFF008', name: 'Bs. Bình', role: 'Bác sĩ', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-890-1234', email: 'binh.bs@clinic.com', password: 'binh123' },
    { id: 'STAFF009', name: 'Đd. Chi', role: 'Điều dưỡng', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-901-2345', email: 'chi.dd@clinic.com', password: 'chi123' },
    { id: 'STAFF010', name: 'Đd. Dung', role: 'Điều dưỡng', avatarUrl: 'https://placehold.co/100x100.png', phone: '090-012-3456', email: 'dung.dd@clinic.com', password: 'dung123' },
];

export const appointments: Appointment[] = [
  { id: 'APP001', patientName: 'Anh Thắng', doctorName: 'Bs. Hải', date: staticToday, startTime: '07:00', endTime: '07:30', status: 'Scheduled' },
  { id: 'APP002', patientName: 'Trần Thị Bích', doctorName: 'Bs. Minh', date: staticToday, startTime: '08:00', endTime: '08:45', status: 'Completed', notes: 'Viêm họng cấp. Kê đơn kháng sinh và thuốc giảm đau.' },
  { id: 'APP003', patientName: 'Anh Mạnh', doctorName: 'Bs. Hoài', date: staticToday, startTime: '08:30', endTime: '09:00', status: 'Scheduled' },
  { id: 'APP004', patientName: 'Chị Mận', doctorName: 'Bs. Linh', date: staticToday, startTime: '09:15', endTime: '10:15', status: 'Cancelled' },
  { id: 'APP005', patientName: 'Nguyễn Văn An', doctorName: 'Đd. Hạnh', date: staticToday, startTime: '10:30', endTime: '11:15', status: 'Scheduled' },
  { id: 'APP006', patientName: 'Bệnh nhân X', doctorName: 'Đd. Hoa', date: staticToday, startTime: '14:00', endTime: '15:00', status: 'Scheduled' },
  { id: 'APP007', patientName: 'Lê Thị Cẩm', doctorName: 'Bs. Hải', date: staticToday, startTime: '11:00', endTime: '11:45', status: 'Completed', notes: 'Kiểm tra định kỳ cho bệnh hen suyễn. Tình trạng ổn định. Tiếp tục dùng thuốc cũ.' },
  { id: 'APP008', patientName: 'Sarah Connor', doctorName: 'Bs. Minh', date: '2024-08-01', startTime: '09:30', endTime: '10:00', status: 'Scheduled' },
  { id: 'APP009', patientName: 'Phạm Văn Dũng', doctorName: 'Bs. An', date: staticToday, startTime: '09:00', endTime: '09:30', status: 'Scheduled' },
  { id: 'APP010', patientName: 'Hoàng Văn Em', doctorName: 'Bs. Bình', date: staticToday, startTime: '13:00', endTime: '14:00', status: 'Scheduled' },
];

export const medications: Medication[] = [
  { id: 'MED001', name: 'Paracetamol 500mg', batchNo: 'B0123', expiryDate: '2025-12-31', stock: 150 },
  { id: 'MED002', name: 'Amoxicillin 250mg', batchNo: 'B0456', expiryDate: staticExpiringSoon, stock: 75 },
  { id: 'MED003', name: 'Ibuprofen 200mg', batchNo: 'B0789', expiryDate: '2024-08-31', stock: 200 },
  { id: 'MED004', name: 'Aspirin 100mg', batchNo: 'B1011', expiryDate: staticExpired, stock: 40 },
  { id: 'MED005', name: 'Lisinopril 10mg', batchNo: 'B1213', expiryDate: '2026-01-31', stock: 90 },
];

export const invoices: Invoice[] = [
  { id: 'INV001', patientName: 'Nguyễn Văn An', date: '2023-10-15', items: [{id: '1', description: 'Phí tư vấn', amount: 100000}, {id: '2', description: 'Thuốc', amount: 50000}], amount: 150000, status: 'Paid' },
  { id: 'INV002', patientName: 'Trần Thị Bích', date: staticToday, items: [{id: '1', description: 'Phí khám bệnh', amount: 75000}], amount: 75000, status: 'Paid' },
  { id: 'INV003', patientName: 'Lê Thị Cẩm', date: staticToday, items: [{id: '1', description: 'Phí tái khám', amount: 200000}], amount: 200000, status: 'Pending' },
  { id: 'INV004', patientName: 'Phạm Văn Dũng', date: '2023-12-05', items: [{id: '1', description: 'Phí tư vấn', amount: 250000}, {id: '2', description: 'Xét nghiệm máu', amount: 60000}], amount: 310000, status: 'Overdue' },
  { id: 'INV005', patientName: 'Hoàng Văn Em', date: '2024-01-02', items: [{id: '1', description: 'Phí tư vấn', amount: 50000}], amount: 50000, status: 'Paid' },
];

// TODO: Expand prescription system with detailed medication management
export const medicalRecords: MedicalRecord[] = [
  {
    id: 'MR001',
    patientId: 'PAT002',
    patientName: 'Trần Thị Bích',
    appointmentId: 'APP002',
    date: staticToday,
    doctorName: 'Bs. Minh',
    symptoms: 'Đau họng, khó nuốt, sốt nhẹ 37.5°C',
    diagnosis: 'Viêm họng cấp tính do virus',
    treatment: 'Nghỉ ngơi, uống nhiều nước, súc miệng bằng nước muối',
    prescription: 'Paracetamol 500mg x 3 lần/ngày x 5 ngày, Amoxicillin 250mg x 3 lần/ngày x 7 ngày',
    nextAppointment: '2024-08-05',
    notes: 'Bệnh nhân cần tái khám sau 1 tuần nếu triệu chứng không cải thiện'
  },
  {
    id: 'MR002',
    patientId: 'PAT003',
    patientName: 'Lê Thị Cẩm',
    appointmentId: 'APP007',
    date: staticToday,
    doctorName: 'Bs. Hải',
    symptoms: 'Tái khám định kỳ, thở bình thường',
    diagnosis: 'Hen suyễn kiểm soát tốt',
    treatment: 'Tiếp tục sử dụng thuốc cũ theo đúng liều',
    prescription: 'Salbutamol inhaler - sử dụng khi cần, Budesonide inhaler 2 lần/ngày',
    notes: 'Tình trạng ổn định, khuyến khích duy trì lối sống lành mạnh'
  }
];
