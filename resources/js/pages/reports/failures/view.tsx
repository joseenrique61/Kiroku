import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { FailureType } from '@/types/globals';
import { Head } from '@inertiajs/react';

export default function FailureShow({ failureType }: { failureType: FailureType }) {
    return (
        <AppLayout>
            <Head title={`Failure Type - ${failureType.name}`} />
            <Card>
                <CardHeader>
                    <CardTitle>{`Failure Type - ${failureType.name}`}</CardTitle>
                </CardHeader>
                <CardContent className="failure-show-page__card-content">
                    <div className="failure-show-page__detail-group">
                        <h3 className="failure-show-page__detail-label">Name</h3>
                        <p>{failureType.name}</p>
                    </div>
                    <div className="failure-show-page__detail-group">
                        <h3 className="failure-show-page__detail-label">Severity</h3>
                        <p>{failureType.severity}</p>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
