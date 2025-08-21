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
    department: {
        name: string;
    };
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
    approving_superiors?: string;
}

interface Filters {
    status?: string;
    department_id?: string;
    grade?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
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
    grades: string[];
    filters: Filters;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Admin Panel', href: '/admin/dashboard' },
];

export default function AdminDashboard({ permissions, departments, grades, filters }: Props) {
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
        router.get(route('admin.dashboard'), Object.fromEntries(
            Object.entries(localFilters).filter(([, value]) => value !== undefined)
        ), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get(route('admin.dashboard'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        const params = new URLSearchParams(localFilters as Record<string, string>).toString();
        window.open(route(`admin.export.${format}`) + (params ? `?${params}` : ''), '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            📊 Panel Administrator
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Kelola dan monitor semua pengajuan izin keluar karyawan
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleExport('excel')}
                            variant="outline"
                            size="sm"
                        >
                            📊 Export Excel
                        </Button>
                        <Button
                            onClick={() => handleExport('pdf')}
                            variant="outline"
                            size="sm"
                        >
                            📄 Export PDF
                        </Button>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔍 Filter & Pencarian</h2>
                    
                    {/* Search */}
                    <div className="mb-4">
                        <Input
                            placeholder="Cari berdasarkan nama karyawan atau ID..."
                            value={localFilters.search || ''}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value || undefined }))}
                            className="max-w-md"
                        />
                    </div>
                    
                    {/* Filter Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                                Grade
                            </label>
                            <Select 
                                value={localFilters.grade || ''} 
                                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, grade: value || undefined }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Grade</SelectItem>
                                    {grades.map((grade) => (
                                        <SelectItem key={grade} value={grade}>
                                            {grade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                &nbsp;
                            </label>
                            <div className="flex gap-2">
                                <Button onClick={handleFilter} variant="outline" size="sm">
                                    🔍 Filter
                                </Button>
                                <Button onClick={clearFilters} variant="ghost" size="sm">
                                    ✨ Reset
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Results Summary */}
                <div className="bg-white rounded-lg shadow-sm border p-4 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Menampilkan {permissions.data.length} dari {permissions.meta.total} pengajuan
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <span className="text-gray-600 dark:text-gray-300">Menunggu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <span className="text-gray-600 dark:text-gray-300">Disetujui</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <span className="text-gray-600 dark:text-gray-300">Ditolak</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-sm border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Karyawan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Departemen
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Grade
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Tanggal & Waktu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Keperluan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Penyetuju
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {permissions.data.map((permission) => (
                                    <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            #{permission.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {permission.employee.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {permission.employee.employee_id}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {permission.employee.department.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                                {permission.employee.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    📅 {new Date(permission.date).toLocaleDateString('id-ID')}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    🕒 {permission.exit_time} - {permission.return_time}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <div className="text-sm text-gray-900 dark:text-white truncate">
                                                    {permission.reason}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    📍 {permission.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(permission.status)}`}>
                                                {getStatusText(permission.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {permission.approving_superiors || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link 
                                                href={route('permissions.show', permission.id)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                            >
                                                👁️ Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {permissions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <span className="text-4xl mb-2">📋</span>
                                                <p>Tidak ada data yang ditemukan</p>
                                                <p className="text-sm mt-1">Coba ubah filter atau kriteria pencarian</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination would go here */}
                    {permissions.meta.total > permissions.meta.per_page && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Halaman {permissions.meta.current_page} dari {permissions.meta.last_page}
                                </p>
                                {/* Pagination buttons would be implemented here */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}