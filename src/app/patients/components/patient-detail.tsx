'use client';

import { useState, useRef } from 'react';
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
  Loader2,
  Trash2
} from 'lucide-react';
import { calculateAge, formatDate } from '@/lib/utils';
import { PatientForm } from './patient-form';
import { useToast } from '@/hooks/use-toast';
import { getSignedURL } from '@/app/actions/r2';

interface PatientDetailProps {
  patient: Patient;
  onUpdatePatient: (patient: Patient) => void;
  onClose: () => void;
}

const translateGender = (gender: Patient['gender']) => {
  switch (gender) {
    case 'Male':
      return 'Nam';
    case 'Female':
      return 'Nữ';
    case 'Other':
      return 'Khác';
    default:
      return gender;
  }
};

export function PatientDetail({ patient, onUpdatePatient, onClose }: PatientDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = (formData: Omit<Patient, 'id' | 'lastVisit' | 'avatarUrl' | 'documents'>) => {
    const updatedPatient = {
      ...patient,
      ...formData,
    };
    onUpdatePatient(updatedPatient);
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileToUpload(file);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };
  
  const handleUpload = async () => {
    if (!fileToUpload) return;
    setIsUploading(true);

    try {
      const signedUrlResult = await getSignedURL({
        fileType: fileToUpload.type,
        fileSize: fileToUpload.size,
        patientId: patient.id,
      });

      if (signedUrlResult.failure) {
        throw new Error(signedUrlResult.failure);
      }
      
      const { url, key } = signedUrlResult.success;

      await fetch(url, {
        method: 'PUT',
        body: fileToUpload,
        headers: { 'Content-Type': fileToUpload.type },
      });

      const newDocument: PatientDocument = {
        id: key,
        name: fileToUpload.name,
        type: 'Tài liệu',
        uploadDate: new Date().toISOString().split('T')[0],
        url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
      };
      
      const updatedDocuments = [...(patient.documents || []), newDocument];
      onUpdatePatient({ ...patient, documents: updatedDocuments });
      setFileToUpload(null);

      toast({
        title: "Tải lên thành công",
        description: `Tệp ${fileToUpload.name} đã được lưu.`,
      });

    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Tải lên thất bại",
        description: (error as Error).message || "Đã có lỗi xảy ra khi tải tệp lên.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isEditing) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin bệnh nhân</DialogTitle>
          <DialogDescription>Cập nhật thông tin chi tiết cho {patient.name}.</DialogDescription>
        </DialogHeader>
        <PatientForm initialData={patient} onSave={handleSave} onClose={() => setIsEditing(false)} />
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
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              Tải lên
            </Button>
          </div>

          {fileToUpload && (
            <div className="flex items-center justify-between p-2 mb-2 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium truncate pr-2">{fileToUpload.name}</p>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleUpload} disabled={isUploading}>
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu"}
                    </Button>
                     <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setFileToUpload(null)} disabled={isUploading}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          )}

          {(patient.documents && patient.documents.length > 0) ? (
            <ul className="space-y-2">
              {patient.documents.map(doc => (
                <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Badge variant="secondary">{doc.type}</Badge>
                    <span className="font-medium text-sm truncate">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">Tải lên: {formatDate(doc.uploadDate)}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <a href={doc.url} download={doc.name} target="_blank" rel="noopener noreferrer">
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
