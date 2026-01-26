import { LucideIcon } from 'lucide-react';

export interface BarChartDataItem {
    [key: string]: string | number;
}

export interface PieChartDataItem {
    id: string;
    label: string;
    value: number;
    color?: string;
}

export interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    description?: string;
}

export interface StatWidgetProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    variant?: 'default' | 'success' | 'warning' | 'danger';
}

export interface ChartColors {
    scheme?: string | string[];
}
