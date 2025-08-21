<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Employee
 *
 * @property int $id
 * @property string $employee_id
 * @property int $user_id
 * @property int $department_id
 * @property string $name
 * @property string $grade
 * @property string $role
 * @property string|null $position
 * @property string|null $phone
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Department $department
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Permission[] $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Approval[] $approvals
 * @property-read int|null $approvals_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee query()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereDepartmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee wherePosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee active()
 * @method static \Database\Factories\EmployeeFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'user_id',
        'department_id',
        'name',
        'grade',
        'role',
        'position',
        'phone',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the employee.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the department that owns the employee.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the permissions for the employee.
     */
    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }

    /**
     * Get the approvals for the employee.
     */
    public function approvals(): HasMany
    {
        return $this->hasMany(Approval::class, 'approver_id');
    }

    /**
     * Scope a query to only include active employees.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Check if employee can approve permissions for given grade
     *
     * @param string $employeeGrade
     * @return bool
     */
    public function canApprove(string $employeeGrade): bool
    {
        if ($this->role === 'hr') {
            return true; // HR can approve all
        }

        if ($this->role === 'manager') {
            return in_array($employeeGrade, ['G10', 'G9']); // Manager approves G10 and G9
        }

        if ($this->role === 'supervisor') {
            // G10 supervisor can approve G11-G13
            if ($this->grade === 'G10') {
                return in_array($employeeGrade, ['G11', 'G12', 'G13']);
            }
            // G8 supervisor can approve G9
            if ($this->grade === 'G8') {
                return $employeeGrade === 'G9';
            }
        }

        return false;
    }
}