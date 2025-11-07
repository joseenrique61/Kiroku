import { Button } from '@/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index') as string,
    },
    {
        title: 'Create',
        href: route('users.create') as string,
    },
];

type UserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_id: number;
};

export default function UserCreate({ roles }: { roles: Role[] }) {
    const { data, setData, post, errors } = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: roles[0]?.id || 0,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
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
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}
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
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password}
                                </p>
                            )}
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
                            {errors.password_confirmation && (
                                <p className="text-sm text-destructive">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                        <div className="user-create-page__form-group">
                            <Label htmlFor="role_id">Role</Label>
                            <Select
                                name="role_id"
                                value={data.role_id.toString()}
                                onValueChange={(value) =>
                                    setData('role_id', parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.id.toString()}
                                        >
                                            {role.role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role_id && (
                                <p className="text-sm text-destructive">
                                    {errors.role_id}
                                </p>
                            )}
                        </div>
                        <Button type="submit">Create</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
