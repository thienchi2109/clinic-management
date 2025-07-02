'use client';

import type { Appointment, Staff, Invoice } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileSearch, Pencil, Trash2, CalendarSearch } from 'lucide-react';
import { AppointmentDetail } from './appointment-detail';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const getStatusVariant = (status: Appointment['status']): 'secondary' | 'accent' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Scheduled':
      return 'secondary';
    case 'Completed':
      return 'accent';
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

const getInvoiceStatusVariant = (status: Invoice['status']): 'accent' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Paid':
      return 'accent';
    case 'Pending':
      return 'secondary';
    case 'Overdue':
      return 'destructive';
    default:
      return 'outline';
  }
};

const translateInvoiceStatus = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'Đã thanh toán';
        case 'Pending': return 'Chờ thanh toán';
        case 'Overdue': return 'Quá hạn';
        default: return status;
    }
}

interface AppointmentsTableProps {
  appointments: Appointment[];
  staff: Staff[];
  invoices: Invoice[];
  onUpdateStatus: (appointmentId: string, newStatus: Appointment['status']) => void;
  onUpdateInvoiceStatus: (invoiceId: string, newStatus: Invoice['status']) => void;
}

export function AppointmentsTable({ appointments, staff, invoices, onUpdateStatus, onUpdateInvoiceStatus }: AppointmentsTableProps) {
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
            <TableHead>Phí dịch vụ</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppointments.map((appointment) => {
            const staffMember = staff.find(s => s.name === appointment.doctorName);
            const invoice = invoices.find(inv => inv.patientName === appointment.patientName && inv.date === appointment.date);
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
                 <TableCell>
                  {invoice ? formatCurrency(invoice.amount) : '–'}
                </TableCell>
                <TableCell>
                  {invoice ? (
                    <Badge variant={getInvoiceStatusVariant(invoice.status)}>
                      {translateInvoiceStatus(invoice.status)}
                    </Badge>
                  ) : (
                    '–'
                  )}
                </TableCell>
                <TableCell className="text-right">
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Mở menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem>
                                      <FileSearch className="mr-2 h-4 w-4" />
                                      <span>Xem chi tiết</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Sửa</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Xóa</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AppointmentDetail 
                            appointment={appointment} 
                            staffMember={staffMember} 
                            invoice={invoice}
                            onUpdateStatus={onUpdateStatus}
                            onUpdateInvoiceStatus={onUpdateInvoiceStatus}
                        />
                    </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
