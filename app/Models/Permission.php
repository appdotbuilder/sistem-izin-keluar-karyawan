<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Permission
 *
 * @property int $id
 * @property int $employee_id
 * @property int $department_id
 * @property \Illuminate\Support\Carbon $date
 * @property string $exit_time
 * @property string $return_time
 * @property string $reason
 * @property string $location
 * @property string $status
 * @property string|null $rejection_reason
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * @property-read \App\Models\Department $department
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Approval[] $approvals
 * @property-read int|null $approvals_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Permission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission query()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereDepartmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereExitTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereReturnTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereRejectionReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission pending()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission approved()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission rejected()
 * @method static \Database\Factories\PermissionFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Permission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'department_id',
        'date',
        'exit_time',
        'return_time',
        'reason',
        'location',
        'status',
        'rejection_reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the permission.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the department that owns the permission.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the approvals for the permission.
     */
    public function approvals(): HasMany
    {
        return $this->hasMany(Approval::class);
    }

    /**
     * Scope a query to only include pending permissions.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved permissions.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected permissions.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Get approving superiors for this permission
     *
     * @return string
     */
    public function getApprovingSuperiorsAttribute(): string
    {
        return $this->approvals()
            ->with('approver')
            ->where('status', 'approved')
            ->get()
            ->pluck('approver.name')
            ->join(', ');
    }
}