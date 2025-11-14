import { Button } from '@/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types/user';
import { Head, Link } from '@inertiajs/react';

export default function UserIndex({ users }: { users: User[] }) {
    return (
        <AppLayout>
            <Head title="Users" />
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        A list of all the users in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="user-index-page__card-content">
                    <div className="user-index-page__actions">
                        <Button asChild>
                            <Link href={route('users.create')}>
                                Create User
                            </Link>
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role.name}</TableCell>
                                    <TableCell className="user-index-page__table-actions">
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'users.show',
                                                    user.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'users.edit',
                                                    user.id,
                                                )}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button variant={'destructive'} asChild>
                                            <Link
                                                href={route(
                                                    'users.destroy',
                                                    user.id,
                                                )}
                                                method="delete"
                                                as="button"
                                            >
                                                Delete
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
