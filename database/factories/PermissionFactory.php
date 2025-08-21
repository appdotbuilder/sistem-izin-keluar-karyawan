<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Permission>
 */
class PermissionFactory extends Factory
{
    protected $model = Permission::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $exitTime = fake()->dateTimeBetween('08:00:00', '16:00:00');
        $returnTime = fake()->dateTimeBetween($exitTime, '17:00:00');

        return [
            'employee_id' => Employee::factory(),
            'department_id' => Department::factory(),
            'date' => fake()->dateTimeBetween('now', '+1 month'),
            'exit_time' => $exitTime->format('H:i:s'),
            'return_time' => $returnTime->format('H:i:s'),
            'reason' => fake()->randomElement([
                'Keperluan keluarga',
                'Urusan bank',
                'Konsultasi dokter',
                'Keperluan pribadi',
                'Meeting eksternal',
                'Urusan administrasi',
            ]),
            'location' => fake()->randomElement([
                'Bank BCA',
                'Rumah Sakit',
                'Kantor Kelurahan',
                'Client Office',
                'Rumah',
                'Mall',
            ]),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
        ];
    }

    /**
     * Create a pending permission.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Create an approved permission.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * Create a rejected permission.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => fake()->sentence(),
        ]);
    }
}