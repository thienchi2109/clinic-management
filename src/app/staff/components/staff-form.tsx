'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import type { Staff } from '@/lib/types';
import { Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import React from 'react';

const staffFormSchema = z.object({
  name: z.string().min(2, { message: 'Tên nhân viên phải có ít nhất 2 ký tự.' }),
  role: z.enum(['Bác sĩ', 'Điều dưỡng', 'admin'], { required_error: 'Vui lòng chọn vai trò.' }),
  phone: z.string().regex(/^[0-9\-\s]+$/, { message: 'Số điện thoại không hợp lệ.' }).min(10, { message: 'Số điện thoại phải có ít nhất 10 ký tự.' }),
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffFormProps {
    initialData?: Staff;
    onSave: (staff: StaffFormValues) => Promise<any>;
    onClose: () => void;
}

// Password generation utility
const generatePassword = (length: number = 8): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

export function StaffForm({ initialData, onSave, onClose }: StaffFormProps) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    
    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            role: initialData.role,
            phone: initialData.phone,
            email: initialData.email,
            password: initialData.password,
        } : {
            name: '',
            role: undefined,
            phone: '',
            email: '',
            password: '',
        },
    });

    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        form.setValue('password', newPassword);
    };

    const onSubmit = async (values: StaffFormValues) => {
        setIsSaving(true);
        try {
            await onSave(values);
        } catch (error) {
            console.error('Error saving staff:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Họ và tên *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập họ và tên" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vai trò *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn vai trò" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Bác sĩ">Bác sĩ</SelectItem>
                                        <SelectItem value="Điều dưỡng">Điều dưỡng</SelectItem>
                                        <SelectItem value="admin">Quản trị viên</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số điện thoại *</FormLabel>
                                <FormControl>
                                    <Input placeholder="090-123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="email@clinic.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu *</FormLabel>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <FormControl>
                                        <Input 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="Nhập mật khẩu" 
                                            {...field} 
                                            className="pr-10"
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGeneratePassword}
                                    className="flex-shrink-0"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Tạo tự động
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                        Hủy
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? 'Cập nhật' : 'Thêm nhân viên'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
