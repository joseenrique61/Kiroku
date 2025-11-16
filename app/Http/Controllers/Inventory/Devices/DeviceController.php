<?php

namespace App\Http\Controllers\Inventory\Devices;

use App\Models\Acquisition;
use App\Models\Device;
use App\Models\DeviceCategory;
use App\Models\DeviceModel;
use App\Models\DeviceStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class DeviceController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        $devices = Device::with([
            'acquisition',
            'organization',
            'deviceCategory',
            'deviceModel',
            'deviceModel.deviceBrand',
            'deviceStatus'
        ])->get(); // ->paginate(20); // Use pagination to manage the optimization // TODO: Reactivate pagination

        return Inertia::render('inventory/devices/index',[
            'devices' => $devices
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $deviceModels = DeviceModel::with('deviceBrand')->get();
        $deviceStatus = DeviceStatus::get();
        $deviceCategories = DeviceCategory::get();
        
        return Inertia::render('inventory/devices/create',[
            'deviceModels' => $deviceModels,
            'deviceStatus' => $deviceStatus,
            'deviceCategories' => $deviceCategories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'serial_number' => 'required|string|max:255|unique:devices,serial_number',
            'description' => 'nullable|string|max:255',
            'device_category_id' => 'required|int|exists:device_categories,id',
            'device_model_id' => 'required|int|exists:device_models,id',
            'device_status_id' => 'required|int|exists:device_statuses,id',
            'acquired_at' => 'required|date',
            'warranty_end_date' => 'nullable|date|after_or_equal:acquired_at',
            'price' => 'nullable|numeric|min:0'
        ]);

        $user = $request->user();

        if (!$user->organization_id) {
            return back()->withErrors(['organization_id' => 'El usuario no está asignado a una organización.']);
        }

        $acquisition = Acquisition::create([
            'acquired_at' => $request->acquired_at,
            'warranty_end_date' => $request->warranty_end_date,
            'price' => $request->price,
        ]);

        Device::create([
            'serial_number' => $request->serial_number,
            'description' => $request->description,
            'acquisition_id' => $acquisition->id,
            'organization_id' => $user->organization_id,
            'device_category_id' => $request->device_category_id,
            'device_model_id' => $request->device_model_id,
            'device_status_id' => $request->device_status_id
        ]);

        return redirect()->intended(route('devices.index', absolute: false));
    }

    /**
     * Display the specified resource.
     */
    public function show(Device $device)
    {   
        $device->load([
            'acquisition',
            'organization',
            'deviceCategory',
            'deviceModel',
            'deviceModel.deviceBrand',
            'deviceStatus'
        ]);

        return Inertia::render('inventory/devices/show',[
            'device' => $device
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Device $device)
    {
        $device->load([
            'acquisition',
            'organization',
            'deviceCategory',
            'deviceModel',
            'deviceModel.deviceBrand',
            'deviceStatus'
        ]);

        $deviceModels = DeviceModel::with('deviceBrand')->get();
        $deviceStatus = DeviceStatus::get();
        $deviceCategories = DeviceCategory::get();
        
        return Inertia::render('inventory/devices/edit',[
            'device' => $device,
            'deviceModels' => $deviceModels,
            'deviceStatus' => $deviceStatus,
            'deviceCategories' => $deviceCategories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Device $device)
    {
        $request->validate([
            'description' => 'nullable|string|max:255',
            'acquisition_id' => 'required|int|exists:acquisitions,id',
            'device_category_id' => 'required|int|exists:device_categories,id',
            'device_model_id' => 'required|int|exists:device_models,id',
            'device_status_id' => 'required|int|exists:device_statuses,id'
        ]);

         $device->update([
            'description' => $request->description,
            'acquisition_id' => $request->acquisition_id,
            'device_category_id' => $request->device_category_id,
            'device_model_id' => $request->device_model_id,
            'device_status_id' => $request->device_status_id
        ]);

        return redirect()->intended(route('devices.index', absolute: false));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Device $device)
    {
        $device->delete();
        return redirect()->intended(route('devices.index', absolute: false))->with('success','Device was deleted successfully!');
    }

    public function __construct()
    {
        $this->middleware('permission:view-devices')->only(['index', 'show']);
        $this->middleware('permission:create-devices')->only(['create', 'store']);
        $this->middleware('permission:update-devices')->only(['edit', 'update']);
        $this->middleware('permission:delete-devices')->only(['destroy']);
    }
}