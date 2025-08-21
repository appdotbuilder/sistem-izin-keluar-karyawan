import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Department {
    id: number;
    name: string;
    code: string;
}

interface Props {
    departments: Department[];
    [key: string]: unknown;
}



const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Izin Keluar', href: '/permissions' },
    { title: 'Ajukan Izin', href: '/permissions/create' },
];

export default function CreatePermission({ departments }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        department_id: '',
        date: '',
        exit_time: '',
        return_time: '',
        reason: '',
        location: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('permissions.store'));
    };

    const commonReasons = [
        'Keperluan keluarga',
        'Urusan bank',
        'Konsultasi dokter',
        'Keperluan pribadi',
        'Meeting eksternal',
        'Urusan administrasi',
        'Lainnya',
    ];

    const commonLocations = [
        'Bank BCA',
        'Bank Mandiri',
        'Bank BRI',
        'Rumah Sakit',
        'Puskesmas',
        'Kantor Kelurahan',
        'Kantor Pajak',
        'Client Office',
        'Rumah',
        'Mall',
        'Lainnya',
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajukan Izin Keluar" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Ajukan Izin Keluar 📝
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Isi formulir di bawah ini untuk mengajukan izin keluar kantor
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Department */}
                            <div>
                                <Label htmlFor="department_id">Departemen *</Label>
                                <Select 
                                    value={data.department_id} 
                                    onValueChange={(value) => setData('department_id', value)}
                                >
                                    <SelectTrigger id="department_id">
                                        <SelectValue placeholder="Pilih Departemen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                {dept.name} ({dept.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.department_id}
                                    </p>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <Label htmlFor="date">Tanggal *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            {/* Exit Time */}
                            <div>
                                <Label htmlFor="exit_time">Jam Keluar *</Label>
                                <Input
                                    id="exit_time"
                                    type="time"
                                    value={data.exit_time}
                                    onChange={(e) => setData('exit_time', e.target.value)}
                                />
                                {errors.exit_time && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.exit_time}
                                    </p>
                                )}
                            </div>

                            {/* Return Time */}
                            <div>
                                <Label htmlFor="return_time">Jam Kembali *</Label>
                                <Input
                                    id="return_time"
                                    type="time"
                                    value={data.return_time}
                                    onChange={(e) => setData('return_time', e.target.value)}
                                />
                                {errors.return_time && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.return_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <Label htmlFor="reason">Keperluan *</Label>
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {commonReasons.map((reason) => (
                                        <button
                                            key={reason}
                                            type="button"
                                            onClick={() => setData('reason', reason === 'Lainnya' ? '' : reason)}
                                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                                data.reason === reason
                                                    ? 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200'
                                                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                                <Textarea
                                    id="reason"
                                    placeholder="Jelaskan keperluan Anda..."
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            {errors.reason && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.reason}
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <Label htmlFor="location">Lokasi Tujuan *</Label>
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {commonLocations.map((location) => (
                                        <button
                                            key={location}
                                            type="button"
                                            onClick={() => setData('location', location === 'Lainnya' ? '' : location)}
                                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                                data.location === location
                                                    ? 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200'
                                                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                                <Input
                                    id="location"
                                    placeholder="Masukkan lokasi tujuan..."
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                />
                            </div>
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {processing ? 'Mengirim...' : '📤 Ajukan Izin'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        ℹ️ Informasi Persetujuan
                    </h3>
                    <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <p>• <strong>Grade G13-G11:</strong> Persetujuan dari Supervisor G10 atau HR</p>
                        <p>• <strong>Grade G10:</strong> Persetujuan dari Manager dan HR</p>
                        <p>• <strong>Grade G9:</strong> Persetujuan dari Supervisor G8 dan HR</p>
                        <p>• Notifikasi WhatsApp akan dikirim secara otomatis kepada atasan yang berwenang</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}