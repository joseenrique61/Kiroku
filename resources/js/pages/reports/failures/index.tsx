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
import { FailureType } from '@/types/globals';
import { Head, Link } from '@inertiajs/react';

export default function FailureIndex({
    failureTypes,
}: {
    failureTypes: FailureType[];
}) {
    return (
        <AppLayout>
            <Head title="Failure Types" />
            <Card>
                <CardHeader>
                    <CardTitle>Failures</CardTitle>
                    <CardDescription>
                        A list of all the failures in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="failure-index-page__card-content">
                    <div className="failure-index-page__actions">
                        <Button asChild>
                            <Link href={route('failureTypes.create')}>
                                Create Failure
                            </Link>
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {failureTypes.map((failureType) => (
                                <TableRow key={failureType.id}>
                                    <TableCell>{failureType.name}</TableCell>
                                    <TableCell>
                                        {failureType.severity}
                                    </TableCell>
                                    <TableCell className="failure-index-page__table-actions">
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'failureTypes.show',
                                                    failureType.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'failureTypes.edit',
                                                    failureType.id,
                                                )}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button variant={'destructive'} asChild>
                                            <Link
                                                href={route(
                                                    'failureTypes.destroy',
                                                    failureType.id,
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
