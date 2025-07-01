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

export default function PatientsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Patient Records</h1>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          Add New Patient
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
                  {patient.age} years old, {patient.gender}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
                <h4 className="text-sm font-semibold mb-2 text-primary">Documents</h4>
                <div className="space-y-2">
                    {documents.slice(0, 2).map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-2 rounded-md border">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">{doc.name}</span>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" className="w-full mt-4">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                <Button variant="secondary" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Remind
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
