<?php

namespace App\Http\Controllers\Inventory\Failures;

use App\Http\Controllers\Controller;
use App\Models\FailureType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FailureTypeController extends Controller
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

        return redirect()->route('failures.index')->with('success', 'Failure type created successfully.');
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FailureType $failureType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FailureType $failureType)
    {
        //
    }
}
