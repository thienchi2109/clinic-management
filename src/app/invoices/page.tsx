'use client';
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
import { invoices } from '@/lib/mock-data';
import { Printer } from 'lucide-react';
import type { Invoice } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';

const getStatusVariant = (status: Invoice['status']) => {
  switch (status) {
    case 'Paid':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Overdue':
      return 'destructive';
    default:
      return 'outline';
  }
};

const translateStatus = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'Đã thanh toán';
        case 'Pending': return 'Chờ thanh toán';
        case 'Overdue': return 'Quá hạn';
        default: return status;
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

const InvoiceDialog = ({ invoice }: { invoice: Invoice }) => (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle className="font-headline">Hóa đơn #{invoice.id}</DialogTitle>
        <DialogDescription>
          Ngày: {formatDate(invoice.date)} | Trạng thái: {translateStatus(invoice.status)}
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Bệnh nhân: {invoice.patientName}</h3>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Các mục:</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Dịch vụ</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoice.items.map(item => (
                         <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
                <p className="text-muted-foreground">Tổng cộng</p>
                <p className="text-2xl font-bold">{formatCurrency(invoice.amount)}</p>
            </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            In hóa đơn
        </Button>
      </DialogFooter>
    </DialogContent>
)


export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Lịch sử Hóa đơn</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả hóa đơn</CardTitle>
          <CardDescription>
            Xem lại lịch sử thanh toán của bệnh nhân.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.patientName}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {translateStatus(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">Xem</Button>
                        </DialogTrigger>
                        <InvoiceDialog invoice={invoice} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
