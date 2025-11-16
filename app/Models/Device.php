<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Device extends Model
{
    use HasFactory;
    use Auditable;
    use SoftDeletes;

    protected $fillable = [
        'serial_number',
        'description',
        'acquisition_id',
        'organization_id',
        'device_category_id',
        'device_model_id',
        'device_status_id'
    ];   

    public function acquisition() : BelongsTo
    {
        return $this->belongsTo(Acquisition::class);
    }

    public function organization() : BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function deviceCategory() : BelongsTo
    {
        return $this->belongsTo(DeviceCategory::class);
    }

    public function deviceModel() : BelongsTo
    {
        return $this->belongsTo(DeviceModel::class);
    }

    public function deviceStatus() : BelongsTo
    {
        return $this->belongsTo(DeviceStatus::class);
    }

    public function maintenances() : HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    protected static function booted(): void
    {
        static::deleting(function (Device $device) {
            $device->maintenances()->each(fn ($child) => $child->delete());
        });
    }
}
