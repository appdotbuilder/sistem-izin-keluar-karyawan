<?php

namespace Database\Factories;

use App\Models\Approval;
use App\Models\Employee;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Approval>
 */
class ApprovalFactory extends Factory
{
    protected $model = Approval::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'permission_id' => Permission::factory(),
            'approver_id' => Employee::factory(),
            'status' => fake()->randomElement(['approved', 'rejected']),
            'notes' => fake()->optional()->sentence(),
            'approved_at' => fake()->dateTimeThisMonth(),
        ];
    }

    /**
     * Create an approved approval.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * Create a rejected approval.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'notes' => fake()->sentence(),
        ]);
    }
}