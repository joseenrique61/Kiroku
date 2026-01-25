import { BarChart } from '@/components/bar-chart';
import { ChartCard } from '@/components/chart-card';
import { MetricCard } from '@/components/metric-card';
import { PieChart } from '@/components/pie-chart';
import { Badge } from '@/components/badge';
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
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Clock,
    Server,
    TrendingUp,
} from 'lucide-react';
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

interface DeviceStatusItem {
    name: string;
    count: number;
}

interface ModelItem {
    model_name: string;
    quantity: number;
}

interface AdminDashboardProps {
    predictiveRiskList: PredictiveRiskItem[];
    failureRateByFailureType: FailureRateItem[];
    failureRateByBrand: FailureRateItem[];
    generalMttr: number;
    mttrByCategory: MttrItem[];
    mttrByBrand: MttrItem[];
    deviceCountByStatus: DeviceStatusItem[];
    mostCommonModels: ModelItem[];
}

export default function AdminDashboard({
    predictiveRiskList,
    failureRateByFailureType,
    failureRateByBrand,
    generalMttr,
    mttrByCategory,
    mttrByBrand,
    deviceCountByStatus,
    mostCommonModels,
}: AdminDashboardProps) {
    const [months, setMonths] = useState('3');

    const handleMonthsChange = (e: string) => {
        const newMonths = e;
        setMonths(newMonths);

        router.get(
            route('dashboard'),
            { months: newMonths },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['predictiveRiskList'],
            },
        );
    };

    // Calculate KPIs
    const totalDevices = deviceCountByStatus.reduce(
        (sum, item) => sum + item.count,
        0,
    );

    // Calculate risk levels
    const highRiskDevices = predictiveRiskList.filter(
        (item) => item.probability_percentage >= 70,
    ).length;
    const mediumRiskDevices = predictiveRiskList.filter(
        (item) => item.probability_percentage >= 50 && item.probability_percentage < 70,
    ).length;
    const lowRiskDevices = predictiveRiskList.filter(
        (item) => item.probability_percentage < 50,
    ).length;

    // Find active/operational devices - check for common status names
    const activeDevices =
        deviceCountByStatus.find((item) =>
            item.name.includes('In service')
        )?.count || 0;

    // Find out of service devices - check for common status names
    const outOfServiceDevices =
        deviceCountByStatus.find((item) =>
            item.name.includes('Out of service')
        )?.count || 0;

    // Find in maintenance devices - check for common status names
    const inMaintenanceDevices =
        deviceCountByStatus.find((item) =>
            item.name.includes('In maintenance')
        )?.count || 0;

    // Prepare chart data
    const deviceStatusPieData = deviceCountByStatus.map((item) => ({
        id: item.name,
        label: item.name,
        value: item.count,
    }));

    const mttrByCategoryBarData = mttrByCategory.map((item) => ({
        category: item.name,
        'MTTR (hours)': item.mttr,
    }));

    const mttrByBrandBarData = mttrByBrand.map((item) => ({
        brand: item.name,
        'MTTR (hours)': item.mttr,
    }));

    const failureRateByTypePieData = failureRateByFailureType.map((item) => ({
        id: item.name,
        label: item.name,
        value: item.percentage,
    }));

    const failureRateByBrandPieData = failureRateByBrand.map((item) => ({
        id: item.name,
        label: item.name,
        value: item.percentage,
    }));

    const mostCommonModelsBarData = mostCommonModels.slice(0, 10).map((item) => ({
        model: item.model_name,
        'Quantity': item.quantity,
    }));


    function getRiskBadgeVariant(percentage: number) {
        if (percentage < 30) return 'default';
        if (percentage < 70) return 'warning';
        return 'destructive';
    }

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="admin-dashboard-page">
                {/* KPI Metrics Row */}
                <div className="admin-dashboard-page__metrics">
                    <MetricCard
                        title="Total Devices"
                        value={totalDevices}
                        icon={Server}
                        variant="default"
                        description="All registered devices"
                    />
                    <MetricCard
                        title="Avg. MTTR"
                        value={`${generalMttr.toFixed(2)}h`}
                        icon={Clock}
                        variant="success"
                        description="Mean Time To Repair"
                    />
                    <MetricCard
                        title="High Risk"
                        value={highRiskDevices}
                        icon={AlertTriangle}
                        variant="danger"
                        description="Devices needing attention"
                    />
                    <MetricCard
                        title="Medium Risk"
                        value={mediumRiskDevices}
                        icon={AlertTriangle}
                        variant="warning"
                        description="Devices needing attention"
                    />
                    <MetricCard
                        title="Low Risk"
                        value={lowRiskDevices}
                        icon={AlertTriangle}
                        variant="default"
                        description="Devices needing attention"
                    />
                    <MetricCard
                        title="Active Devices"
                        value={activeDevices}
                        icon={CheckCircle}
                        variant="success"
                        description="Currently operational"
                    />
                    <MetricCard
                        title="Out of Service Devices"
                        value={outOfServiceDevices}
                        icon={AlertCircle}
                        variant="danger"
                        description="Currently operational"
                    />
                    <MetricCard
                        title="In Maintenance Devices"
                        value={inMaintenanceDevices}
                        icon={AlertCircle}
                        variant="warning"
                        description="Currently operational"
                    />
                </div>

                {/* Main Dashboard Grid */}
                <div className="admin-dashboard-page__grid">
                    {/* Device Status Distribution */}
                    <div className="grid-half">
                        <ChartCard
                            title="Device Status Distribution"
                            description="Overview of device operational status"
                        >
                            {deviceStatusPieData.length > 0 ? (
                                <PieChart
                                    data={deviceStatusPieData}
                                    height={350}
                                    colors={{
                                        scheme: [
                                            '#10b981',
                                            '#f59e0b',
                                            '#ef4444',
                                            '#8b5cf6',
                                            '#06b6d4',
                                        ],
                                    }}
                                />
                            ) : (
                                <p className="text-center">No data available</p>
                            )}
                        </ChartCard>
                    </div>

                    {/* Most Common Models */}
                    <div className="grid-half">
                        <ChartCard
                            title="Most Common Models"
                            description="Top 10 device models in inventory"
                        >
                            {mostCommonModelsBarData.length > 0 ? (
                                <BarChart
                                    data={mostCommonModelsBarData}
                                    keys={['Quantity']}
                                    indexBy="model"
                                    height={350}
                                    layout="horizontal"
                                    colors={{
                                        scheme: ['#8b5cf6'],
                                    }}
                                />
                            ) : (
                                <p className="text-center">No data available</p>
                            )}
                        </ChartCard>
                    </div>

                    {/* MTTR by Category */}
                    <div className="grid-half">
                        <ChartCard
                            title="MTTR by Device Category"
                            description="Average repair time per category"
                        >
                            {mttrByCategoryBarData.length > 0 ? (
                                <BarChart
                                    data={mttrByCategoryBarData}
                                    keys={['MTTR (hours)']}
                                    indexBy="category"
                                    height={350}
                                    layout="horizontal"
                                    colors={{
                                        scheme: ['#06b6d4'],
                                    }}
                                    axisLeftLegend="Category"
                                    axisBottomLegend="Hours"
                                />
                            ) : (
                                <p className="text-center">No data available</p>
                            )}
                        </ChartCard>
                    </div>

                    {/* MTTR by Brand */}
                    <div className="grid-half">
                        <ChartCard
                            title="MTTR by Device Brand"
                            description="Average repair time per manufacturer"
                        >
                            {mttrByBrandBarData.length > 0 ? (
                                <BarChart
                                    data={mttrByBrandBarData}
                                    keys={['MTTR (hours)']}
                                    indexBy="brand"
                                    height={350}
                                    layout="horizontal"
                                    colors={{
                                        scheme: ['#10b981'],
                                    }}
                                    axisLeftLegend="Brand"
                                    axisBottomLegend="Hours"
                                />
                            ) : (
                                <p className="text-center">No data available</p>
                            )}
                        </ChartCard>
                    </div>

                    {/* Failure Rate by Type */}
                    <div className="grid-half">
                        <ChartCard
                            title="Failure Rate by Type"
                            description="Distribution of failure types"
                        >
                            {failureRateByTypePieData.length > 0 ? (
                                <PieChart
                                    data={failureRateByTypePieData}
                                    height={350}
                                    colors={{
                                        scheme: [
                                            '#ef4444',
                                            '#f59e0b',
                                            '#eab308',
                                            '#84cc16',
                                            '#22c55e',
                                        ],
                                    }}
                                />
                            ) : (
                                <p className="text-center">No data available</p>
                            )}
                        </ChartCard>
                    </div>

                    {/* Failure Rate by Brand */}
                    <div className="grid-half">
                        <ChartCard
                            title="Failure Rate by Brand"
                            description="Failure percentage per manufacturer"
                        >
                            {failureRateByBrandPieData.length > 0 ? (
                                <PieChart
                                    data={failureRateByBrandPieData}
                                    height={350}
                                    colors={{
                                        scheme: [
                                            '#6366f1',
                                            '#8b5cf6',
                                            '#a855f7',
                                            '#c026d3',
                                            '#d946ef',
                                        ],
                                    }}
                                />
                            ) : (
                                <p className="text-center">No data available</p>
                            )}
                        </ChartCard>
                    </div>

                    {/* Predictive Risk Analysis - Full Width */}
                    <div className="grid-full">
                        <ChartCard
                            title="Predictive Failure Risk Analysis"
                            description={`Devices at risk of failure in the next ${months} months`}
                            action={
                                <Select
                                    name="months-filter"
                                    value={months}
                                    onValueChange={handleMonthsChange}
                                    options={[
                                        { label: '3 months', value: '3' },
                                        { label: '6 months', value: '6' },
                                        { label: '18 months', value: '18' },
                                    ]}
                                />
                            }
                        >
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
                                                        <Badge
                                                            variant={getRiskBadgeVariant(
                                                                item.probability_percentage,
                                                            )}
                                                        >
                                                            {item.risk_level}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                        }}>
                                                            <span style={{ fontWeight: 600 }}>
                                                                {item.probability_percentage}%
                                                            </span>
                                                            <div style={{
                                                                width: '100px',
                                                                height: '6px',
                                                                backgroundColor: '#e5e7eb',
                                                                borderRadius: '3px',
                                                                overflow: 'hidden',
                                                            }}>
                                                                <div style={{
                                                                    width: `${item.probability_percentage}%`,
                                                                    height: '100%',
                                                                    backgroundColor: item.probability_percentage >= 70 ? '#ef4444' :
                                                                        item.probability_percentage >= 30 ? '#f59e0b' : '#10b981',
                                                                    transition: 'width 0.3s ease',
                                                                }} />
                                                            </div>
                                                        </div>
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
                        </ChartCard>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
