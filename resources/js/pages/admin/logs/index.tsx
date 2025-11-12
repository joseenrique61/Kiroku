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
import { AuditLog } from '@/types/globals';
import { Head, Link } from '@inertiajs/react';

export default function LogIndex({ logs }: { logs: AuditLog[] }) {
    return (
        <AppLayout>
            <Head title="Logs" />
            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                    <CardDescription>
                        A list of all the audit logs in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="log-index-page__card-content">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Table</TableHead>
                                <TableHead>Operation</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.table_name}</TableCell>
                                    <TableCell>{log.operation}</TableCell>
                                    <TableCell>{log.user.name}</TableCell>
                                    <TableCell>{log.host_ip}</TableCell>
                                    <TableCell className="log-index-page__table-actions">
                                        <Button variant={'outline'} asChild>
                                            <Link
                                                // TODO: Create route for logs
                                                // href={route(
                                                //     'logs.show',
                                                //     log.id,
                                                // )}
                                            >
                                                View
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
