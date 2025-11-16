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
import { Organization } from '@/types/globals';
import { Head, Link } from '@inertiajs/react';

export default function OrganizationIndex({ organizations }: { organizations: Organization[] }) {
    return (
        <AppLayout>
            <Head title="Organizations" />
            <Card>
                <CardHeader>
                    <CardTitle>Organizations</CardTitle>
                    <CardDescription>
                        A list of all the organizations in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="organization-index-page__card-content">
                    <div className="organization-index-page__actions">
                        <Button asChild>
                            <Link href={route('organizations.create')}>
                                Create Organization
                            </Link>
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {organizations.map((organization) => (
                                <TableRow key={organization.id}>
                                    <TableCell>{organization.name}</TableCell>
                                    <TableCell className="organization-index-page__table-actions">
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'organizations.show',
                                                    organization.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'organizations.edit',
                                                    organization.id,
                                                )}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button variant={'destructive'} asChild>
                                            <Link
                                                href={route(
                                                    'organizations.destroy',
                                                    organization.id,
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