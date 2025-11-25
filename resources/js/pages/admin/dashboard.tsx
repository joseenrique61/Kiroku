import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface PredictiveRiskItem {
    device_id: number;
    serial_number: string;
    model: string;
    probability_percentage: number;
    most_probable_failure: string;
    risk_level: string;
    recommended_action: string;
    ui_color: string;
}

interface AdminDashboardProps {
    predictiveRiskList: PredictiveRiskItem[];
}

export default function AdminDashboard({
    predictiveRiskList,
}: AdminDashboardProps) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="admin-dashboard-page">
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Predictive Failure Risk Analysis</CardTitle>
                        <CardDescription>
                            Devices at risk of failure in the next 3 months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Serial Number</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Risk Level</TableHead>
                                    <TableHead>Probability</TableHead>
                                    <TableHead>Most Probable Failure</TableHead>
                                    <TableHead>Recommended Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {predictiveRiskList.length > 0 ? (
                                    predictiveRiskList.map((item) => (
                                        <TableRow key={item.device_id}>
                                            <TableCell>
                                                {item.serial_number}
                                            </TableCell>
                                            <TableCell>{item.model}</TableCell>
                                            <TableCell
                                                className={item.ui_color}
                                            >
                                                {item.risk_level}
                                            </TableCell>
                                            <TableCell>
                                                {item.probability_percentage}%
                                            </TableCell>
                                            <TableCell>
                                                {item.most_probable_failure}
                                            </TableCell>
                                            <TableCell>
                                                {item.recommended_action}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center"
                                        >
                                            No predictive data available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
