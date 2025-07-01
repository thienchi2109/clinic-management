'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | undefined>();
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  const availablePatients = patients.filter(p => !walkInQueue.some(q => q.id === p.id));
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
          <Label>Tìm bệnh nhân hiện có</Label>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={popoverOpen}
                className="w-full justify-between"
              >
                {selectedPatientId
                  ? availablePatients.find((patient) => patient.id === selectedPatientId)?.name
                  : "Tìm hoặc chọn bệnh nhân..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Tìm bệnh nhân..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy bệnh nhân.</CommandEmpty>
                  <CommandGroup>
                    {availablePatients.map((patient) => (
                      <CommandItem
                        key={patient.id}
                        value={patient.name}
                        onSelect={() => {
                          setSelectedPatientId(patient.id);
                          setError('');
                          setPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPatientId === patient.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {patient.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </div>
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
