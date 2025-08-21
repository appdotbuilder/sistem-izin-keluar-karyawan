<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => fake()->unique()->regexify('EMP[0-9]{5}'),
            'user_id' => User::factory(),
            'department_id' => Department::factory(),
            'name' => fake()->name(),
            'grade' => fake()->randomElement(['G13', 'G12', 'G11', 'G10', 'G9', 'G8']),
            'role' => fake()->randomElement(['employee', 'supervisor', 'hr', 'manager']),
            'position' => fake()->jobTitle(),
            'phone' => fake()->phoneNumber(),
            'is_active' => true,
        ];
    }

    /**
     * Create an admin employee.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'grade' => 'G8',
        ]);
    }

    /**
     * Create an HR employee.
     */
    public function hr(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'hr',
            'grade' => fake()->randomElement(['G10', 'G9', 'G8']),
        ]);
    }

    /**
     * Create a manager employee.
     */
    public function manager(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'manager',
            'grade' => fake()->randomElement(['G9', 'G8']),
        ]);
    }

    /**
     * Create a supervisor employee.
     */
    public function supervisor(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'supervisor',
            'grade' => fake()->randomElement(['G10', 'G8']),
        ]);
    }
}