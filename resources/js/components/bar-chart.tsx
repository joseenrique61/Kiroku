import { ResponsiveBar } from '@nivo/bar';
import { BarChartDataItem, ChartColors } from '@/types/chart-types';

interface BarChartProps {
    data: BarChartDataItem[];
    keys: string[];
    indexBy: string;
    height?: number;
    colors?: ChartColors;
    layout?: 'horizontal' | 'vertical';
    enableLabel?: boolean;
    axisBottomLegend?: string;
    axisLeftLegend?: string;
}

const defaultColors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function BarChart({
    data,
    keys,
    indexBy,
    height = 400,
    colors,
    layout = 'vertical',
    enableLabel = true,
    axisBottomLegend,
    axisLeftLegend,
}: BarChartProps) {
    return (
        <div style={{ height: `${height}px` }}>
            <ResponsiveBar
                data={data}
                keys={keys}
                indexBy={indexBy}
                layout={layout}
                margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={colors?.scheme || defaultColors}
                borderRadius={6}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: axisBottomLegend,
                    legendPosition: 'middle',
                    legendOffset: 45,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: axisLeftLegend,
                    legendPosition: 'middle',
                    legendOffset: -60,
                }}
                enableLabel={enableLabel}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]],
                }}
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
