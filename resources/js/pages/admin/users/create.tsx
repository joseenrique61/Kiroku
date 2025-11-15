import { Button } from '@/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import InputError from '@/components/input-error';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Select } from '@/components/select';
import AppLayout from '@/layouts/app-layout';
import { Role } from '@/types/user';
import { Head, useForm } from '@inertiajs/react';
import { Organization } from '@/types/globals';

type UserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_id: number;
    organization_id: number;
};

export default function UserCreate({ roles, organizations }: { roles: Role[], organizations: Organization[] }) {
    const { data, setData, post, errors } = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: roles[0]?.id || 0,
        organization_id: organizations[0]?.id || 0,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <AppLayout>
            <Head title="Create User" />
            <Card>
                <CardHeader>
                    <CardTitle>Create User</CardTitle>
                    <CardDescription>
                        Create a new user to add to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="user-create-page__form">
                        <div className="user-create-page__form-group">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter user name"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="user-create-page__form-group">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="Enter user email"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="user-create-page__form-group">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Enter user password"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="user-create-page__form-group">
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder="Confirm user password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                        <div className="user-create-page__form-group">
                            <Label htmlFor="organization_id">Organization</Label>
                            <Select
                                name="organization_id"
                                value={data.organization_id.toString()}
                                onValueChange={(value) =>
                                    setData('organization_id', parseInt(value))
                                }
                                options={organizations.map((organization) => ({
                                    value: organization.id.toString(),
                                    label: organization.name,
                                }))}
                                placeholder="Select a Organization"
                            />
                            <InputError message={errors.organization_id} />
                        </div>
                        <div className="user-create-page__form-group">
                            <Label htmlFor="role_id">Role</Label>
                            <Select
                                name="role_id"
                                value={data.role_id.toString()}
                                onValueChange={(value) =>
                                    setData('role_id', parseInt(value))
                                }
                                options={roles.map((role) => ({
                                    value: role.id.toString(),
                                    label: role.name,
                                }))}
                                placeholder="Select a role"
                            />
                            <InputError message={errors.role_id} />
                        </div>
                        <Button type="submit">Create</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
