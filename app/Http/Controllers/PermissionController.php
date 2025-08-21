<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApprovalRequest;
use App\Http\Requests\StorePermissionRequest;
use App\Models\Approval;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return redirect()->route('dashboard')->with('error', 'Employee profile not found.');
        }

        $query = Permission::with(['employee', 'department', 'approvals.approver']);

        // Role-based filtering
        switch ($employee->role) {
            case 'employee':
                $query->where('employee_id', $employee->id);
                break;
            case 'admin':
                // Admin can see all permissions
                break;
            case 'hr':
            case 'supervisor':
            case 'manager':
                // Show pending permissions that they can approve
                $query->where('status', 'pending')
                    ->whereHas('employee', function ($q) use ($employee) {
                        $q->where(function ($subQuery) use ($employee) {
                            if ($employee->role === 'hr') {
                                // HR can approve all grades
                                return;
                            } elseif ($employee->role === 'manager') {
                                // Manager can approve G10 and G9
                                $subQuery->whereIn('grade', ['G10', 'G9']);
                            } elseif ($employee->role === 'supervisor') {
                                if ($employee->grade === 'G10') {
                                    // G10 supervisor can approve G11-G13
                                    $subQuery->whereIn('grade', ['G11', 'G12', 'G13']);
                                } elseif ($employee->grade === 'G8') {
                                    // G8 supervisor can approve G9
                                    $subQuery->where('grade', 'G9');
                                }
                            }
                        });
                    });
                break;
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $permissions = $query->latest()->paginate(10);
        $departments = Department::all();

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
            'departments' => $departments,
            'filters' => $request->only(['status', 'department_id', 'date_from', 'date_to']),
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();
        
        return Inertia::render('permissions/create', [
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return redirect()->back()->with('error', 'Employee profile not found.');
        }

        DB::beginTransaction();

        try {
            $permission = Permission::create([
                'employee_id' => $employee->id,
                'department_id' => $request->department_id,
                'date' => $request->date,
                'exit_time' => $request->exit_time,
                'return_time' => $request->return_time,
                'reason' => $request->reason,
                'location' => $request->location,
                'status' => 'pending',
            ]);

            // Log WhatsApp notification to superiors (placeholder)
            $this->logWhatsAppNotification('permission_submitted', $permission);

            DB::commit();

            return redirect()->route('permissions.show', $permission)
                ->with('success', 'Leave request submitted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Failed to submit leave request. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        $user = Auth::user();
        $employee = $user->employee;

        // Check authorization
        if ($employee->role === 'employee' && $permission->employee_id !== $employee->id) {
            return redirect()->route('permissions.index')->with('error', 'Unauthorized access.');
        }

        $permission->load(['employee', 'department', 'approvals.approver']);

        return Inertia::render('permissions/show', [
            'permission' => $permission,
            'employee' => $employee,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Permission $permission, Request $request)
    {
        // Handle approval/rejection if action parameter is present
        if ($request->has('action') && $request->action === 'approve') {
            $request->validate([
                'status' => 'required|in:approved,rejected',
                'notes' => 'nullable|string|max:500',
            ]);

            $user = Auth::user();
            $employee = $user->employee;

            if (!$employee) {
                return redirect()->back()->with('error', 'Employee profile not found.');
            }

            // Check if employee can approve this permission
            if (!$employee->canApprove($permission->employee->grade)) {
                return redirect()->back()->with('error', 'You are not authorized to approve this request.');
            }

            // Check if permission is still pending
            if ($permission->status !== 'pending') {
                return redirect()->back()->with('error', 'This request has already been processed.');
            }

            // Check if already approved/rejected by this approver
            if ($permission->approvals()->where('approver_id', $employee->id)->exists()) {
                return redirect()->back()->with('error', 'You have already processed this request.');
            }

            DB::beginTransaction();

            try {
                // Create approval record
                Approval::create([
                    'permission_id' => $permission->id,
                    'approver_id' => $employee->id,
                    'status' => $request->status,
                    'notes' => $request->notes,
                    'approved_at' => now(),
                ]);

                // Update permission status
                if ($request->status === 'approved') {
                    $permission->update(['status' => 'approved']);
                } elseif ($request->status === 'rejected') {
                    $permission->update([
                        'status' => 'rejected',
                        'rejection_reason' => $request->notes,
                    ]);
                }

                // Log WhatsApp notification to employee (placeholder)
                $this->logWhatsAppNotification('permission_' . $request->status, $permission);

                DB::commit();

                return redirect()->back()->with('success', 'Request ' . $request->status . ' successfully.');
            } catch (\Exception $e) {
                DB::rollBack();
                
                return redirect()->back()->with('error', 'Failed to process the request. Please try again.');
            }
        }

        // Handle regular permission updates here if needed
        return redirect()->back()->with('error', 'Invalid action.');
    }

    /**
     * Log WhatsApp notification (placeholder).
     */
    protected function logWhatsAppNotification(string $type, Permission $permission): void
    {
        $message = '';
        
        switch ($type) {
            case 'permission_submitted':
                $message = "New leave request submitted by {$permission->employee->name} for {$permission->date->format('Y-m-d')} from {$permission->exit_time} to {$permission->return_time}. Reason: {$permission->reason}";
                break;
            case 'permission_approved':
                $message = "Your leave request for {$permission->date->format('Y-m-d')} has been approved.";
                break;
            case 'permission_rejected':
                $message = "Your leave request for {$permission->date->format('Y-m-d')} has been rejected. Reason: {$permission->rejection_reason}";
                break;
        }

        Log::info('WhatsApp Notification', [
            'type' => $type,
            'permission_id' => $permission->id,
            'message' => $message,
        ]);
    }
}