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
import { Maintenance } from '@/types/globals';
import { Head, Link, usePage } from '@inertiajs/react';

export default function MaintenanceIndex({
    maintenances,
}: {
    maintenances: Maintenance[];
}) {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.role.name;

    return (
        <AppLayout>
            <Head title="Maintenances" />
            <Card>
                <CardHeader>
                    <CardTitle>Maintenances</CardTitle>
                    <CardDescription>
                        A list of all the maintenances in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="maintenance-index-page__card-content">
                    <div className="maintenance-index-page__actions">
                        {role === 'admin' && (
                            <Button asChild>
                                <Link href={route('maintenances.create')}>
                                    Create Maintenance
                                </Link>
                            </Button>
                        )}
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Device</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {maintenances.map((maintenance) => (
                                <TableRow key={maintenance.id}>
                                    <TableCell>
                                        {maintenance.device.serial_number}
                                    </TableCell>
                                    <TableCell>{maintenance.cost}</TableCell>
                                    <TableCell>
                                        {maintenance.datetime}
                                    </TableCell>
                                    <TableCell>
                                        {maintenance.is_preventive
                                            ? 'Preventive'
                                            : 'Corrective'}
                                    </TableCell>
                                    <TableCell className="maintenance-index-page__table-actions">
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'maintenances.show',
                                                    maintenance.id,
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
                                                            'maintenances.edit',
                                                            maintenance.id,
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
                                                            'maintenances.destroy',
                                                            maintenance.id,
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