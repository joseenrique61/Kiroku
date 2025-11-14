<?php

namespace App\Http\Controllers\Inventory\Reports;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Maintenance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $maintenances = Maintenance::with('device')->get();
        
        return Inertia::render('reports/index', [
            'maintenances' => $maintenances
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('reports/create', [
            'devices' => Device::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'device_id' => 'required|exists:devices,id',
            'cost' => 'required|numeric',
            'datetime' => 'required|date',
            'is_preventive' => 'required|boolean',
        ]);

        Maintenance::create($request->all());

        return redirect()->route('maintenances.index')->with('success', 'Maintenance created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Maintenance $maintenance): Response
    {
        $maintenance->load('device');
        return Inertia::render('reports/view', [
            'maintenance' => $maintenance
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Maintenance $maintenance): Response
    {
        return Inertia::render('reports/edit', [
            'maintenance' => $maintenance,
            'devices' => Device::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Maintenance $maintenance): RedirectResponse
    {
        $request->validate([
            'device_id' => 'required|exists:devices,id',
            'cost' => 'required|numeric',
            'datetime' => 'required|date',
            'is_preventive' => 'required|boolean',
        ]);

        $maintenance->update($request->all());

        return redirect()->route('maintenances.index')->with('success', 'Maintenance updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Maintenance $maintenance): RedirectResponse
    {
        $maintenance->delete();
        return redirect()->route('maintenances.index')->with('success', 'Maintenance deleted successfully.');
    }
}