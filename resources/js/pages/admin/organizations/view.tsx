import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { Organization } from '@/types/globals';
import { Head, Link } from '@inertiajs/react';

export default function OrganizationView({ organization }: { organization: Organization }) {
    return (
        <AppLayout>
            <Head title={organization.name} />
            <Card>
                <CardHeader>
                    <CardTitle>{organization.name}</CardTitle>
                </CardHeader>
                <CardContent className="organization-show-page__card-content">
                    <div className="organization-show-page__actions">
                        <Button asChild>
                            <Link href={route('organizations.index')}>
                                Go Back
                            </Link>
                        </Button>
                    </div>
                    <div className="organization-show-page__detail-group">
                        <h3 className="organization-show-page__detail-label">Name</h3>
                        <p>{organization.name}</p>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}