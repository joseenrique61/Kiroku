<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $logs = AuditLog::with('user')->latest()->get();
        
        return Inertia::render('admin/logs/index', [
            'logs' => $logs
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(AuditLog $log): Response
    {
        $log->load('user');
        return Inertia::render('admin/logs/view', [
            'log' => $log
        ]);
    }
}
