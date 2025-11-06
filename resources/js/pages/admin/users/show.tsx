import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index') as string,
    },
];

export default function UserShow({ user }: { user: User }) {
    breadcrumbs.push({
        title: user.name,
        href: route('users.show', user.id) as string,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user.name} />
            <Card>
                <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="user-show-page__card-content">
                    <div className="user-show-page__detail-group">
                        <h3 className="user-show-page__detail-label">Email</h3>
                        <p>{user.email}</p>
                    </div>
                    <div className="user-show-page__detail-group">
                        <h3 className="user-show-page__detail-label">Role</h3>
                        <p>{user.role.role}</p>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
