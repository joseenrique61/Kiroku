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
import { Failure } from '@/types/globals';
import { Head, Link, usePage } from '@inertiajs/react';

export default function FailureIndex({ failures }: { failures: Failure[] }) {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.role.name;

    return (
        <AppLayout>
            <Head title="Failures" />
            <Card>
                <CardHeader>
                    <CardTitle>Failures</CardTitle>
                    <CardDescription>
                        A list of all the failures in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="failure-index-page__card-content">
                    <div className="failure-index-page__actions">
                        {role === 'admin' && (
                            <Button asChild>
                                <Link href={route('failures.create')}>
                                    Create Failure
                                </Link>
                            </Button>
                        )}
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Cause</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Maintenance ID</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {failures.map((failure) => (
                                <TableRow key={failure.id}>
                                    <TableCell>{failure.description}</TableCell>
                                    <TableCell>{failure.cause}</TableCell>
                                    <TableCell>
                                        {failure.failure_type.name}
                                    </TableCell>
                                    <TableCell>
                                        {failure.maintenance_id}
                                    </TableCell>
                                    <TableCell className="failure-index-page__table-actions">
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'failures.show',
                                                    failure.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                        {role === 'admin' && (
                                            <>
                                                <Button
                                                    variant={'outline'}
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            'failures.edit',
                                                            failure.id,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant={'destructive'}
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            'failures.destroy',
                                                            failure.id,
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                    >
                                                        Delete
                                                    </Link>
                                                </Button>
                                            </>
                                        )}
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