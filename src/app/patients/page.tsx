import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patients, documents } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, UploadCloud, Bell } from 'lucide-react';
import type { Patient } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const translateGender = (gender: Patient['gender']) => {
    switch(gender) {
        case 'Male': return 'Nam';
        case 'Female': return 'Nữ';
        case 'Other': return 'Khác';
        default: return gender;
    }
}

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Hồ sơ bệnh nhân</h1>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          Thêm bệnh nhân mới
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <Card key={patient.id}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <CardTitle className="font-headline">{patient.name}</CardTitle>
                <CardDescription>
                  {patient.age} tuổi, {translateGender(patient.gender)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
                <h4 className="text-sm font-semibold mb-2 text-primary">Tài liệu</h4>
                <div className="space-y-2">
                    {documents.slice(0, 2).map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-2 rounded-md border">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">{doc.name}</span>
                            </div>
                            <Button variant="ghost" size="sm">Xem</Button>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" className="w-full mt-4">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Tải lên tài liệu
                </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">Lần khám cuối: {formatDate(patient.lastVisit)}</p>
                <Button variant="secondary" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Nhắc nhở
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
