<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Failure extends Model
{
    protected $fillable = [
        'description',
        'cause',
        'maintenance_id',
        'failure_type_id'
    ];

    public function maintenance(): BelongsTo 
    {
        return $this->belongsTo(Maintenance::class);
    }

    public function failureType(): BelongsTo 
    {
        return $this->belongsTo(FailureType::class);
    }   
}
