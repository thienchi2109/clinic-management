'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patients as mockPatients, documents } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, UploadCloud, Bell, Phone, MapPin, HeartPulse } from 'lucide-react';
import type { Patient } from '@/lib/types';
import { formatDate, calculateAge } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PatientForm } from './components/patient-form';

const translateGender = (gender: Patient['gender']) => {
    switch(gender) {
        case 'Male': return 'Nam';
        case 'Female': return 'Nữ';
        case 'Other': return 'Khác';
        default: return gender;
    }
}

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        try {
            const cachedPatients = localStorage.getItem('patients');
            if (cachedPatients) {
                setPatients(JSON.parse(cachedPatients));
            } else {
                setPatients(mockPatients);
                localStorage.setItem('patients', JSON.stringify(mockPatients));
            }
        } catch (error) {
            console.error("Failed to access localStorage or parse patients", error);
            setPatients(mockPatients);
        }
    }, []);

    const handleSavePatient = (newPatientData: Omit<Patient, 'id' | 'lastVisit' | 'avatarUrl'>) => {
        setPatients(prevPatients => {
            const newPatient: Patient = {
                ...newPatientData,
                id: `PAT${String(prevPatients.length + 1).padStart(3, '0')}`,
                lastVisit: new Date().toISOString().split('T')[0], // Set last visit to today
                avatarUrl: 'https://placehold.co/100x100.png',
            };
            const updatedPatients = [...prevPatients, newPatient];
            try {
                localStorage.setItem('patients', JSON.stringify(updatedPatients));
            } catch (error) {
                console.error("Failed to save patients to localStorage", error);
            }
            return updatedPatients;
        });
    };
  
    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Hồ sơ bệnh nhân</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Thêm bệnh nhân mới
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm hồ sơ bệnh nhân mới</DialogTitle>
                    <DialogDescription>Nhập thông tin chi tiết cho bệnh nhân.</DialogDescription>
                </DialogHeader>
                <PatientForm
                    onSave={handleSavePatient}
                    onClose={() => setIsDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <Card key={patient.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <CardTitle className="font-headline">{patient.name}</CardTitle>
                <CardDescription>
                  {calculateAge(patient.birthYear)} tuổi, {translateGender(patient.gender)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{patient.address}</span>
                    </div>
                    {patient.medicalHistory && (
                        <div className="flex items-start gap-2 pt-2">
                            <HeartPulse className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                            <p className="text-sm text-foreground">{patient.medicalHistory}</p>
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="text-sm font-semibold mb-2 text-primary">Tài liệu gần đây</h4>
                    <div className="space-y-2">
                        {documents.slice(0, 1).map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-2 rounded-md border">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm font-medium">{doc.name}</span>
                                </div>
                                <Button variant="ghost" size="sm">Xem</Button>
                            </div>
                        ))}
                    </div>
                </div>
                 <Button variant="outline" className="w-full mt-4">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Tải lên tài liệu
                </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">Lần khám cuối: {formatDate(patient.lastVisit)}</p>
                <Button variant="secondary" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Nhắc nhở
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
