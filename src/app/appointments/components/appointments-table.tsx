'use client';

import type { Appointment, Staff } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppointmentDetail } from './appointment-detail';

const getStatusVariant = (status: Appointment['status']) => {
  switch (status) {
    case 'Scheduled':
      return 'secondary';
    case 'Completed':
      return 'default';
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
      return 'Hoàn thành';
    case 'Cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

export function AppointmentsTable({ appointments, staff }: { appointments: Appointment[], staff: Staff[] }) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
          <CalendarSearch className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">Không tìm thấy lịch hẹn</p>
          <p>Không có lịch hẹn nào khớp với tìm kiếm của bạn cho ngày đã chọn.</p>
        </CardContent>
      </Card>
    );
  }

  const sortedAppointments = [...appointments].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Thời gian</TableHead>
            <TableHead>Bệnh nhân</TableHead>
            <TableHead>Bác sĩ/Điều dưỡng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppointments.map((appointment) => {
            const staffMember = staff.find(s => s.name === appointment.doctorName);
            return (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  {appointment.startTime} - {appointment.endTime}
                </TableCell>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(appointment.status)}>
                    {translateStatus(appointment.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <AppointmentDetail
                        appointment={appointment}
                        staffMember={staffMember}
                        trigger={<Button variant="ghost" size="sm">Xem</Button>}
                    />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
