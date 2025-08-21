import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
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

interface Permission {
    id: number;
    date: string;
    exit_time: string;
    return_time: string;
    reason: string;
    location: string;
    status: string;
    employee: Employee;
    department: Department;
    approving_superiors?: string;
}

interface Filters {
    status?: string;
    department_id?: string;
    date_from?: string;
    date_to?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    permissions: {
        data: Permission[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    departments: Department[];
    filters: Filters;
    employee: Employee;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Izin Keluar', href: '/permissions' },
];

export default function PermissionsIndex({ permissions, departments, filters, employee }: Props) {
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Menunggu';
            case 'approved': return 'Disetujui';
            case 'rejected': return 'Ditolak';
            default: return status;
        }
    };

    const handleFilter = () => {
        router.get(route('permissions.index'), Object.fromEntries(
            Object.entries(localFilters).filter(([, value]) => value !== undefined)
        ), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get(route('permissions.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleApproval = (permissionId: number, status: 'approved' | 'rejected', notes?: string) => {
        router.patch(route('permissions.update', permissionId), {
            action: 'approve',
            status,
            notes,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const canApprovePermission = (permission: Permission) => {
        if (permission.status !== 'pending') return false;
        if (employee.role === 'employee') return false;
        
        // Check if can approve based on grade
        if (employee.role === 'hr') return true;
        if (employee.role === 'manager' && ['G10', 'G9'].includes(permission.employee.grade)) return true;
        if (employee.role === 'supervisor' && employee.grade === 'G10' && ['G11', 'G12', 'G13'].includes(permission.employee.grade)) return true;
        if (employee.role === 'supervisor' && employee.grade === 'G8' && permission.employee.grade === 'G9') return true;
        
        return false;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Izin Keluar" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {employee.role === 'employee' ? 'Riwayat Pengajuan Izin' : 'Daftar Izin Keluar'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {employee.role === 'employee' ? 'Kelola pengajuan izin Anda' : 'Kelola persetujuan izin keluar karyawan'}
                        </p>
                    </div>
                    {employee.role === 'employee' && (
                        <Link href={route('permissions.create')}>
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                📝 Ajukan Izin Baru
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <Select 
                                value={localFilters.status || ''} 
                                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, status: value || undefined }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Status</SelectItem>
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="approved">Disetujui</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Departemen
                            </label>
                            <Select 
                                value={localFilters.department_id?.toString() || ''} 
                                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, department_id: value || undefined }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Departemen" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Departemen</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id.toString()}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tanggal Dari
                            </label>
                            <Input
                                type="date"
                                value={localFilters.date_from || ''}
                                onChange={(e) => setLocalFilters(prev => ({ ...prev, date_from: e.target.value || undefined }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tanggal Sampai
                            </label>
                            <Input
                                type="date"
                                value={localFilters.date_to || ''}
                                onChange={(e) => setLocalFilters(prev => ({ ...prev, date_to: e.target.value || undefined }))}
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleFilter} variant="outline">
                            🔍 Terapkan Filter
                        </Button>
                        <Button onClick={clearFilters} variant="ghost">
                            ✨ Reset Filter
                        </Button>
                    </div>
                </div>

                {/* Permissions List */}
                <div className="bg-white rounded-lg shadow-sm border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Tanggal
                                    </th>
                                    {employee.role !== 'employee' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Karyawan
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Waktu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Keperluan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {permissions.data.map((permission) => (
                                    <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {new Date(permission.date).toLocaleDateString('id-ID')}
                                        </td>
                                        {employee.role !== 'employee' && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {permission.employee.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {permission.employee.employee_id} • Grade {permission.employee.grade}
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {permission.exit_time} - {permission.return_time}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm text-gray-900 dark:text-white">{permission.reason}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">📍 {permission.location}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(permission.status)}`}>
                                                {getStatusText(permission.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link 
                                                href={route('permissions.show', permission.id)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                            >
                                                Detail
                                            </Link>
                                            {canApprovePermission(permission) && (
                                                <div className="flex gap-2 mt-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApproval(permission.id, 'approved')}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        ✅ Setuju
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleApproval(permission.id, 'rejected', 'Ditolak oleh ' + employee.name)}
                                                    >
                                                        ❌ Tolak
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {permissions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={employee.role === 'employee' ? 5 : 6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            {employee.role === 'employee' ? 
                                                'Belum ada pengajuan izin. Buat yang pertama!' : 
                                                'Tidak ada data izin yang ditemukan.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}