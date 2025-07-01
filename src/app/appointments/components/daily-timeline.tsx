'use client';

import type { Appointment, Staff } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CalendarSearch } from 'lucide-react';
import { AppointmentDetail } from './appointment-detail';

// Helper function to convert 'HH:mm' to minutes since midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getStatusClasses = (status: Appointment['status']) => {
    switch (status) {
        case 'Scheduled': return 'bg-primary/80 border-primary text-primary-foreground';
        case 'Completed': return 'bg-accent border-accent/80 text-accent-foreground';
        case 'Cancelled': return 'bg-destructive/80 border-destructive text-destructive-foreground opacity-80';
        default: return 'bg-muted border-border';
    }
};

export function DailyTimeline({
  appointments,
  staff,
}: {
  appointments: Appointment[];
  staff: Staff[];
}) {
  const START_HOUR = 7;
  const END_HOUR = 18;
  const timeSlots = Array.from({ length: (END_HOUR - START_HOUR) * 2 }, (_, i) => {
    const totalMinutes = START_HOUR * 60 + i * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  });

  if (staff.length === 0) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[400px]">
        <CardContent className="text-center text-muted-foreground">
          <CalendarSearch className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">Không có lịch hẹn</p>
          <p>Không có lịch hẹn nào được lên lịch cho ngày đã chọn.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-full w-max">
        <CardContent className="p-0">
            <div
                className="grid relative"
                style={{
                    gridTemplateColumns: `4rem repeat(${staff.length}, minmax(140px, 1fr))`,
                }}
            >
                {/* Time gutter with lines */}
                <div className="sticky left-0 z-20 bg-card">
                    <div className="h-12 border-b border-r"></div> {/* Header space */}
                    {timeSlots.map((time, i) => (
                        <div key={time} className="h-14 border-b border-r flex items-start justify-center pt-1">
                            {i % 2 === 0 && <span className="text-xs text-muted-foreground -translate-y-1/2 bg-card px-1">{time}</span>}
                        </div>
                    ))}
                </div>

                {/* Doctor columns */}
                {staff.map(staffMember => (
                    <div key={staffMember.id} className="relative border-r">
                        <div className="sticky top-0 z-10 h-12 border-b flex items-center justify-center font-semibold text-center p-2 bg-card">{staffMember.name}</div>
                        {timeSlots.map((_, i) => (
                            <div key={i} className="h-14 border-b"></div>
                        ))}
                        {appointments.filter(a => a.doctorName === staffMember.name).map(appointment => {
                            const startMinutes = timeToMinutes(appointment.startTime);
                            const endMinutes = timeToMinutes(appointment.endTime);
                            const topOffset = ((startMinutes - START_HOUR * 60) / 30) * 3.5; // 3.5rem is height of a 30-min slot
                            const height = ((endMinutes - startMinutes) / 30) * 3.5;
                            const appointmentStaff = staff.find(s => s.name === appointment.doctorName);
                            
                            return (
                                <AppointmentDetail
                                    key={appointment.id}
                                    appointment={appointment}
                                    staffMember={appointmentStaff}
                                    trigger={
                                        <div
                                            className={cn("absolute w-[90%] left-[5%] rounded-lg p-1.5 text-xs shadow cursor-pointer hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-primary", getStatusClasses(appointment.status))}
                                            style={{
                                                top: `calc(3rem + ${topOffset}rem)`, // 3rem is header height
                                                height: `${height}rem`,
                                            }}
                                            tabIndex={0}
                                        >
                                            <p className="font-semibold truncate">{appointment.patientName}</p>
                                            <p>{appointment.startTime} - {appointment.endTime}</p>
                                        </div>
                                    }
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
