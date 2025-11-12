import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { Failure } from '@/types/globals';
import { Head } from '@inertiajs/react';

export default function FailureShow({ failure }: { failure: Failure }) {
    return (
        <AppLayout>
            <Head title={`Failure #${failure.id}`} />
            <Card>
                <CardHeader>
                    <CardTitle>{`Failure #${failure.id}`}</CardTitle>
                </CardHeader>
                <CardContent className="failure-show-page__card-content">
                    <div className="failure-show-page__detail-group">
                        <h3 className="failure-show-page__detail-label">Description</h3>
                        <p>{failure.description}</p>
                    </div>
                    <div className="failure-show-page__detail-group">
                        <h3 className="failure-show-page__detail-label">Cause</h3>
                        <p>{failure.cause}</p>
                    </div>
                    <div className="failure-show-page__detail-group">
                        <h3 className="failure-show-page__detail-label">Failure Type</h3>
                        <p>{failure.failure_type.name}</p>
                    </div>
                    <div className="failure-show-page__detail-group">
                        <h3 className="failure-show-page__detail-label">Maintenance ID</h3>
                        <p>{failure.maintenance_id}</p>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
