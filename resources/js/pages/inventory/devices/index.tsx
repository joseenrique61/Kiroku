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
import { Device } from '@/types/globals';
import { Head, Link } from '@inertiajs/react';

export default function DeviceIndex({ devices }: { devices: Device[] }) {
    return (
        <AppLayout>
            <Head title="Devices" />
            <Card>
                <CardHeader>
                    <CardTitle>Devices</CardTitle>
                    <CardDescription>
                        A list of all the devices in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="device-index-page__card-content">
                    <div className="device-index-page__actions">
                        <Button asChild>
                            <Link href={route('devices.create')}>
                                Create Device
                            </Link>
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Serial Number</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devices.map((device) => (
                                <TableRow key={device.id}>
                                    <TableCell>
                                        {device.serial_number}
                                    </TableCell>
                                    <TableCell>{device.description}</TableCell>
                                    <TableCell>
                                        {device.device_category.name}
                                    </TableCell>
                                    <TableCell>
                                        {device.device_model.name}
                                    </TableCell>
                                    <TableCell>
                                        {device.device_status.name}
                                    </TableCell>
                                    <TableCell className="device-index-page__table-actions">
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'devices.show',
                                                    device.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                href={route(
                                                    'devices.edit',
                                                    device.id,
                                                )}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button variant={'destructive'} asChild>
                                            <Link
                                                href={route(
                                                    'devices.destroy',
                                                    device.id,
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