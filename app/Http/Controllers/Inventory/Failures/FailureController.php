<?php

namespace App\Http\Controllers\Inventory\Failures;

use App\Http\Controllers\Controller;
use App\Models\Failure;
use App\Models\FailureType;
use App\Models\Maintenance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FailureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $failures = Failure::with('failureType')->get();
        
        return Inertia::render('reports/failures/index', [
            'failures' => $failures
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('reports/failures/create', [
            'maintenances' => Maintenance::all(),
            'failureTypes' => FailureType::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'description' => 'required|string',
            'cause' => 'nullable|string',
            'maintenance_id' => 'required|exists:maintenances,id',
            'failure_type_id' => 'required|exists:failure_types,id',
        ]);

        Failure::create($request->all());

        return redirect()->route('failures.index')->with('success', 'Failure created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Failure $failure): Response
    {
        $failure->load('failureType');
        return Inertia::render('reports/failures/view', [
            'failure' => $failure
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Failure $failure): Response
    {
        return Inertia::render('reports/failures/edit', [
            'failure' => $failure,
            'maintenances' => Maintenance::all(),
            'failureTypes' => FailureType::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Failure $failure): RedirectResponse
    {
        $request->validate([
            'description' => 'required|string',
            'cause' => 'nullable|string',
            'maintenance_id' => 'required|exists:maintenances,id',
            'failure_type_id' => 'required|exists:failure_types,id',
        ]);

        $failure->update($request->all());

        return redirect()->route('failures.index')->with('success', 'Failure updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Failure $failure): RedirectResponse
    {
        $failure->delete();
        return redirect()->route('failures.index')->with('success', 'Failure deleted successfully.');
    }
}