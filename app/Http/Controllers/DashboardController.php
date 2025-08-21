<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the application dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return redirect()->route('home')->with('error', 'Employee profile not found.');
        }

        $stats = $this->getStatsForRole($employee);

        return Inertia::render('dashboard', [
            'employee' => $employee,
            'stats' => $stats,
        ]);
    }

    /**
     * Get statistics based on employee role.
     */
    protected function getStatsForRole(Employee $employee): array
    {
        $stats = [];

        switch ($employee->role) {
            case 'employee':
                $stats = [
                    'total_requests' => $employee->permissions()->count(),
                    'pending_requests' => $employee->permissions()->where('status', 'pending')->count(),
                    'approved_requests' => $employee->permissions()->where('status', 'approved')->count(),
                    'rejected_requests' => $employee->permissions()->where('status', 'rejected')->count(),
                ];
                break;

            case 'supervisor':
            case 'hr':
            case 'manager':
                $approvalQuery = Permission::whereHas('employee', function ($q) use ($employee) {
                    if ($employee->role === 'hr') {
                        // HR can approve all grades
                        return;
                    } elseif ($employee->role === 'manager') {
                        // Manager can approve G10 and G9
                        $q->whereIn('grade', ['G10', 'G9']);
                    } elseif ($employee->role === 'supervisor') {
                        if ($employee->grade === 'G10') {
                            // G10 supervisor can approve G11-G13
                            $q->whereIn('grade', ['G11', 'G12', 'G13']);
                        } elseif ($employee->grade === 'G8') {
                            // G8 supervisor can approve G9
                            $q->where('grade', 'G9');
                        }
                    }
                });

                $stats = [
                    'pending_approvals' => (clone $approvalQuery)->where('status', 'pending')->count(),
                    'total_approved' => $employee->approvals()->where('status', 'approved')->count(),
                    'total_rejected' => $employee->approvals()->where('status', 'rejected')->count(),
                ];
                break;

            case 'admin':
                $stats = [
                    'total_requests' => Permission::count(),
                    'pending_requests' => Permission::where('status', 'pending')->count(),
                    'approved_requests' => Permission::where('status', 'approved')->count(),
                    'rejected_requests' => Permission::where('status', 'rejected')->count(),
                    'total_employees' => Employee::where('is_active', true)->count(),
                    'total_departments' => Department::count(),
                ];
                break;
        }

        return $stats;
    }
}