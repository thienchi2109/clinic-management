'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon, Loader2, Stethoscope, CreditCard } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { format } from 'date-fns';
import type { Appointment, MedicalRecord } from '@/lib/types';

const medicalRecordSchema = z.object({
  symptoms: z.string().min(1, 'Vui lòng nhập triệu chứng.'),
  diagnosis: z.string().min(1, 'Vui lòng nhập chẩn đoán.'),
  treatment: z.string().min(1, 'Vui lòng nhập phương pháp điều trị.'),
  prescription: z.string().optional(),
  nextAppointment: z.date().optional(),
  notes: z.string().optional(),
});

type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;

interface MedicalRecordFormProps {
  appointment: Appointment;
  onSave: (recordData: Omit<MedicalRecord, 'id'>) => Promise<void>;
  onClose: () => void;
  onCreateInvoice?: () => void;
}

export function MedicalRecordForm({ appointment, onSave, onClose, onCreateInvoice }: MedicalRecordFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      symptoms: '',
      diagnosis: '',
      treatment: '',
      prescription: '',
      notes: '',
    },
  });

  async function onSubmit(data: MedicalRecordFormValues) {
    setIsSaving(true);
    try {
      const medicalRecord: Omit<MedicalRecord, 'id'> = {
        patientId: '', // Will be populated by the parent component
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        date: appointment.date,
        doctorName: appointment.doctorName,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        prescription: data.prescription || undefined,
        nextAppointment: data.nextAppointment ? format(data.nextAppointment, 'yyyy-MM-dd') : undefined,
        notes: data.notes || undefined,
      };
      
      await onSave(medicalRecord);
      onClose();
    } catch (error) {
      console.error('Error saving medical record:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Ghi nhận kết quả khám bệnh</h3>
      </div>
      
      <div className="p-4 bg-secondary/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Bệnh nhân:</strong> {appointment.patientName} | 
          <strong> Ngày khám:</strong> {formatDate(appointment.date)} | 
          <strong> Bác sĩ:</strong> {appointment.doctorName}
        </p>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Triệu chứng <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả triệu chứng của bệnh nhân..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chẩn đoán <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Chẩn đoán bệnh của bác sĩ..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương pháp điều trị <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Phương pháp điều trị được chỉ định..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn thuốc</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Kê đơn thuốc (nếu có)... TODO: Phát triển chi tiết hơn trong tương lai" 
                      className="min-h-[60px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextAppointment"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày hẹn tái khám</FormLabel>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatDate(format(field.value, 'yyyy-MM-dd'))
                          ) : (
                            <span>Chọn ngày hẹn tái khám (nếu có)</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsCalendarOpen(false);
                        }}
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú thêm</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ghi chú thêm về tình trạng bệnh nhân..." 
                      className="min-h-[60px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </ScrollArea>

      {/* Action buttons outside ScrollArea - always visible */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving} 
            className="flex-1"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Đang lưu...' : 'Lưu kết quả khám'}
          </Button>
        </div>
        
        {onCreateInvoice && (
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={onCreateInvoice}
              className="w-full"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Tạo hóa đơn (tùy chọn)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 