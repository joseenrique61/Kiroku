<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::all();

        return Inertia::render('admin/roles/create', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        $role = Role::create([
            'name' => $request->name
        ]);

        if($request->has('permissions')) 
        {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->intended(route('roles', absolute: false))->with('sucess','Role was created successfully!');
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $role->load('permissions');

        return Inertia::render('admin/roles/show', [
            'role' => $role
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $permissions = Permission::all();
        $role->load('permissions');

        return Inertia::render('admin/roles/show', [
            'permissions' => $permissions,
            'role' => $role
        ]);
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        $role->update([
            'name' => $request->name
        ]);

        $role->syncPermissions($request->permissions ?? []);

        return redirect()->intended(route('roles', absolute: false))->with('sucess','Role was updated successfully!');
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        if($role->name == 'admin') 
        {
            return redirect()->intended(route('roles', absolute: false))->with('error','This role cannot be deleted!'); 
        }

        $role->delete();

        return redirect()->intended(route('roles', absolute: false))->with('success','Role was deleted successfully!'); 
    }
}