<?php

namespace App\Http\Controllers\Inventory\Reports;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\FailureType;
use App\Models\Maintenance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
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
            'failure_types' => FailureType::all()
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
            'out_of_service_datetime' => 'required|date',
            'is_preventive' => 'required|boolean',

            'failure_type_id' => 'required_if:is_preventive,false|exists:failure_types,id',
            'failure_description' => 'required_if:is_preventive,false|string|max:400',
            'failure_cause' => 'required_if:is_preventive,false|string|max:400'
        ]);

        DB::transaction(function () use ($request) {
            $maintenance = Maintenance::create(Arr::only($request, ['device_id', 'cost', 'datetime', 'out_of_service_datetime', 'is_preventive']));

            if (!$request['is_preventive']) {
                $maintenance->failure()->create([
                    'failure_type_id' => $request['failure_type_id'],
                    'description' => $request['failure_description'],
                    'cause' => $request['failure_cause'],
                ]);
            }
        });

        Maintenance::create($request->all());

        return redirect()->route('maintenances.index')->with('success', 'Maintenance created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Maintenance $maintenance): Response
    {
        $maintenance->load(['device', 'failure']);
        return Inertia::render('reports/view', [
            'maintenance' => $maintenance
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Maintenance $maintenance): Response
    {
        $maintenance->load("failure");
        return Inertia::render('reports/edit', [
            'maintenance' => $maintenance,
            'devices' => Device::all(),
            'failure_types' => FailureType::all()
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
            'out_of_service_datetime' => 'required|date',
            'is_preventive' => 'required|boolean',

            'failure_type_id' => 'required_if:is_preventive,false|exists:failure_types,id',
            'failure_description' => 'required_if:is_preventive,false|string|max:400',
            'failure_cause' => 'required_if:is_preventive,false|string|max:400'
        ]);

        DB::transaction(function () use ($request, $maintenance) {
            $maintenance->update(Arr::only($request, ['device_id', 'cost', 'datetime', 'out_of_service_datetime', 'is_preventive']));

            if (!$request['is_preventive']) {
                $maintenance->failure()->update([
                    'failure_type_id' => $request['failure_type_id'],
                    'description' => $request['failure_description'],
                    'cause' => $request['failure_cause'],
                ]);
            }
        });

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
