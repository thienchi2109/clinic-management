
'use client';

import React, { useState, useEffect } from 'react';
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
import { medications as mockMedications } from '@/lib/mock-data';
import { PlusCircle, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Medication } from '@/lib/types';
import { seedAndFetchCollection } from '@/lib/firestore-utils';
import { useToast } from '@/hooks/use-toast';

const getExpiryStatus = (expiryDate: string) => {
  const today = new Date('2024-07-30'); // Use static date to prevent hydration errors
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: 'Đã hết hạn', variant: 'destructive' as const };
  }
  if (diffDays <= 30) {
    return { text: 'Sắp hết hạn', variant: 'secondary' as const };
  }
  return { text: 'Còn hàng', variant: 'default' as const };
};

export default function InventoryPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
        try {
            const medicationsData = await seedAndFetchCollection('medications', mockMedications);
            setMedications(medicationsData);
        } catch (error) {
            console.error("Failed to load medications from Firestore", error);
             toast({
                variant: 'destructive',
                title: 'Lỗi tải dữ liệu',
                description: 'Không thể tải dữ liệu kho thuốc từ máy chủ.'
            });
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Kho thuốc</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm thuốc
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mức tồn kho</CardTitle>
          <CardDescription>
            Theo dõi tồn kho và hạn sử dụng của thuốc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thuốc</TableHead>
                <TableHead>Số lô</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((med) => {
                const status = getExpiryStatus(med.expiryDate);
                return (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.batchNo}</TableCell>
                    <TableCell>{formatDate(med.expiryDate)}</TableCell>
                    <TableCell>{med.stock}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
