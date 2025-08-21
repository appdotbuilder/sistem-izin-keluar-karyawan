<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'Human Resources', 'code' => 'HR', 'description' => 'Human Resources Department'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Information Technology Department'],
            ['name' => 'Finance', 'code' => 'FIN', 'description' => 'Finance Department'],
            ['name' => 'Operations', 'code' => 'OPS', 'description' => 'Operations Department'],
            ['name' => 'Marketing', 'code' => 'MKT', 'description' => 'Marketing Department'],
            ['name' => 'Sales', 'code' => 'SAL', 'description' => 'Sales Department'],
            ['name' => 'Production', 'code' => 'PRD', 'description' => 'Production Department'],
            ['name' => 'Quality Assurance', 'code' => 'QA', 'description' => 'Quality Assurance Department'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}