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

const InvoiceDialog = ({ invoice }: { invoice: Invoice }) => (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle className="font-headline">Invoice #{invoice.id}</DialogTitle>
        <DialogDescription>
          Date: {invoice.date} | Status: {invoice.status}
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Patient: {invoice.patientName}</h3>
            <p className="text-sm text-muted-foreground">ID: PAT001</p>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Items:</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Consultation Fee</TableCell>
                        <TableCell className="text-right">$100.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Medication</TableCell>
                        <TableCell className="text-right">$50.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
                <p className="text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">${invoice.amount.toFixed(2)}</p>
            </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
        </Button>
      </DialogFooter>
    </DialogContent>
)


export default function InvoicesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Invoicing</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            View and manage all patient invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.patientName}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">View</Button>
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
