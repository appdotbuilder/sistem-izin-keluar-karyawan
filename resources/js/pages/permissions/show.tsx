import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Employee {
    id: number;
    name: string;
    grade: string;
    role: string;
    employee_id: string;
}

interface Department {
    id: number;
    name: string;
    code: string;
}

interface Approval {
    id: number;
    status: string;
    notes?: string;
    approved_at: string;
    approver: Employee;
}

interface Permission {
    id: number;
    date: string;
    exit_time: string;
    return_time: string;
    reason: string;
    location: string;
    status: string;
    rejection_reason?: string;
    employee: Employee;
    department: Department;
    approvals: Approval[];
}

interface Props {
    permission: Permission;
    employee: Employee;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Izin Keluar', href: '/permissions' },
    { title: 'Detail', href: '#' },
];

export default function ShowPermission({ permission, employee }: Props) {
    const [showApprovalForm, setShowApprovalForm] = useState<'approved' | 'rejected' | null>(null);
    const { data, setData, processing } = useForm({
        status: '',
        notes: '',
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
            case 'approved': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
            default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return '⏳ Menunggu Persetujuan';
            case 'approved': return '✅ Disetujui';
            case 'rejected': return '❌ Ditolak';
            default: return status;
        }
    };

    const canApprove = () => {
        if (permission.status !== 'pending') return false;
        if (employee.role === 'employee') return false;
        
        // Check if can approve based on grade
        if (employee.role === 'hr') return true;
        if (employee.role === 'manager' && ['G10', 'G9'].includes(permission.employee.grade)) return true;
        if (employee.role === 'supervisor' && employee.grade === 'G10' && ['G11', 'G12', 'G13'].includes(permission.employee.grade)) return true;
        if (employee.role === 'supervisor' && employee.grade === 'G8' && permission.employee.grade === 'G9') return true;
        
        return false;
    };

    const handleApproval = (status: 'approved' | 'rejected') => {
        router.patch(route('permissions.update', permission.id), {
            action: 'approve',
            status,
            notes: data.notes,
        }, {
            onSuccess: () => {
                setShowApprovalForm(null);
                setData('notes', '');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Izin - ${permission.employee.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Detail Izin Keluar
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            ID: #{permission.id}
                        </p>
                    </div>
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(permission.status)}`}>
                        {getStatusText(permission.status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Permission Details */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            📋 Informasi Pengajuan
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nama Karyawan
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                                        {permission.employee.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        ID Karyawan
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {permission.employee.employee_id}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Grade
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                                        {permission.employee.grade}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Departemen
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {permission.department.name}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Tanggal
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                                            📅 {new Date(permission.date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Waktu
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            🕒 {permission.exit_time} - {permission.return_time}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Lokasi Tujuan
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            📍 {permission.location}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Keperluan
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {permission.reason}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {permission.status === 'rejected' && permission.rejection_reason && (
                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium text-red-600 dark:text-red-400">
                                        Alasan Penolakan
                                    </label>
                                    <p className="mt-1 text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                                        {permission.rejection_reason}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Approval Section */}
                    <div className="space-y-6">
                        {/* Approval History */}
                        <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                📊 Riwayat Persetujuan
                            </h2>
                            <div className="space-y-3">
                                {permission.approvals.length > 0 ? (
                                    permission.approvals.map((approval) => (
                                        <div key={approval.id} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <span className="text-2xl">
                                                    {approval.status === 'approved' ? '✅' : '❌'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {approval.approver.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(approval.approved_at).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                                    {approval.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                                                    {approval.notes && ` • ${approval.notes}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                        Belum ada persetujuan
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Approval Actions */}
                        {canApprove() && !showApprovalForm && (
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    🎯 Tindakan
                                </h2>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setShowApprovalForm('approved')}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        ✅ Setujui
                                    </Button>
                                    <Button
                                        onClick={() => setShowApprovalForm('rejected')}
                                        variant="destructive"
                                    >
                                        ❌ Tolak
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Approval Form */}
                        {showApprovalForm && (
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {showApprovalForm === 'approved' ? '✅ Setujui Pengajuan' : '❌ Tolak Pengajuan'}
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Catatan {showApprovalForm === 'rejected' ? '(Wajib)' : '(Opsional)'}
                                        </label>
                                        <Textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder={
                                                showApprovalForm === 'approved' 
                                                    ? 'Tambahkan catatan jika diperlukan...'
                                                    : 'Jelaskan alasan penolakan...'
                                            }
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => handleApproval(showApprovalForm)}
                                            disabled={processing || (showApprovalForm === 'rejected' && !data.notes.trim())}
                                            className={
                                                showApprovalForm === 'approved' 
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-red-600 hover:bg-red-700'
                                            }
                                        >
                                            {processing ? 'Memproses...' : 
                                             showApprovalForm === 'approved' ? '✅ Konfirmasi Setuju' : '❌ Konfirmasi Tolak'}
                                        </Button>
                                        <Button
                                            onClick={() => setShowApprovalForm(null)}
                                            variant="outline"
                                            disabled={processing}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}