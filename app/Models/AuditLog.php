<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'table_name',
        'record_primary_key',
        'operation',
        'value_before',
        'value_after',
        'host_ip',
        'user_id'
    ];
    
    protected $appends = [
        'operation_name'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getOperationNameAttribute()
    {
        return [
            'L' => 'Login',
            'C' => 'Create',
            'U' => 'Update',
            'D' => 'Delete'
        ][$this->operation] ?? $this->operation;
    }
}
