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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, FileSearch, Pencil, Trash2, Calendar, Clock, User, Stethoscope, Tag, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { ReactNode } from 'react';

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

const getStatusInfoForDetail = (status: Appointment['status']): {
    text: string,
    variant: 'default' | 'secondary' | 'destructive',
    icon: React.FC<React.SVGProps<SVGSVGElement>>
} => {
  switch (status) {
    case 'Scheduled':
      return { text: 'Đã lên lịch', variant: 'secondary', icon: AlertCircle };
    case 'Completed':
      return { text: 'Hoàn thành', variant: 'default', icon: CheckCircle2 };
    case 'Cancelled':
      return { text: 'Đã hủy', variant: 'destructive', icon: XCircle };
    default:
      return { text: status, variant: 'secondary', icon: AlertCircle };
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
            const statusInfo = getStatusInfoForDetail(appointment.status);
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
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="font-headline text-xl">
                                    Chi tiết lịch hẹn
                                </DialogTitle>
                            </DialogHeader>
                             <div className="space-y-4 py-4">
                                <div className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/30">
                                    {staffMember?.avatarUrl && (
                                        <Avatar className="h-16 w-16 border">
                                            <AvatarImage src={staffMember.avatarUrl} alt={staffMember.name} data-ai-hint="doctor nurse" />
                                            <AvatarFallback>{staffMember.name.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <User className="h-5 w-5 text-primary" />
                                            {appointment.patientName}
                                        </h3>
                                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <Stethoscope className="h-4 w-4" />
                                            với {appointment.doctorName}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{formatDate(appointment.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{appointment.startTime} - {appointment.endTime}</span>
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        <Badge variant={statusInfo.variant} className="flex items-center gap-1.5">
                                            <statusInfo.icon className="h-3.5 w-3.5" />
                                            {statusInfo.text}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
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
