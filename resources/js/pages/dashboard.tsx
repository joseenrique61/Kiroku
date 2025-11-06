import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="dashboard-page">
                <div className="dashboard-page__grid">
                    <div className="dashboard-page__card">
                    </div>
                    <div className="dashboard-page__card">
                    </div>
                    <div className="dashboard-page__card">
                    </div>
                </div>
                <div className="dashboard-page__main-card">
                </div>
            </div>
        </AppLayout>
    );
}
