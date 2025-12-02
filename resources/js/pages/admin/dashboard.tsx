import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import { Select } from '@/components/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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

interface FailureRateItem {
    name: string;
    percentage: number;
}

interface MttrItem {
    name: string;
    mttr: number;
}

interface AdminDashboardProps {
    predictiveRiskList: PredictiveRiskItem[];
    failureRateByFailureType: FailureRateItem[];
    failureRateByBrand: FailureRateItem[];
    generalMttr: number;
    mttrByCategory: MttrItem[];
    mttrByBrand: MttrItem[];
}

export default function AdminDashboard({
    predictiveRiskList,
    failureRateByFailureType,
    failureRateByBrand,
    generalMttr,
    mttrByCategory,
    mttrByBrand
}: AdminDashboardProps) {
    const [months, setMonths] = useState('3');

    const handleMonthsChange = (e: string) => {
        const newMonths = e;
        setMonths(newMonths);

        router.get(
            route('dashboard'), // La misma ruta actual
            { months: newMonths }, // Enviamos el parámetro como query string (?months=6)
            {
                preserveState: true, // Mantiene el estado de React (no resetea otros componentes)
                preserveScroll: true, // No mueve el scroll de la página
                only: ['predictiveRiskList'], // Solo pide este dato al servidor
            },
        );
    };

    function getColorForRisk(riskLevel: number) {
        if (riskLevel < 30) {
            return 'ok';
        } else if (riskLevel < 70) {
            return 'warning';
        } else {
            return 'alert';
        }
    }

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="admin-dashboard-page">
                <Card>
                    <CardHeader>
                        <CardTitle>General MTTR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{generalMttr} hours</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>MTTR By Device Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>MTTR (hours)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mttrByCategory.length > 0 ? (
                                    mttrByCategory.map((item) => (
                                        <TableRow key={item.name}>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.mttr}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>No data</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>MTTR By Device Brand</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>MTTR (hours)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mttrByBrand.length > 0 ? (
                                    mttrByBrand.map((item) => (
                                        <TableRow key={item.name}>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.mttr}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>No data</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Failure Rate by Brand</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Percentage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {failureRateByBrand.length > 0 ? (
                                    failureRateByBrand.map((item) => (
                                        <TableRow key={item.name}>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.percentage}%
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>No data</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Failure Rate by Failure Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Failure Type</TableHead>
                                    <TableHead>Percentage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {failureRateByFailureType.length > 0 ? (
                                    failureRateByFailureType.map((item) => (
                                        <TableRow key={item.name}>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.percentage}%
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>No data</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Predictive Failure Risk Analysis</CardTitle>
                        <CardDescription>
                            Devices at risk of failure in the next 3 months.
                            <Select
                                name=""
                                value={months}
                                onValueChange={handleMonthsChange}
                                options={[
                                    {
                                        label: '3 months',
                                        value: '3',
                                    },
                                    {
                                        label: '6 months',
                                        value: '6',
                                    },
                                    {
                                        label: '18 months',
                                        value: '18',
                                    },
                                ]}
                            />
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
                                    predictiveRiskList
                                        .toSorted(
                                            (a, b) =>
                                                b.probability_percentage -
                                                a.probability_percentage,
                                        )
                                        .map((item) => (
                                            <TableRow key={item.device_id}>
                                                <TableCell>
                                                    {item.serial_number}
                                                </TableCell>
                                                <TableCell>
                                                    {item.model}
                                                </TableCell>
                                                <TableCell>
                                                    <p
                                                        className={`table__text--${getColorForRisk(item.probability_percentage)}`}
                                                    >
                                                        {item.risk_level}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.probability_percentage
                                                    }
                                                    %
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
