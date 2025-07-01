'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { appointments as mockAppointments, staff } from '@/lib/mock-data';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
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
import { formatDate } from '@/lib/utils';
import { DailyTimeline } from './components/daily-timeline';
import { AppointmentForm } from './components/appointment-form';
import { format } from 'date-fns';
import type { Appointment } from '@/lib/types';

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Set date only on the client-side to prevent hydration mismatch
    setDate(new Date());
  }, []);

  const selectedDateString = date ? format(date, 'yyyy-MM-dd') : '';

  const dailyAppointments = appointments.filter(
    (app) => app.date === selectedDateString
  );

  const staffForDay = useMemo(() => {
    const staffNamesOnSchedule = [
      ...new Set(dailyAppointments.map((app) => app.doctorName)),
    ];
    if (staffNamesOnSchedule.length === 0) {
      return [];
    }
    return staff.filter((s) => staffNamesOnSchedule.includes(s.name));
  }, [dailyAppointments]);

  const handleSaveAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
        ...newAppointmentData,
        id: `APP${String(appointments.length + 1).padStart(3, '0')}`,
        status: 'Scheduled',
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Lịch hẹn</h1>
        <div className="flex items-center gap-4">
          <Popover>
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
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                onSave={handleSaveAppointment}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <DailyTimeline appointments={dailyAppointments} staff={staffForDay} />
      </div>
    </div>
  );
}
