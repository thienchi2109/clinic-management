import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Patient, Prescription, PrescriptionItem } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function calculateAge(birthYear: number): number {
  if (!birthYear) return 0;
  // Use a static year to be consistent with mock data and avoid hydration errors.
  return 2024 - birthYear;
}

export function formatCurrency(amount: number): string {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

/**
 * Generates a patient ID following the pattern: PATIENT-DDMMYYYY-XXX
 * @param existingPatients - Array of existing patients to check for ID collisions
 * @param creationDate - Optional date for ID generation (defaults to today)
 * @returns Generated patient ID
 */
export function generatePatientId(existingPatients: { id: string }[], creationDate?: Date): string {
    const date = creationDate || new Date();

    // Format date as DDMMYYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const dateStr = `${day}${month}${year}`;

    // Find existing patient IDs for the same date
    const datePrefix = `PATIENT-${dateStr}-`;
    const existingIdsForDate = existingPatients
        .filter(patient => patient.id.startsWith(datePrefix))
        .map(patient => patient.id)
        .sort();

    // Find the next available sequence number
    let sequenceNumber = 0;
    for (const existingId of existingIdsForDate) {
        const sequencePart = existingId.split('-')[2];
        const currentSequence = parseInt(sequencePart, 10);
        if (currentSequence === sequenceNumber) {
            sequenceNumber++;
        } else {
            break;
        }
    }

    // Format sequence number as XXX (3 digits with leading zeros)
    const sequenceStr = sequenceNumber.toString().padStart(3, '0');

    return `PATIENT-${dateStr}-${sequenceStr}`;
}

// Prescription utilities
export function generatePrescriptionId(existingPrescriptions: Prescription[] = []): string {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  const existingCount = existingPrescriptions.filter(p => p.id.startsWith(`PR${dateStr}`)).length;
  return `PR${dateStr}${String(existingCount + 1).padStart(3, '0')}`;
}

export function calculatePrescriptionTotal(items: PrescriptionItem[]): number {
  return items.reduce((total, item) => total + item.totalCost, 0);
}

export function calculateItemTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

export function generatePrescriptionValidUntil(issueDate: string, validityDays: number = 5): string {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + validityDays);
  return date.toISOString().split('T')[0];
}

export function isPrescriptionValid(prescription: Prescription): boolean {
  if (!prescription.validUntil) return true;
  const today = new Date();
  const validUntil = new Date(prescription.validUntil);
  return validUntil >= today;
}

export function formatPrescriptionStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'Draft': 'Bản nháp',
    'Finalized': 'Đã hoàn thành',
    'Dispensed': 'Đã cấp thuốc',
    'Cancelled': 'Đã hủy'
  };
  return statusMap[status] || status;
}

export function getPrescriptionStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'Draft': 'outline',
    'Finalized': 'default',
    'Dispensed': 'secondary',
    'Cancelled': 'destructive'
  };
  return variantMap[status] || 'outline';
}

