<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Department>
 */
class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Human Resources',
                'Information Technology',
                'Finance',
                'Operations',
                'Marketing',
                'Sales',
                'Production',
                'Quality Assurance',
            ]),
            'code' => fake()->unique()->regexify('[A-Z]{2,3}'),
            'description' => fake()->sentence(),
        ];
    }
}