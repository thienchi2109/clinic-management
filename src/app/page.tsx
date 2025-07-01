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
import { Activity, Calendar, Users, Pill } from 'lucide-react';
import { appointments, patients, medications } from '@/lib/mock-data';

export default function Dashboard() {
  const today = new Date();
  const todaysAppointments = appointments.filter(
    (app) => new Date(app.date).toDateString() === today.toDateString()
  );
  const expiringSoonCount = medications.filter(med => {
    const expiry = new Date(med.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <h1 className="text-2xl font-headline font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appointments Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {appointments.filter(a => a.status === "Completed").length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">
              Medications expiring in next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+57</div>
            <p className="text-xs text-muted-foreground">
              +2 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                Overview of recently visited patients.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Gender
                  </TableHead>
                  <TableHead className="text-right">Last Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.slice(0, 5).map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="font-medium">{patient.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        Age: {patient.age}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      {patient.gender}
                    </TableCell>
                    <TableCell className="text-right">
                      {patient.lastVisit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              A list of appointments scheduled for today.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {appointment.patientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      with {appointment.doctorName}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant={appointment.status === 'Scheduled' ? 'default' : 'secondary'} className='bg-primary/20 text-primary-foreground hover:bg-primary/30'>
                      {appointment.time}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No appointments scheduled for today.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
