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
import { PlusCircle, Printer } from 'lucide-react';
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
            <p className="text-sm text-muted-foreground">ID: PAT001</p>
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
                    <TableRow>
                        <TableCell>Phí tư vấn</TableCell>
                        <TableCell className="text-right">$100.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Thuốc</TableCell>
                        <TableCell className="text-right">$50.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
                <p className="text-muted-foreground">Tổng cộng</p>
                <p className="text-2xl font-bold">${invoice.amount.toFixed(2)}</p>
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
        <h1 className="text-2xl font-headline font-bold">Hóa đơn</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tạo hóa đơn
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử hóa đơn</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả hóa đơn của bệnh nhân.
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
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
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
