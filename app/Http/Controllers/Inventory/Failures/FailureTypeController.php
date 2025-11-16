<?php

namespace App\Http\Controllers\Inventory\Failures;

use Illuminate\Routing\Controller as BaseController;
use App\Models\FailureType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FailureTypeController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $failureTypes = FailureType::get();

        return Inertia::render('reports/failures/index', [
            'failureTypes' => $failureTypes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('reports/failures/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'severity' => 'required|string',
        ]);

        FailureType::create($request->all());

        return redirect()->route('failureTypes.index')->with('success', 'Failure type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FailureType $failureType)
    {
        return Inertia::render('reports/failures/view', [
            'failureType' => $failureType
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FailureType $failureType)
    {
        return Inertia::render('reports/failures/edit', [
            'failureType' => $failureType
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FailureType $failureType)
    {
        $request->validate([
            'name' => 'required|string',
            'severity' => 'required|string',
        ]);

        $failureType->update($request->all());

        return redirect()->route('failureTypes.index')->with('success', 'Failure type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FailureType $failureType)
    {
        $failureType->delete();
        return redirect()->route('failureTypes.index')->with('success', 'Failure type deleted successfully.');
    }

    public function __construct()
    {
        $this->middleware('permission:view-failure-types')->only(['index', 'show']);
        $this->middleware('permission:create-failure-types')->only(['create', 'store']);
        $this->middleware('permission:update-failure-types')->only(['edit', 'update']);
        $this->middleware('permission:delete-failure-types')->only(['destroy']);
    }
}
