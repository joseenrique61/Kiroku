import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="admin-dashboard-page">
                <div className="admin-dashboard-page__grid">
                    <Link href={route('users.index')}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Manage users, roles, and permissions.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={route('devices.index')}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Devices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Manage all devices in the system.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={route('failureTypes.index')}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Failures</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Manage failure records.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={route('maintenances.index')}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Maintenances</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Manage maintenance records.</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
