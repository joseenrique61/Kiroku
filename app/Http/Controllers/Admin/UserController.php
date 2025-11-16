<?php

namespace App\Http\Controllers\Admin;

use App\Models\Organization;
use Illuminate\Routing\Controller as BaseController;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $users = User::with(['roles','organization'])->get();
        
        return Inertia::render('admin/users/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $organizations = Organization::all();
        $roles = Role::all();

        return Inertia::render('admin/users/create', [
            'organizations' => $organizations,
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'organization_id' => 'required|integer|exists:organizations,id',
            'role_id' => 'required|integer|exists:roles,id',
        ]);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'organization_id' => $request->organization_id,
        ]);
        
        $role = Role::findById($request->role_id);
        
        if ($role)
        {
            $user->syncRoles($role);
        }
            
        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        $user->load('roles','organization');

        return Inertia::render('admin/users/view',[
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $user->load('roles','organization');

        $organizations = Organization::all();
        $roles = Role::all();

        return Inertia::render('admin/users/edit',[
            'user' => $user,
            'organizations' => $organizations,
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user) : RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|string|exists:roles,name'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }
        
        if (!empty($request->role))
        {
            $user->syncRoles($request->role);
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user) : RedirectResponse
    {
        $user->delete();
        return redirect()->route('users.index')->with('success','User was deleted successfully!');
    }

    // public function __construct()
    // {
    //     $this->middleware('role:admin');
    // }
}