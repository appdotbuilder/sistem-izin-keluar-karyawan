import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Izin Keluar Karyawan PT">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-white">
                <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-6xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg border border-indigo-600 px-6 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-gray-800"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow">
                    <main className="flex w-full max-w-6xl flex-col lg:flex-row gap-12 items-center">
                        {/* Hero Section */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="mb-6">
                                <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                    🏢 Sistem Manajemen Perusahaan
                                </span>
                            </div>
                            
                            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
                                <span className="text-indigo-600">Sistem Izin Keluar</span><br />
                                Karyawan PT
                            </h1>
                            
                            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
                                Platform digital untuk mengelola dan menyetujui permintaan izin keluar karyawan 
                                dengan sistem persetujuan bertingkat yang efisien dan transparan.
                            </p>
                            
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-indigo-600 px-8 py-3 text-lg font-medium text-white hover:bg-indigo-700 transition-colors"
                                    >
                                        Mulai Sekarang
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-lg border border-gray-300 px-8 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Masuk ke Akun
                                    </Link>
                                </div>
                            )}
                        </div>
                        
                        {/* Features Section */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Feature Cards */}
                                <div className="bg-white rounded-xl p-6 shadow-lg dark:bg-gray-800">
                                    <div className="mb-4 h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center dark:bg-green-900">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        Pengajuan Mudah
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Karyawan dapat mengajukan izin keluar dengan form yang sederhana dan intuitif.
                                    </p>
                                </div>
                                
                                <div className="bg-white rounded-xl p-6 shadow-lg dark:bg-gray-800">
                                    <div className="mb-4 h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        Persetujuan Bertingkat
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Sistem approval otomatis berdasarkan grade karyawan dan struktur organisasi.
                                    </p>
                                </div>
                                
                                <div className="bg-white rounded-xl p-6 shadow-lg dark:bg-gray-800">
                                    <div className="mb-4 h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center dark:bg-purple-900">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        Dashboard Admin
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Laporan lengkap dengan filter dan ekspor ke Excel/PDF untuk analisis data.
                                    </p>
                                </div>
                                
                                <div className="bg-white rounded-xl p-6 shadow-lg dark:bg-gray-800">
                                    <div className="mb-4 h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center dark:bg-yellow-900">
                                        <span className="text-2xl">📱</span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        Notifikasi Real-time
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Notifikasi WhatsApp otomatis untuk status pengajuan dan persetujuan.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Roles Overview */}
                            <div className="mt-8 bg-white rounded-xl p-6 shadow-lg dark:bg-gray-800">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                    🏛️ Struktur Persetujuan
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-300">Grade G13-G11:</span>
                                        <span className="text-indigo-600 font-medium">Supervisor G10 atau HR</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-300">Grade G10:</span>
                                        <span className="text-indigo-600 font-medium">Manager dan HR</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-600 dark:text-gray-300">Grade G9:</span>
                                        <span className="text-indigo-600 font-medium">Supervisor G8 dan HR</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                
                <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        Built with ❤️ for efficient employee leave management
                    </p>
                </footer>
            </div>
        </>
    );
}