export function generatePrescriptionHTML(prescription: Prescription): string {
  const currentDate = new Date().toLocaleDateString('vi-VN');
  const patientAge = prescription.patientAge || (prescription.patientName ? 'N/A' : 'N/A');
  
  const medicationRows = prescription.items.map((item, index) => `
    <tr>
      <td class="border p-2 text-center">${index + 1}</td>
      <td class="border p-2">
        <strong>${item.medicationName}</strong>
        <br>
        <span class="text-xs text-gray-600">(${item.concentration} - ${item.dosageForm})</span>
      </td>
      <td class="border p-2 text-center">${item.unit}</td>
      <td class="border p-2 text-center">${item.quantity}</td>
      <td class="border p-2">${item.dosage}, ${item.instructions}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đơn Thuốc Điện Tử</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
        }
        @page {
            size: A5;
            margin: 1cm;
        }
        @media print {
            body {
                background-color: #fff;
            }
            .prescription-container {
                box-shadow: none;
                margin: 0;
                max-width: 100%;
                border: none;
            }
            .no-print {
                display: none;
            }
        }
        table {
            page-break-inside: auto;
        }
        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        thead {
            display: table-header-group;
        }
        tfoot {
            display: table-footer-group;
        }
    </style>
</head>
<body class="p-4 md:p-8">

    <div class="max-w-4xl mx-auto mb-4 text-right no-print">
        <button onclick="window.print()" class="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
            🖨️ In đơn thuốc
        </button>
    </div>

    <div id="prescription" class="prescription-container max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
        
        <header class="flex justify-between items-start pb-4 border-b-2 border-gray-200">
            <div class="text-xs">
                <h2 class="font-bold text-sm uppercase text-blue-700">${prescription.clinicInfo?.name || 'PHÒNG KHÁM ĐA KHOA ABC'}</h2>
                <p class="mt-1"><strong>Địa chỉ:</strong> ${prescription.clinicInfo?.address || 'Số 123, Đường XYZ, Phường Cống Vị, Quận Ba Đình, Hà Nội'}</p>
                <p><strong>Điện thoại:</strong> ${prescription.clinicInfo?.phone || '(024) 3456 7890'}</p>
                <p><strong>Mã CSKCB:</strong> ${prescription.clinicInfo?.licenseNumber || '01234'}</p>
            </div>
            <div class="text-center">
                <p class="text-xs">Mã đơn thuốc:</p>
                <p class="font-mono font-bold text-sm">${prescription.id}</p>
                <img src="https://placehold.co/100x100/e2e8f0/333?text=QR+CODE" 
                     alt="QR Code tra cứu đơn thuốc" 
                     class="w-24 h-24 mt-1"
                     onerror="this.onerror=null;this.src='https://placehold.co/100x100/e2e8f0/333?text=QR+Error';">
            </div>
        </header>

        <div class="text-center my-6">
            <h1 class="text-2xl md:text-3xl font-bold uppercase">ĐƠN THUỐC</h1>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><strong>Họ và tên:</strong> ${prescription.patientName.toUpperCase()}</div>
            <div><strong>Tuổi:</strong> ${patientAge}</div>
            <div><strong>Giới tính:</strong> ${prescription.patientGender === 'Male' ? 'Nam' : prescription.patientGender === 'Female' ? 'Nữ' : 'Khác'}</div>
            <div><strong>Cân nặng:</strong> ${prescription.patientWeight || 'N/A'} kg</div>
            <div class="md:col-span-2"><strong>Địa chỉ:</strong> ${prescription.patientAddress || 'N/A'}</div>
            <div class="md:col-span-2 bg-gray-100 p-2 rounded-md">
                <strong class="text-red-600">Chẩn đoán:</strong> ${prescription.diagnosis}
            </div>
        </section>

        <section class="mt-6">
            <table class="w-full border-collapse text-sm">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="border p-2 text-center font-semibold">TT</th>
                        <th class="border p-2 text-left font-semibold">Tên thuốc, nồng độ, hàm lượng</th>
                        <th class="border p-2 text-center font-semibold">ĐVT</th>
                        <th class="border p-2 text-center font-semibold">SL</th>
                        <th class="border p-2 text-left font-semibold">Liều dùng - Cách dùng</th>
                    </tr>
                </thead>
                <tbody>
                    ${medicationRows}
                </tbody>
            </table>
        </section>

        ${prescription.doctorNotes ? `
        <section class="mt-6 text-sm">
            <p><strong>Lời dặn của bác sĩ:</strong></p>
            <div class="pl-4 mt-1">
                ${prescription.doctorNotes.replace(/\n/g, '<br>')}
            </div>
        </section>
        ` : ''}

        <footer class="mt-8 pt-4">
            <div class="flex justify-between items-start">
                <div class="text-center w-1/2">
                    <p class="font-semibold">Người nhận thuốc/Người nhà</p>
                    <p class="text-xs italic">(Ký, ghi rõ họ tên)</p>
                    <div class="h-20"></div>
                </div>

                <div class="text-center w-1/2">
                    <p class="text-sm"><em>${currentDate}</em></p>
                    <p class="font-semibold mt-1">Bác sĩ/Y sĩ kê đơn</p>
                    <div class="h-12 flex items-center justify-center">
                        <span class="italic text-green-600">-- Đã ký số --</span>
                    </div>
                    <p class="font-bold text-base">${prescription.doctorName.toUpperCase()}</p>
                    ${prescription.doctorLicense ? `<p class="text-xs">Số GPHN: ${prescription.doctorLicense}</p>` : ''}
                </div>
            </div>
            ${prescription.nextAppointment ? `
            <div class="mt-4 text-center text-xs text-gray-500">
                <p><strong>Hẹn tái khám:</strong> ${formatDate(prescription.nextAppointment)}</p>
                <p class="mt-2">Vui lòng mang theo đơn này khi tái khám.</p>
            </div>
            ` : ''}
        </footer>
    </div>
</body>
</html>
  `;
}

export function printPrescription(prescription: Prescription): void {
  const htmlContent = generatePrescriptionHTML(prescription);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }
}
