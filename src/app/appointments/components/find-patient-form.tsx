'use client';

import * as React from 'react';
import { UserPlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PatientForm } from '@/app/patients/components/patient-form';
import type { Patient } from '@/lib/types';

interface FindPatientFormProps {
  patients: Patient[];
  walkInQueue: Patient[];
  onAddToQueue: (patient: Patient) => void;
  onSaveNewPatient: (patientData: Omit<Patient, 'id' | 'lastVisit' | 'avatarUrl'>) => Patient;
  onClose: () => void;
}

export function FindPatientForm({ patients, walkInQueue, onAddToQueue, onSaveNewPatient, onClose }: FindPatientFormProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | undefined>();
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  const availablePatients = patients.filter(p => !walkInQueue.some(q => q.id === p.id));
  
  const filteredPatients = React.useMemo(() => {
    if (!searchTerm) {
      return availablePatients;
    }
    return availablePatients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, availablePatients]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleAddToQueue = () => {
    if (selectedPatient) {
      if (walkInQueue.some(p => p.id === selectedPatient.id)) {
        setError('Bệnh nhân này đã có trong hàng chờ.');
        return;
      }
      setError('');
      onAddToQueue(selectedPatient);
      onClose();
    }
  };
  
  const handleSaveNewPatient = (patientData: Omit<Patient, 'id' | 'lastVisit' | 'avatarUrl'>) => {
    const newPatient = onSaveNewPatient(patientData);
    onAddToQueue(newPatient);
    setIsNewPatientDialogOpen(false);
    onClose();
  };

  return (
    <div className="py-4 space-y-4">
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="patient-search">Tìm bệnh nhân hiện có</Label>
          <Input
            id="patient-search"
            placeholder="Nhập tên bệnh nhân để tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-[200px] w-full rounded-md border">
            <div className="p-2">
                {filteredPatients.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground p-4">Không tìm thấy bệnh nhân.</p>
                ) : (
                    filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatientId(patient.id);
                          setError('');
                        }}
                        className={cn(
                          "w-full text-left p-2 rounded-md text-sm hover:bg-accent",
                          selectedPatientId === patient.id && "bg-accent text-accent-foreground"
                        )}
                      >
                        {patient.name}
                      </button>
                    ))
                )}
            </div>
        </ScrollArea>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        
        <Button onClick={handleAddToQueue} disabled={!selectedPatient}>
          Thêm bệnh nhân đã chọn vào hàng chờ
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
        </div>
      </div>

      <Dialog open={isNewPatientDialogOpen} onOpenChange={setIsNewPatientDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Tạo hồ sơ bệnh nhân mới
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm hồ sơ bệnh nhân mới</DialogTitle>
          </DialogHeader>
          <PatientForm
            onSave={handleSaveNewPatient}
            onClose={() => setIsNewPatientDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
