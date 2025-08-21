<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = Department::all();
        
        // Create Admin
        $adminUser = User::create([
            'name' => 'Admin System',
            'email' => 'admin@company.com',
            'password' => Hash::make('password'),
        ]);
        
        Employee::create([
            'employee_id' => 'EMP00001',
            'user_id' => $adminUser->id,
            'department_id' => $departments->where('code', 'IT')->first()->id,
            'name' => 'Admin System',
            'grade' => 'G8',
            'role' => 'admin',
            'position' => 'System Administrator',
            'phone' => '081234567890',
            'is_active' => true,
        ]);

        // Create HR Staff
        $hrUser = User::create([
            'name' => 'HR Manager',
            'email' => 'hr@company.com',
            'password' => Hash::make('password'),
        ]);
        
        Employee::create([
            'employee_id' => 'EMP00002',
            'user_id' => $hrUser->id,
            'department_id' => $departments->where('code', 'HR')->first()->id,
            'name' => 'HR Manager',
            'grade' => 'G9',
            'role' => 'hr',
            'position' => 'Human Resources Manager',
            'phone' => '081234567891',
            'is_active' => true,
        ]);

        // Create Manager
        $managerUser = User::create([
            'name' => 'General Manager',
            'email' => 'manager@company.com',
            'password' => Hash::make('password'),
        ]);
        
        Employee::create([
            'employee_id' => 'EMP00003',
            'user_id' => $managerUser->id,
            'department_id' => $departments->where('code', 'OPS')->first()->id,
            'name' => 'General Manager',
            'grade' => 'G8',
            'role' => 'manager',
            'position' => 'General Manager',
            'phone' => '081234567892',
            'is_active' => true,
        ]);

        // Create G10 Supervisor
        $supervisorUser = User::create([
            'name' => 'Supervisor G10',
            'email' => 'supervisor@company.com',
            'password' => Hash::make('password'),
        ]);
        
        Employee::create([
            'employee_id' => 'EMP00004',
            'user_id' => $supervisorUser->id,
            'department_id' => $departments->where('code', 'IT')->first()->id,
            'name' => 'Supervisor G10',
            'grade' => 'G10',
            'role' => 'supervisor',
            'position' => 'IT Supervisor',
            'phone' => '081234567893',
            'is_active' => true,
        ]);

        // Create G8 Supervisor
        $supervisorG8User = User::create([
            'name' => 'Supervisor G8',
            'email' => 'supervisor.g8@company.com',
            'password' => Hash::make('password'),
        ]);
        
        Employee::create([
            'employee_id' => 'EMP00005',
            'user_id' => $supervisorG8User->id,
            'department_id' => $departments->where('code', 'FIN')->first()->id,
            'name' => 'Supervisor G8',
            'grade' => 'G8',
            'role' => 'supervisor',
            'position' => 'Finance Supervisor',
            'phone' => '081234567894',
            'is_active' => true,
        ]);

        // Create sample employees
        $employees = [
            ['name' => 'Employee G13', 'grade' => 'G13', 'department' => 'IT'],
            ['name' => 'Employee G12', 'grade' => 'G12', 'department' => 'HR'],
            ['name' => 'Employee G11', 'grade' => 'G11', 'department' => 'FIN'],
            ['name' => 'Employee G10', 'grade' => 'G10', 'department' => 'OPS'],
            ['name' => 'Employee G9', 'grade' => 'G9', 'department' => 'MKT'],
        ];

        $employeeId = 6;
        foreach ($employees as $emp) {
            $user = User::create([
                'name' => $emp['name'],
                'email' => strtolower(str_replace(' ', '.', $emp['name'])) . '@company.com',
                'password' => Hash::make('password'),
            ]);
            
            Employee::create([
                'employee_id' => 'EMP' . str_pad((string) $employeeId, 5, '0', STR_PAD_LEFT),
                'user_id' => $user->id,
                'department_id' => $departments->where('code', $emp['department'])->first()->id,
                'name' => $emp['name'],
                'grade' => $emp['grade'],
                'role' => 'employee',
                'position' => 'Staff ' . $emp['department'],
                'phone' => '08123456789' . $employeeId,
                'is_active' => true,
            ]);
            $employeeId++;
        }
    }
}