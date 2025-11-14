<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'organization_policy_id'
    ];

    public function organizationPolicy(): BelongsTo
    {
        return $this->belongsTo(OrganizationPolicy::class);
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }
}
