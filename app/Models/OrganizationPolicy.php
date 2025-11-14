<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrganizationPolicy extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_lifespan_policy',
    ];

    public function organization(): HasOne
    {
        return $this->hasOne(Organization::class);
    }

}
