import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types/user';
import { Head, Link } from '@inertiajs/react';

export default function UserView({ user }: { user: User }) {
    return (
        <AppLayout>
            <Head title={user.name} />
            <Card>
                <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="user-show-page__card-content">
                    <div className="user-index-page__actions">
                        <Button asChild>
                            <Link href={route('users.index')}>
                                Go Back
                            </Link>
                        </Button>
                    </div>
                    <div className="user-show-page__detail-group">
                        <h3 className="user-show-page__detail-label">Email</h3>
                        <p>{user.email}</p>
                    </div>
                    <div className="user-show-page__detail-group">
                        <h3 className="user-show-page__detail-label">Organization Team</h3>
                        <p>{user.organization.name}</p>
                    </div>
                    <div className="user-show-page__detail-group">
                        <h3 className="user-show-page__detail-label">Role</h3>
                        <p>{user.roles[0].name}</p>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
