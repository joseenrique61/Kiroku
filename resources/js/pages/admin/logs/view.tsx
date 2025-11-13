import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import AppLayout from '@/layouts/app-layout';
import { AuditLog } from '@/types/globals';
import { Head } from '@inertiajs/react';

export default function LogShow({ log }: { log: AuditLog }) {
    return (
        <AppLayout>
            <Head title={`Log #${log.id}`} />
            <Card>
                <CardHeader>
                    <CardTitle>{`Log #${log.id}`}</CardTitle>
                </CardHeader>
                <CardContent className="log-view-page__card-content">
                    <div className="log-view-page__detail-group">
                        <h3 className="log-view-page__detail-label">Table</h3>
                        <p>{log.table_name}</p>
                    </div>
                    <div className="log-view-page__detail-group">
                        <h3 className="log-view-page__detail-label">Operation</h3>
                        <p>{log.operation}</p>
                    </div>
                    <div className="log-view-page__detail-group">
                        <h3 className="log-view-page__detail-label">User</h3>
                        <p>{log.user.name}</p>
                    </div>
                    <div className="log-view-page__detail-group">
                        <h3 className="log-view-page__detail-label">IP Address</h3>
                        <p>{log.host_ip}</p>
                    </div>
                    <div className="log-view-page__detail-group">
                        <h3 className="log-view-page__detail-label">Value Before</h3>
                        <pre className="log-view-page__detail-value">{JSON.stringify(log.value_before, null, 2)}</pre>
                    </div>
                    <div className="log-view-page__detail-group">
                        <h3 className="log-view-page__detail-label">Value After</h3>
                        <pre className="log-view-page__detail-value">{JSON.stringify(log.value_after, null, 2)}</pre>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
