import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';

export default function Home() {
    return (
        <AppLayout>
            <Head title="Home" />
            <div className="admin-dashboard-page">
                <div className="home-page__main-card">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to Kiroku</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>This is your home page. You can use the links above to navigate to the different sections of the application.</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="admin-dashboard-page__grid">
                    <Link href={route('devices.index')}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Devices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>View and manage your devices.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={route('maintenances.index')}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Maintenances</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>View and manage maintenance records.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={route('failureTypes.index')}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Failures</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>View and manage failure records.</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}