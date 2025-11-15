<?php

namespace App\Http\Controllers\Inventory\Reports;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\DeviceStatus;
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
            'devices' => Device::where('device_status_id', '=', DeviceStatus::where('name', '=', 'In service')->first()->id)->with('deviceModel')->get(),
            'failure_types' => FailureType::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $fields = $request->validate([
            'device_id' => 'required|exists:devices,id',
            'cost' => 'required|numeric',
            'out_of_service_datetime' => 'required|date',
            'datetime' => 'nullable|date|after_or_equal:start_date',
            'is_preventive' => 'required|boolean',

            'failure_type_id' => 'required_if:is_preventive,false|nullable|exists:failure_types,id',
            'failure_description' => 'required_if:is_preventive,false|nullable|string|max:400',
            'failure_cause' => 'required_if:is_preventive,false|nullable|string|max:400'
        ]);

        DB::transaction(function () use ($fields) {
            $maintenance = Maintenance::create(Arr::only($fields, ['device_id', 'cost', 'datetime', 'out_of_service_datetime', 'is_preventive']));

            if (!$fields['is_preventive']) {
                $maintenance->failure()->create([
                    'failure_type_id' => $fields['failure_type_id'],
                    'description' => $fields['failure_description'],
                    'cause' => $fields['failure_cause'],
                ]);
            }

            if (!$fields['datetime']) {
                Device::find($fields['device_id'])->first()->update([
                    'device_status_id' => DeviceStatus::where('name', '=', 'In maintenance')->first()->id
                ]);
            }
            else {
                Device::find($fields['device_id'])->first()->update([
                    'device_status_id' => DeviceStatus::where('name', '=', 'In service')->first()->id
                ]);
            }
        });

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

        $devices = Device::where('device_status_id', '=', DeviceStatus::where('name', '=', 'In service')->first()->id)->with('deviceModel')->get();
        $devices = $devices->merge(Device::where('id', '=', $maintenance->device_id)->with('deviceModel')->get());

        return Inertia::render('reports/edit', [
            'maintenance' => $maintenance,
            'devices' => $devices,
            'failure_types' => FailureType::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Maintenance $maintenance): RedirectResponse
    {
        $fields = $request->validate([
            'device_id' => 'required|exists:devices,id',
            'cost' => 'required|numeric',
            'out_of_service_datetime' => 'required|date',
            'datetime' => 'nullable|date|after_or_equal:start_date',
            'is_preventive' => 'required|boolean',

            'failure_type_id' => 'required_if:is_preventive,false|nullable|exists:failure_types,id',
            'failure_description' => 'required_if:is_preventive,false|nullable|string|max:400',
            'failure_cause' => 'required_if:is_preventive,false|nullable|string|max:400'
        ]);

        DB::transaction(function () use ($fields, $maintenance) {
            $maintenance->update(Arr::only($fields, ['device_id', 'cost', 'datetime', 'out_of_service_datetime', 'is_preventive']));

            if (!$fields['is_preventive']) {
                $maintenance->failure()->update([
                    'failure_type_id' => $fields['failure_type_id'],
                    'description' => $fields['failure_description'],
                    'cause' => $fields['failure_cause'],
                ]);
            }

            if (!$fields['datetime']) {
                Device::find($fields['device_id'])->first()->update([
                    'device_status_id' => DeviceStatus::where('name', '=', 'In maintenance')->first()->id
                ]);
            }
            else {
                Device::find($fields['device_id'])->first()->update([
                    'device_status_id' => DeviceStatus::where('name', '=', 'In service')->first()->id
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
