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
import { medications } from '@/lib/mock-data';
import { PlusCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const getExpiryStatus = (expiryDate: string) => {
  const today = new Date();
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
