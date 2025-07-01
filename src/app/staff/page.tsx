import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { staff } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Nhân viên y tế</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm nhân viên
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {staff.map((staffMember) => (
          <Card key={staffMember.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={staffMember.avatarUrl} alt={staffMember.name} data-ai-hint="doctor nurse" />
                <AvatarFallback>{staffMember.name.slice(0,2)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <CardTitle className="font-headline">{staffMember.name}</CardTitle>
                <CardDescription>
                  <Badge variant={staffMember.role === 'Bác sĩ' ? 'default' : 'secondary'}>{staffMember.role}</Badge>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{staffMember.phone}</span>
                </div>
                 <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{staffMember.email}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">Xem chi tiết</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
