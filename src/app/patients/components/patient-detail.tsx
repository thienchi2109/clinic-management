'use client';

import { useState } from 'react';
import type { Patient, PatientDocument } from '@/lib/types';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Cake,
  Phone,
  MapPin,
  HeartPulse,
  Upload,
  FileText,
  Download,
  Pencil,
} from 'lucide-react';
import { calculateAge, formatDate } from '@/lib/utils';
import { documents as mockDocuments } from '@/lib/mock-data';
import { PatientForm } from './patient-form';

interface PatientDetailProps {
  patient: Patient;
  onUpdatePatient: (patient: Patient) => void;
  onClose: () => void;
}

const translateGender = (gender: Patient['gender']) => {
    switch(gender) {
        case 'Male': return 'Nam';
        case 'Female': return 'Nữ';
        case 'Other': return 'Khác';
        default: return gender;
    }
}

export function PatientDetail({ patient, onUpdatePatient, onClose }: PatientDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  // TODO: Replace with actual documents for the patient
  const patientDocuments = mockDocuments.slice(0, 2);

  const handleSave = (formData: Omit<Patient, 'id' | 'lastVisit' | 'avatarUrl'>) => {
    const updatedPatient = {
      ...patient,
      ...formData,
    };
    onUpdatePatient(updatedPatient);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin bệnh nhân</DialogTitle>
          <DialogDescription>Cập nhật thông tin chi tiết cho {patient.name}.</DialogDescription>
        </DialogHeader>
        <PatientForm 
          initialData={patient}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person portrait" />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-headline">{patient.name}</DialogTitle>
            <DialogDescription className="text-base">
              Mã bệnh nhân: {patient.id}
            </DialogDescription>
             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{translateGender(patient.gender)}</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <Cake className="h-4 w-4" />
                    <span>{calculateAge(patient.birthYear)} tuổi (Năm sinh: {patient.birthYear})</span>
                </div>
            </div>
          </div>
        </div>
      </DialogHeader>

      <div className="py-4 grid gap-6 max-h-[60vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{patient.address}</span>
            </div>
        </div>

        {patient.medicalHistory && (
            <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2 text-base">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    Tiền sử bệnh
                </h4>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{patient.medicalHistory}</p>
            </div>
        )}

        <Separator />

        <div>
            <div className="flex items-center justify-between mb-3">
                 <h4 className="font-semibold flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-primary" />
                    Tài liệu & Kết quả khám
                </h4>
                <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Tải lên
                </Button>
            </div>
            {patientDocuments.length > 0 ? (
                <ul className="space-y-2">
                    {patientDocuments.map(doc => (
                        <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">{doc.type}</Badge>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm hover:underline">{doc.name}</a>
                            </div>
                             <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Tải lên: {formatDate(doc.uploadDate)}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <a href={doc.url} download={doc.name}>
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                             </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-sm text-muted-foreground py-6 border-2 border-dashed rounded-lg">
                    <p>Chưa có tài liệu nào được tải lên.</p>
                </div>
            )}
        </div>
      </div>

      <DialogFooter className="pt-2 sm:justify-between">
          <Button type="button" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Sửa
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Đóng</Button>
      </DialogFooter>
    </>
  );
}
