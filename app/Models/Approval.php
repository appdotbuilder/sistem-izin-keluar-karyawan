<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Approval
 *
 * @property int $id
 * @property int $permission_id
 * @property int $approver_id
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon $approved_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Permission $permission
 * @property-read \App\Models\Employee $approver
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Approval newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Approval newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Approval query()
 * @method static \Illuminate\Database\Eloquent\Builder|Approval wherePermissionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Approval whereApproverId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Approval whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Approval whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Approval whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Approval whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Approval whereUpdatedAt($value)
 * @method static \Database\Factories\ApprovalFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Approval extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'permission_id',
        'approver_id',
        'status',
        'notes',
        'approved_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the permission that owns the approval.
     */
    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }

    /**
     * Get the approver that owns the approval.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approver_id');
    }
}