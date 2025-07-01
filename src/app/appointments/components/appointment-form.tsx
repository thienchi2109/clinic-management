'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Appointment, Staff } from '@/lib/types';

const appointmentFormSchema = z.object({
  patientName: z.string().min(2, { message: 'Tên bệnh nhân phải có ít nhất 2 ký tự.' }),
  doctorName: z.string({ required_error: 'Vui lòng chọn bác sĩ.' }),
  date: z.date({ required_error: 'Vui lòng chọn ngày.' }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Thời gian không hợp lệ (HH:mm).' }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Thời gian không hợp lệ (HH:mm).' }),
}).refine(data => data.endTime > data.startTime, {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu.",
    path: ["endTime"],
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
    staff: Staff[];
    onSave: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
    onClose: () => void;
}

export function AppointmentForm({ staff, onSave, onClose }: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: '',
      startTime: '',
      endTime: '',
    },
  });

  function onSubmit(data: AppointmentFormValues) {
    const newAppointment = {
        patientName: data.patientName,
        doctorName: data.doctorName,
        date: format(data.date, 'yyyy-MM-dd'),
        startTime: data.startTime,
        endTime: data.endTime,
    };
    onSave(newAppointment);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên bệnh nhân</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="doctorName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bác sĩ/Điều dưỡng</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn một nhân viên y tế" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {staff.map((staffMember) => (
                        <SelectItem key={staffMember.id} value={staffMember.name}>
                        {staffMember.name} ({staffMember.role})
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày khám</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        formatDate(format(field.value, 'yyyy-MM-dd'))
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Giờ bắt đầu</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Giờ kết thúc</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" className="w-full">Lưu lịch hẹn</Button>
      </form>
    </Form>
  );
}
