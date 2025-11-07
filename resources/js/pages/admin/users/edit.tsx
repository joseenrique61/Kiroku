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
import { BreadcrumbItem, Role, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index') as string,
    },
    {
        title: 'Edit',
        href: '',
    },
];

type UserFormData = {
    name: string;
    email: string;
    password?: string | null;
    password_confirmation?: string | null;
    role_id: number;
};

export default function UserEdit({
    user,
    roles,
}: {
    user: User;
    roles: Role[];
}) {
    const { data, setData, put, errors } = useForm<UserFormData>({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role_id: user.role_id,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <Card>
                <CardHeader>
                    <CardTitle>Edit User</CardTitle>
                    <CardDescription>
                        Update the details of the user.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="user-edit-page__form">
                        <div className="user-edit-page__form-group">
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
                        <div className="user-edit-page__form-group">
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
                        <div className="user-edit-page__form-group">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password || ''}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Leave blank to keep current password"
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div className="user-edit-page__form-group">
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation || ''}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder="Confirm new password"
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-destructive">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                        <div className="user-edit-page__form-group">
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
                        <Button type="submit">Update</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
