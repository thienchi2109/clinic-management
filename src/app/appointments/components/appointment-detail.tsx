'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Appointment, Staff } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, Stethoscope, Tag, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const getStatusInfo = (status: Appointment['status']): {
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

interface AppointmentDetailProps {
  appointment: Appointment;
  staffMember?: Staff;
}

export function AppointmentDetail({ appointment, staffMember }: AppointmentDetailProps) {
  const statusInfo = getStatusInfo(appointment.status);

  return (
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

            {staffMember && (
                 <div className="p-4 border rounded-lg space-y-2 text-sm">
                    <h4 className="font-semibold text-base mb-2">Thông tin nhân viên y tế</h4>
                    <p><strong>Chức vụ:</strong> {staffMember.role}</p>
                    <p><strong>Email:</strong> {staffMember.email}</p>
                    <p><strong>SĐT:</strong> {staffMember.phone}</p>
                 </div>
            )}
        </div>
      </DialogContent>
  );
}
