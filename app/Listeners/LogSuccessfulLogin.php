<?php

namespace App\Listeners;

use App\Models\AuditLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Symfony\Component\HttpFoundation\Request;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct(protected Request $request)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        AuditLog::create([
            'table_name' => 'users',
            'record_primary_key' => $event->user->id,
            'operation' => 'L',
            'value_before' => 'N/A',
            'value_after' => 'N/A',
            'host_ip' => $this->request->ip(),
            'user_id' => $event->user->id,
        ]);
    }
}
