'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { appointments as mockAppointments, patients as mockPatients, staff, invoices as mockInvoices } from '@/lib/mock-data';
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
import type { Appointment, Patient, Invoice } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsTable } from './components/appointments-table';
import { FindPatientForm } from './components/find-patient-form';
import { InvoiceForm } from '@/app/invoices/components/invoice-form';
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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [walkInQueue, setWalkInQueue] = useState<Patient[]>([]);
  const [isWalkInDialogOpen, setIsWalkInDialogOpen] = useState(false);

  const [invoiceCandidate, setInvoiceCandidate] = useState<Appointment | null>(null);


  useEffect(() => {
    setDate(new Date());

    const loadData = (key: string, mockData: any[]) => {
      try {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
          return JSON.parse(cachedData);
        } else {
          localStorage.setItem(key, JSON.stringify(mockData));
          return mockData;
        }
      } catch (error) {
        console.error(`Failed to access localStorage or parse ${key}`, error);
        return mockData;
      }
    };
    
    setAppointments(loadData('appointments', mockAppointments));
    setPatients(loadData('patients', mockPatients));
    setInvoices(loadData('invoices', mockInvoices));

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
    let appointmentForInvoice: Appointment | undefined;
    const updatedAppointments = appointments.map(app => {
      if (app.id === appointmentId) {
        appointmentForInvoice = { ...app, status: newStatus };
        return appointmentForInvoice;
      }
      return app;
    });

    setAppointments(updatedAppointments);
    try {
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    } catch (error) {
      console.error("Failed to save appointment status to localStorage", error);
    }

    if (newStatus === 'Completed' && appointmentForInvoice) {
        setInvoiceCandidate(appointmentForInvoice);
        const updatedPatients = patients.map(p =>
            p.name === appointmentForInvoice!.patientName
            ? { ...p, lastVisit: appointmentForInvoice!.date }
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
  
  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id' | 'amount'>, status: 'Paid' | 'Pending') => {
    setInvoices(prevInvoices => {
        const totalAmount = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
        const newInvoice: Invoice = {
            ...invoiceData,
            id: `INV${String(prevInvoices.length + 1).padStart(3, '0')}`,
            amount: totalAmount,
            status: status,
        };
        const updatedInvoices = [...prevInvoices, newInvoice];
        try {
            localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
        } catch (error) {
            console.error("Failed to save invoices to localStorage", error);
        }
        return updatedInvoices;
    });
    setInvoiceCandidate(null);
  };

  const handleAddToWalkInQueue = (patient: Patient) => {
    setWalkInQueue(prev => {
        if (prev.some(p => p.id === patient.id)) {
            return prev;
        }
        return [...prev, patient];
    });
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
                  selectedDate={date}
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
      
      {invoiceCandidate && (
        <Dialog open={!!invoiceCandidate} onOpenChange={(open) => !open && setInvoiceCandidate(null)}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tạo hóa đơn</DialogTitle>
                    <DialogDescription>Tạo hóa đơn cho cuộc hẹn đã hoàn thành.</DialogDescription>
                </DialogHeader>
                <InvoiceForm
                    patientName={invoiceCandidate.patientName}
                    onSave={handleSaveInvoice}
                    onClose={() => setInvoiceCandidate(null)}
                />
            </DialogContent>
        </Dialog>
      )}

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
                    Tìm bệnh nhân đã có hoặc tạo hồ sơ mới để thêm vào hàng chờ.
                  </DialogDescription>
                </DialogHeader>
                 <FindPatientForm
                    patients={patients}
                    walkInQueue={walkInQueue}
                    onAddToQueue={handleAddToWalkInQueue}
                    onSaveNewPatient={handleSavePatient}
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
