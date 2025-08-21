import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Employee {
    id: number;
    name: string;
    grade: string;
    role: string;
    department: {
        name: string;
    };
}

interface Stats {
    total_requests?: number;
    pending_requests?: number;
    approved_requests?: number;
    rejected_requests?: number;
    pending_approvals?: number;
    total_approved?: number;
    total_rejected?: number;
    total_employees?: number;
    total_departments?: number;
}

interface Props {
    employee: Employee;
    stats: Stats;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ employee, stats }: Props) {
    const getRoleDisplayName = (role: string) => {
        const roleNames = {
            employee: 'Karyawan',
            supervisor: 'Supervisor',
            hr: 'HR',
            manager: 'Manager',
            admin: 'Administrator'
        };
        return roleNames[role as keyof typeof roleNames] || role;
    };

    const handleQuickAction = () => {
        if (employee.role === 'admin') {
            router.get(route('admin.dashboard'));
        } else if (employee.role === 'employee') {
            router.get(route('permissions.create'));
        } else {
            router.get(route('permissions.index'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Selamat datang, {employee.name}! 👋
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                {getRoleDisplayName(employee.role)} • {employee.department.name} • Grade {employee.grade}
                            </p>
                        </div>
                        <Button onClick={handleQuickAction} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                            {employee.role === 'admin' ? '📊 Panel Admin' : 
                             employee.role === 'employee' ? '📝 Ajukan Izin' : 
                             '👀 Lihat Approval'}
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {employee.role === 'employee' && (
                        <>
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Total Pengajuan
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.total_requests || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900">
                                        <span className="text-2xl">📋</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Menunggu Persetujuan
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {stats.pending_requests || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center dark:bg-yellow-900">
                                        <span className="text-2xl">⏳</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Disetujui
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {stats.approved_requests || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Ditolak
                                        </p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {stats.rejected_requests || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center dark:bg-red-900">
                                        <span className="text-2xl">❌</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {(employee.role === 'supervisor' || employee.role === 'hr' || employee.role === 'manager') && (
                        <>
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Perlu Approval
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {stats.pending_approvals || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center dark:bg-yellow-900">
                                        <span className="text-2xl">⏳</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Telah Disetujui
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {stats.total_approved || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Telah Ditolak
                                        </p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {stats.total_rejected || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center dark:bg-red-900">
                                        <span className="text-2xl">❌</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {employee.role === 'admin' && (
                        <>
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Total Pengajuan
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.total_requests || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900">
                                        <span className="text-2xl">📋</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Menunggu Approval
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {stats.pending_requests || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center dark:bg-yellow-900">
                                        <span className="text-2xl">⏳</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Total Karyawan
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {stats.total_employees || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Total Departemen
                                        </p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {stats.total_departments || 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900">
                                        <span className="text-2xl">🏢</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Aksi Cepat
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {employee.role === 'employee' && (
                            <>
                                <Link
                                    href={route('permissions.create')}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700"
                                >
                                    <span className="text-2xl mr-3">📝</span>
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Ajukan Izin Keluar
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Buat pengajuan baru
                                        </p>
                                    </div>
                                </Link>
                                
                                <Link
                                    href={route('permissions.index')}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700"
                                >
                                    <span className="text-2xl mr-3">📋</span>
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Riwayat Pengajuan
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Lihat semua pengajuan
                                        </p>
                                    </div>
                                </Link>
                            </>
                        )}

                        {(employee.role === 'supervisor' || employee.role === 'hr' || employee.role === 'manager') && (
                            <Link
                                href={route('permissions.index')}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <span className="text-2xl mr-3">✅</span>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Approval Center
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Setujui/tolak pengajuan
                                    </p>
                                </div>
                            </Link>
                        )}

                        {employee.role === 'admin' && (
                            <Link
                                href={route('admin.dashboard')}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <span className="text-2xl mr-3">📊</span>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Panel Administrator
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Kelola sistem secara keseluruhan
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}