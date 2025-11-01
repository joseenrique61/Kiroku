<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Acquisition extends Model
{
    protected $fillable = [
        'price',
        'acquired_at',
        'warranty_end_date',
    ];

    public function device(): HasOne
    {
        return $this->hasOne(Device::class);
    }
}
