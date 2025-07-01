'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { appointments, doctors } from '@/lib/mock-data';
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
import { format } from 'date-fns';

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date(2024, 6, 30));

  const selectedDateString = date ? format(date, 'yyyy-MM-dd') : undefined;

  const dailyAppointments = appointments.filter(
    (app) => app.date === selectedDateString
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Lịch hẹn</h1>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDateString ? formatDate(selectedDateString) : <span>Chọn ngày</span>}
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm đặt lịch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lên lịch hẹn mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết để lên lịch hẹn mới.
                </DialogDescription>
              </DialogHeader>
              <p className="text-center text-muted-foreground pt-4">
                Biểu mẫu tạo lịch hẹn đang được xây dựng.
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <DailyTimeline appointments={dailyAppointments} doctors={doctors} />
      </div>
    </div>
  );
}
