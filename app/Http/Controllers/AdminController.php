<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee || $employee->role !== 'admin') {
            return redirect()->route('dashboard')->with('error', 'Access denied. Admin role required.');
        }

        $query = Permission::with(['employee.department', 'approvals.approver']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('grade')) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('grade', $request->grade);
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        $permissions = $query->latest()->paginate(15);
        $departments = Department::all();

        // Get unique grades for filter
        $grades = ['G8', 'G9', 'G10', 'G11', 'G12', 'G13'];

        return Inertia::render('admin/dashboard', [
            'permissions' => $permissions,
            'departments' => $departments,
            'grades' => $grades,
            'filters' => $request->only(['status', 'department_id', 'grade', 'date_from', 'date_to', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Excel export functionality
        if ($request->get('format') === 'excel') {
            return response()->json(['message' => 'Excel export functionality to be implemented']);
        }
        
        return response()->json(['message' => 'Create action not implemented']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // PDF export functionality
        if ($request->get('format') === 'pdf') {
            return response()->json(['message' => 'PDF export functionality to be implemented']);
        }
        
        return response()->json(['message' => 'Store action not implemented']);
    }
}