import { ResponsivePie } from '@nivo/pie';
import { PieChartDataItem, ChartColors } from '@/types/chart-types';

interface PieChartProps {
    data: PieChartDataItem[];
    height?: number;
    colors?: ChartColors;
    enableArcLabels?: boolean;
    enableArcLinkLabels?: boolean;
    innerRadius?: number;
}

const defaultColors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

export function PieChart({
    data,
    height = 350,
    colors,
    enableArcLabels = true,
    enableArcLinkLabels = true,
    innerRadius = 0,
}: PieChartProps) {
    return (
        <div style={{ height: `${height}px` }}>
            <ResponsivePie
                data={data}
                margin={{ top: 30, right: 120, bottom: 30, left: 20 }}
                innerRadius={innerRadius}
                padAngle={1}
                cornerRadius={4}
                activeOuterRadiusOffset={8}
                colors={colors?.scheme || defaultColors}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]],
                }}
                enableArcLabels={enableArcLabels}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]],
                }}
                enableArcLinkLabels={enableArcLinkLabels}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#64748b"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                legends={[
                    {
                        anchor: 'right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 8,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: '#64748b',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 14,
                        symbolShape: 'circle',
                    },
                ]}
                theme={{
                    text: {
                        fontSize: 12,
                        fill: '#64748b',
                    },
                    tooltip: {
                        container: {
                            background: '#ffffff',
                            color: '#1e293b',
                            fontSize: '14px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            padding: '12px 16px',
                        },
                    },
                }}
                animate={true}
                motionConfig="gentle"
            />
        </div>
    );
}
