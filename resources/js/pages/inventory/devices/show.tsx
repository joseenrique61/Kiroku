import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { Device } from '@/types/globals';
import { Head } from '@inertiajs/react';

export default function DeviceShow({ device }: { device: Device }) {
    return (
        <AppLayout>
            <Head title={device.serial_number} />
            <Card>
                <CardHeader>
                    <CardTitle>{device.serial_number}</CardTitle>
                </CardHeader>
                <CardContent className="device-show-page__card-content">
                    <div className="device-show-page__detail-group">
                        <h3 className="device-show-page__detail-label">Description</h3>
                        <p>{device.description}</p>
                    </div>
                    <div className="device-show-page__detail-group">
                        <h3 className="device-show-page__detail-label">Category</h3>
                        <p>{device.device_category.name}</p>
                    </div>
                    <div className="device-show-page__detail-group">
                        <h3 className="device-show-page__detail-label">Model</h3>
                        <p>{device.device_model.name}</p>
                    </div>
                    <div className="device-show-page__detail-group">
                        <h3 className="device-show-page__detail-label">Status</h3>
                        <p>{device.device_status.name}</p>
                    </div>
                    <div className="device-show-page__detail-group">
                        <h3 className="device-show-page__detail-label">Organization</h3>
                        <p>{device.organization.name}</p>
                    </div>
                    <div className="device-show-page__detail-group">
                        <h3 className="device-show-page__detail-label">Price</h3>
                        <p>{device.acquisition.price}</p>
                    </div>
                    <div className="device-show-page__detail-group">
                        <h3 className="device-show-page__detail-label">Acquired At</h3>
                        <p>{device.acquisition.acquired_at}</p>
                    </div>
                    <div className="device-show-page__detail-group">
                        <h3 className="device-show-page__detail-label">Warranty End Date</h3>
                        <p>{device.acquisition.warranty_end_date}</p>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
