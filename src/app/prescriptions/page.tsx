'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';

import {
  PrescriptionDialog,
  PrescriptionList,
  PrescriptionDetailDialog,
  type Prescription
} from '@/components/prescriptions';

// Mock data for testing
import { prescriptions as mockPrescriptions, patients } from '@/lib/mock-data';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  // Mock doctor info
  const currentDoctor = {
    id: 'DOC001',
    name: 'Bs. Minh',
    license: '001234/BYT-CCHN'
  };

  const handleCreatePrescription = (prescription: Prescription) => {
    setPrescriptions(prev => [prescription, ...prev]);
    toast.success('Đã tạo đơn thuốc thành công');
  };

  const handleUpdatePrescription = (updatedPrescription: Prescription) => {
    setPrescriptions(prev => 
      prev.map(p => p.id === updatedPrescription.id ? updatedPrescription : p)
    );
    setEditingPrescription(null);
    toast.success('Đã cập nhật đơn thuốc thành công');
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailDialog(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setShowCreateDialog(true);
  };

  const handlePrintPrescription = (prescription: Prescription) => {
    // TODO: Implement print functionality in Phase 4
    toast.info('Chức năng in đơn thuốc sẽ được phát triển trong Phase 4');
    console.log('Print prescription:', prescription);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn thuốc</h1>
          <p className="text-gray-600 mt-2">
            Tạo, quản lý và theo dõi đơn thuốc cho bệnh nhân
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tạo đơn thuốc mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đơn thuốc</p>
                <p className="text-2xl font-bold">{prescriptions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bản nháp</p>
                <p className="text-2xl font-bold text-orange-600">
                  {prescriptions.filter(p => p.status === 'Draft').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {prescriptions.filter(p => p.status === 'Finalized').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã cấp thuốc</p>
                <p className="text-2xl font-bold text-blue-600">
                  {prescriptions.filter(p => p.status === 'Dispensed').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescription List */}
      <PrescriptionList
        prescriptions={prescriptions}
        onView={handleViewPrescription}
        onEdit={handleEditPrescription}
        onPrint={handlePrintPrescription}
      />

      {/* Create/Edit Prescription Dialog */}
      <PrescriptionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        patient={patients[0]} // Mock patient for testing
        doctorName={currentDoctor.name}
        doctorId={currentDoctor.id}
        doctorLicense={currentDoctor.license}
        diagnosis="Viêm họng cấp tính"
        symptoms="Đau họng, khó nuốt"
        onSave={editingPrescription ? handleUpdatePrescription : handleCreatePrescription}
        initialData={editingPrescription || undefined}
        mode={editingPrescription ? 'edit' : 'create'}
        title={editingPrescription ? 'Chỉnh sửa đơn thuốc' : 'Tạo đơn thuốc mới'}
      />

      {/* Prescription Detail Dialog */}
      <PrescriptionDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        prescription={selectedPrescription}
        onEdit={handleEditPrescription}
        onPrint={handlePrintPrescription}
      />
    </div>
  );
}
