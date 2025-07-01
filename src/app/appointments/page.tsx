'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appointments } from '@/lib/mock-data';
import { PlusCircle, Clock } from 'lucide-react';
import type { Appointment } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { formatDate } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const getStatusVariant = (status: Appointment['status']) => {
  switch (status) {
    case 'Scheduled':
      return 'default';
    case 'Completed':
      return 'secondary';
    case 'Cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

const translateStatus = (status: Appointment['status']) => {
  switch (status) {
    case 'Scheduled':
      return 'Đã lên lịch';
    case 'Completed':
      return 'Đã hoàn thành';
    case 'Cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date('2024-07-30'));

  const selectedDateString = date ? date.toISOString().split('T')[0] : undefined;

  const dailyAppointments = appointments
    .filter((app) => app.date === selectedDateString)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Lịch hẹn</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tạo lịch hẹn mới
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                initialFocus
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Lịch hẹn cho ngày {date ? formatDate(date.toISOString().split('T')[0]) : ''}
              </CardTitle>
              <CardDescription>
                Bạn có {dailyAppointments.length} cuộc hẹn trong ngày này.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
                  {dailyAppointments.length > 0 ? (
                    dailyAppointments.map((appointment, index) => (
                      <React.Fragment key={appointment.id}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-semibold">
                                {appointment.patientName}
                              </p>
                              <Badge
                                variant={getStatusVariant(appointment.status)}
                              >
                                {translateStatus(appointment.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              với {appointment.doctorName}
                            </p>
                            <p className="text-sm font-semibold text-primary">
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                        {index < dailyAppointments.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed">
                      <p className="text-muted-foreground">
                        Không có cuộc hẹn nào được lên lịch.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả lịch hẹn</CardTitle>
          <CardDescription>
            Quản lý và xem tất cả các lịch hẹn đã đặt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Bác sĩ</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.patientName}
                  </TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(appointment.status)}>
                      {translateStatus(appointment.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
