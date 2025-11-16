import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { Maintenance } from '@/types/globals';
import { Head } from '@inertiajs/react';

export default function MaintenanceShow({ maintenance }: { maintenance: Maintenance }) {
    return (
        <AppLayout>
            <Head title={`Maintenance #${maintenance.id}`} />
            <Card>
                <CardHeader>
                    <CardTitle>{`Maintenance #${maintenance.id}`}</CardTitle>
                </CardHeader>
                <CardContent className="maintenance-show-page__card-content">
                    <div className="maintenance-show-page__detail-group">
                        <h3 className="maintenance-show-page__detail-label">Device</h3>
                        <p>{maintenance.device.serial_number}</p>
                    </div>
                    <div className="maintenance-show-page__detail-group">
                        <h3 className="maintenance-show-page__detail-label">Cost</h3>
                        <p>${maintenance.cost}</p>
                    </div>
                    <div className="maintenance-show-page__detail-group">
                        <h3 className="maintenance-show-page__detail-label">Date</h3>
                        <p>{maintenance.datetime}</p>
                    </div>
                    <div className="maintenance-show-page__detail-group">
                        <h3 className="maintenance-show-page__detail-label">Type</h3>
                        <p>{maintenance.is_preventive ? 'Preventive' : 'Corrective'}</p>
                    </div>

                    {!maintenance.is_preventive && maintenance.failure && (
                        <>
                            <h2 className="maintenance-show-page__section-title">Failure Details</h2>
                            <div className="maintenance-show-page__detail-group">
                                <h3 className="maintenance-show-page__detail-label">Failure Type</h3>
                                <p>{maintenance.failure.failure_type?.name || 'N/A'}</p>
                            </div>
                            <div className="maintenance-show-page__detail-group">
                                <h3 className="maintenance-show-page__detail-label">Description</h3>
                                <p>{maintenance.failure.description}</p>
                            </div>
                            <div className="maintenance-show-page__detail-group">
                                <h3 className="maintenance-show-page__detail-label">Cause</h3>
                                <p>{maintenance.failure.cause}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}