<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Routing\Controller as BaseController;
use App\Models\Organization;
use App\Models\OrganizationPolicy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index() : Response
    {
        $organizations = Organization::whit('organizationPolicy')->get();

        return Inertia::render('admin/organizations/index', [
            'organizations' => $organizations
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $organizationPolicies = OrganizationPolicy::all();
        
        return Inertia::render('admin/organizations/create',[
            'organizationPolicies' => $organizationPolicies
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:organizations',
            'organization_policy_id' => 'required|int|exist:organization_policies,id'
        ]);

        Organization::create([
            'name' => $request->name,
            'organization_policy_id' => $request->organization_policy_id
        ]);

        return redirect()->intended(route('organizations.index', absolute: false));
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization)
    {
        $organization->load('OrganizationPolicy')->get();

        return Inertia::render('admin/organizations/view',[
            'organization' => $organization
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization)
    {
        $organization->load('OrganizationPolicy')->get();

        $organizationPolicies = OrganizationPolicy::all();

        return Inertia::render('admin/organizations/view',[
            'organization' => $organization,
            'organizationPolicies' => $organizationPolicies
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:organizations',
            'organization_policy_id' => 'required|int|exist:organization_policies,id'
        ]);

        $organization->update([
            'name' => $request->name,
            'organization_policy_id' => $request->organization_policy_id
        ]);

        return redirect()->intended(route('organizations.index', absolute: false));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization)
    {
        $organization->delete();
        return redirect()->intended(route('organizations.index', absolute: false))->with('success','Organization was deleted successfully!');
    }

    public function __construct()
    {
        $this->middleware('permission:view-organization-policies')->only(['index', 'show']);
        $this->middleware('permission:manage-organization-policies')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }
}
