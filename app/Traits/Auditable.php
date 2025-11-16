<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    public static function bootAuditable(): void
    {
        /**
        * 'created' event: Triggered after a new record is saved.
        */
        static::created(function (Model $model) {
            static::logAudit('create', $model);
        });

        /**
        * 'updated' event: Triggered after an existing record is updated.
        */
        static::updated(function (Model $model) {
            static::logAudit('update', $model);
        });
        /**
        * 'deleted' event: Triggered after a record is deleted.
        */
        static::deleted(function (Model $model) {
            static::logAudit('delete', $model);
        });
    }

    /**
     * Helper method for recording audit entries.
     */
    protected static function logAudit(string $operation, Model $model): void
    {
        if (!Auth::id()) {
            return;
        }

        $value_before = null;
        $value_after = null;

        if ($operation === 'create') {
            $value_before = 'N/A';
            $value_after = $model->getAttributes();
            $operation = 'C';
        } elseif ($operation === 'update') {
            $value_before = $model->getOriginal(); 
            $value_after = $model->getAttributes();
            $operation = 'U';
        } elseif ($operation === 'delete') {
            $value_before = $model->getAttributes();
            $value_after = 'N/A';
            $operation = 'D';
        }

        AuditLog::create([
            'table_name' => $model->getTable(),
            'record_primary_key' => $model->getKey(),
            'operation' => $operation,
            'value_before' => $value_before ? json_encode($value_before) : null,
            'value_after' => $value_after ? json_encode($value_after) : null,
            'host_ip' => request()->ip(),
            'user_id' => Auth::id(),
        ]);
    }
}