'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { appointments as mockAppointments, patients as mockPatients, staff } from '@/lib/mock-data';
import { PlusCircle, Calendar as CalendarIcon, Search, UserPlus, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatDate, calculateAge } from '@/lib/utils';
import { DailyTimeline } from './components/daily-timeline';
import { AppointmentForm } from './components/appointment-form';
import { format } from 'date-fns';
import type { Appointment, Patient } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsTable } from './components/appointments-table';
import { PatientForm } from '../patients/components/patient-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [walkInQueue, setWalkInQueue] = useState<Patient[]>([]);
  const [isWalkInDialogOpen, setIsWalkInDialogOpen] = useState(false);


  useEffect(() => {
    setDate(new Date());

    try {
      const cachedAppointments = localStorage.getItem('appointments');
      if (cachedAppointments) {
        setAppointments(JSON.parse(cachedAppointments));
      } else {
        setAppointments(mockAppointments);
        localStorage.setItem('appointments', JSON.stringify(mockAppointments));
      }
      
      const cachedPatients = localStorage.getItem('patients');
      if (cachedPatients) {
        setPatients(JSON.parse(cachedPatients));
      } else {
        setPatients(mockPatients);
        localStorage.setItem('patients', JSON.stringify(mockPatients));
      }

    } catch (error) {
      console.error("Failed to access localStorage or parse data", error);
      setAppointments(mockAppointments);
      setPatients(mockPatients);
    }
  }, []);

  const selectedDateString = date ? format(date, 'yyyy-MM-dd') : '';

  const appointmentsForSelectedDate = useMemo(() =>
    appointments.filter((app) => app.date === selectedDateString),
    [appointments, selectedDateString]
  );
  
  const dailyAppointments = useMemo(() =>
    appointmentsForSelectedDate.filter((app) =>
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [appointmentsForSelectedDate, searchTerm]
  );

  const staffForDay = useMemo(() => {
    const staffNamesOnSchedule = [
      ...new Set(appointmentsForSelectedDate.map((app) => app.doctorName)),
    ];
    if (staffNamesOnSchedule.length === 0) {
      return [];
    }
    return staff.filter((s) => staffNamesOnSchedule.includes(s.name));
  }, [appointmentsForSelectedDate]);

  const handleSaveAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status'>) => {
    setAppointments(prevAppointments => {
        const newAppointment: Appointment = {
            ...newAppointmentData,
            id: `APP${String(prevAppointments.length + 1).padStart(3, '0')}`,
            status: 'Scheduled',
        };
        const updatedAppointments = [...prevAppointments, newAppointment];
        try {
            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        } catch (error) {
            console.error("Failed to save appointments to localStorage", error);
        }
        return updatedAppointments;
    });
  };
  
  const handleUpdateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    const appointmentToUpdate = appointments.find(app => app.id === appointmentId);
    if (!appointmentToUpdate) return;

    const updatedAppointments = appointments.map(app =>
      app.id === appointmentId ? { ...app, status: newStatus } : app
    );
    setAppointments(updatedAppointments);

    try {
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    } catch (error) {
      console.error("Failed to save appointment status to localStorage", error);
    }

    if (newStatus === 'Completed') {
      const updatedPatients = patients.map(p =>
        p.name === appointmentToUpdate.patientName
          ? { ...p, lastVisit: appointmentToUpdate.date }
          : p
      );
      setPatients(updatedPatients);
      try {
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
      } catch (error) {
        console.error("Failed to save updated patients to localStorage", error);
      }
    }
  };

  const handleSavePatient = (newPatientData: Omit<Patient, 'id' | 'lastVisit' | 'avatarUrl'>): Patient => {
    const newPatient: Patient = {
        ...newPatientData,
        id: `PAT${String(patients.length + 1).padStart(3, '0')}`,
        lastVisit: new Date().toISOString().split('T')[0],
        avatarUrl: 'https://placehold.co/100x100.png',
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    try {
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
    } catch (error) {
        console.error("Failed to save patients to localStorage", error);
    }
    return newPatient;
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="timeline" className="space-y-4 flex flex-col h-full">
        <div className="flex items-center justify-between flex-wrap gap-y-4">
          <div className="flex items-center gap-4">
              <h1 className="text-2xl font-headline font-bold">Lịch hẹn</h1>
              <TabsList>
                  <TabsTrigger value="timeline">Dòng thời gian</TabsTrigger>
                  <TabsTrigger value="table">Bảng</TabsTrigger>
              </TabsList>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm theo tên bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-[250px]"
              />
            </div>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDate(format(date, 'yyyy-MM-dd')) : <span>Chọn ngày</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Đặt lịch khám
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lên lịch hẹn mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin chi tiết để lên lịch hẹn mới.
                  </DialogDescription>
                </DialogHeader>
                <AppointmentForm
                  staff={staff}
                  appointments={appointments}
                  patients={patients}
                  onSave={handleSaveAppointment}
                  onSavePatient={handleSavePatient}
                  onClose={() => setIsAppointmentDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="timeline" className="flex-1 overflow-auto">
          <DailyTimeline appointments={dailyAppointments} staff={staffForDay} onUpdateStatus={handleUpdateAppointmentStatus} />
        </TabsContent>
        <TabsContent value="table" className="flex-1 overflow-auto">
          <AppointmentsTable appointments={dailyAppointments} staff={staff} onUpdateStatus={handleUpdateAppointmentStatus} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
                <CardTitle className="font-headline text-xl">Hàng chờ khám</CardTitle>
                <CardDescription>Quản lý bệnh nhân đến khám không có lịch hẹn.</CardDescription>
            </div>
             <Dialog open={isWalkInDialogOpen} onOpenChange={setIsWalkInDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Thêm vào hàng chờ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm bệnh nhân vào hàng chờ</DialogTitle>
                  <DialogDescription>
                    Tạo hồ sơ mới cho bệnh nhân vãng lai. Bệnh nhân sẽ được thêm vào danh sách chung.
                  </DialogDescription>
                </DialogHeader>
                <PatientForm
                  onSave={(patientData) => {
                    const newPatient = handleSavePatient(patientData);
                    setWalkInQueue(prev => [...prev, newPatient]);
                    setIsWalkInDialogOpen(false);
                  }}
                  onClose={() => setIsWalkInDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
          {walkInQueue.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-semibold">Hàng chờ trống</p>
              <p className="text-sm">Hiện không có bệnh nhân nào đang chờ khám.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {walkInQueue.map((patient, index) => (
                <li key={patient.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                    </span>
                    <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {calculateAge(patient.birthYear)} tuổi, {patient.phone}
                        </p>
                    </div>
                  </div>
                  <Button size="sm">Bắt đầu khám</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
