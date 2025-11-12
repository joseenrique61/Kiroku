import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types/user';
import { Head } from '@inertiajs/react';

export default function UserShow({ user }: { user: User }) {
    return (
        <AppLayout>
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
                        <p>{user.role.name}</p>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
