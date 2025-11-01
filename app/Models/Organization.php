<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'organization_policy_id'
    ];

    public function organizationPolicy(): BelongsTo
    {
        return $this->belongsTo(OrganizationPolicy::class);
    }

    public function device(): HasMany
    {
        return $this->hasMany(Device::class);
    }
}
