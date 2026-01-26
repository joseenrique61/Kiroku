import {
    Bar,
    BarChart as RechartsBarChart,
    CartesianGrid,
    Label,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
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
    layout = 'vertical', // 'vertical' en Nivo = barras verticales
    enableLabel = true,
    axisBottomLegend,
    axisLeftLegend,
}: BarChartProps) {
    // Recharts maneja el layout un poco diferente.
    // Si layout="vertical", Recharts dibuja barras horizontales.
    // Si layout="horizontal" (por defecto), Recharts dibuja barras verticales.
    // Por ende, debemos invertir la lógica de prop 'layout' para que coincida con la terminología de Nivo.
    const isVerticalBars = layout === 'vertical';
    const rechartsLayout = isVerticalBars ? 'horizontal' : 'vertical';

    // Selección de colores
    const chartColors = (colors?.scheme as string[]) || defaultColors;

    return (
        <div style={{ width: '100%', height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                    data={data}
                    layout={rechartsLayout}
                    margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                    {/* EJE X */}
                    <XAxis
                        type={isVerticalBars ? 'category' : 'number'}
                        dataKey={isVerticalBars ? indexBy : undefined}
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    >
                        {axisBottomLegend && (
                            <Label
                                value={axisBottomLegend}
                                position="insideBottom"
                                offset={-40}
                                style={{ fill: '#64748b', fontSize: '14px' }}
                            />
                        )}
                    </XAxis>

                    {/* EJE Y */}
                    <YAxis
                        type={isVerticalBars ? 'number' : 'category'}
                        dataKey={isVerticalBars ? undefined : indexBy}
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={80} // Espacio para etiquetas largas si es horizontal
                    >
                        {axisLeftLegend && (
                            <Label
                                value={axisLeftLegend}
                                position="insideLeft"
                                angle={-90}
                                offset={-45} // Ajuste para que no se corte
                                style={{ fill: '#64748b', fontSize: '14px', textAnchor: 'middle' }}
                            />
                        )}
                    </YAxis>

                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{
                            background: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            padding: '12px 16px',
                            color: '#1e293b',
                            fontSize: '14px',
                        }}
                    />
                    
                    {/* Renderizamos una barra por cada llave (key) */}
                    {keys.map((key, index) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={chartColors[index % chartColors.length]}
                            // Bordes redondeados: 
                            // Verticales: [TopLeft, TopRight, BottomRight, BottomLeft]
                            // Horizontales: [TopRight, BottomRight, BottomLeft, TopLeft] (Lado derecho redondeado)
                            radius={isVerticalBars ? [6, 6, 0, 0] : [0, 6, 6, 0]}
                            barSize={isVerticalBars ? undefined : 20} // Ajuste opcional de grosor
                            label={
                                enableLabel
                                    ? {
                                          position: isVerticalBars ? 'top' : 'right',
                                          fill: '#64748b',
                                          fontSize: 12,
                                      }
                                    : false
                            }
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
