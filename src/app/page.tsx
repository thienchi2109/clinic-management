
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
import { Activity, Calendar, Users, Pill, Loader2 } from 'lucide-react';
import type { Patient, Appointment, Medication } from '@/lib/types';
import { formatDate, calculateAge } from '@/lib/utils';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const translateGender = (gender: Patient['gender']) => {
    switch(gender) {
        case 'Male': return 'Nam';
        case 'Female': return 'Nữ';
        case 'Other': return 'Khác';
        default: return gender;
    }
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsSnapshot, appointmentsSnapshot, medicationsSnapshot] = await Promise.all([
          getDocs(collection(db, 'patients')),
          getDocs(collection(db, 'appointments')),
          getDocs(collection(db, 'medications')),
        ]);
        
        setPatients(patientsSnapshot.docs.map(doc => ({ ...doc.data() as Patient, id: doc.id })));
        setAppointments(appointmentsSnapshot.docs.map(doc => ({ ...doc.data() as Appointment, id: doc.id })));
        setMedications(medicationsSnapshot.docs.map(doc => ({ ...doc.data() as Medication, id: doc.id })));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const today = new Date('2024-07-30'); // Use static date to match mock data
  const todaysAppointments = appointments.filter(
    (app) => app.date === '2024-07-30'
  );
  
  const expiringSoonCount = medications.filter(med => {
    const expiry = new Date(med.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <h1 className="text-2xl font-headline font-bold">Bảng điều khiển</h1>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số bệnh nhân</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              +10% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lịch hẹn hôm nay
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {appointments.filter(a => a.status === "Completed").length} hoàn thành
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">
              Thuốc hết hạn trong 30 ngày tới
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ca đang hoạt động</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+57</div>
            <p className="text-xs text-muted-foreground">
              +2 từ giờ trước
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Bệnh nhân gần đây</CardTitle>
              <CardDescription>
                Tổng quan về các bệnh nhân đã khám gần đây.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Giới tính
                  </TableHead>
                  <TableHead className="text-right">Lần khám cuối</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.slice(0, 5).map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="font-medium">{patient.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        Tuổi: {calculateAge(patient.birthYear)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      {translateGender(patient.gender)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(patient.lastVisit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lịch hẹn hôm nay</CardTitle>
            <CardDescription>
              Danh sách các lịch hẹn trong hôm nay.
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
                      với {appointment.doctorName}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant="secondary">
                      {appointment.startTime}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Không có lịch hẹn nào cho hôm nay.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
