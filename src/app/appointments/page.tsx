'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { appointments as mockAppointments, staff } from '@/lib/mock-data';
import { PlusCircle, Calendar as CalendarIcon, Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>();
  // Initialize with an empty array to prevent hydration mismatch, will be populated from localStorage.
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // This effect runs only on the client to prevent hydration errors.
    
    // Set the initial date.
    setDate(new Date());

    // Load appointments from localStorage or fall back to mock data.
    try {
      const cachedAppointments = localStorage.getItem('appointments');
      if (cachedAppointments) {
        setAppointments(JSON.parse(cachedAppointments));
      } else {
        // If nothing in cache, use mock data and cache it for next time.
        setAppointments(mockAppointments);
        localStorage.setItem('appointments', JSON.stringify(mockAppointments));
      }
    } catch (error) {
      console.error("Failed to access localStorage or parse appointments", error);
      // Fallback to mock data if localStorage fails.
      setAppointments(mockAppointments);
    }
  }, []); // Empty dependency array ensures it runs once on mount.

  const selectedDateString = date ? format(date, 'yyyy-MM-dd') : '';

  // Get all appointments for the selected date, before applying search filter.
  const appointmentsForSelectedDate = useMemo(() =>
    appointments.filter((app) => app.date === selectedDateString),
    [appointments, selectedDateString]
  );
  
  // Apply search filter to the day's appointments.
  const dailyAppointments = useMemo(() =>
    appointmentsForSelectedDate.filter((app) =>
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [appointmentsForSelectedDate, searchTerm]
  );

  // Determine which staff to display based on all appointments for the day, so columns don't disappear when searching.
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
            // Update localStorage whenever a new appointment is saved.
            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        } catch (error) {
            console.error("Failed to save appointments to localStorage", error);
        }
        return updatedAppointments;
    });
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        <h1 className="text-2xl font-headline font-bold">Lịch hẹn</h1>
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
