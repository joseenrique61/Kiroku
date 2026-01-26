import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { MetricCardProps } from '@/types/chart-types';
import { ArrowDown, ArrowUp } from 'lucide-react';

export function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    variant = 'default',
    description,
}: MetricCardProps) {
    const getTrendColor = () => {
        if (!trend) return '';
        return trend > 0 ? 'metric-card__trend--positive' : 'metric-card__trend--negative';
    };

    return (
        <Card className={`metric-card metric-card--${variant}`}>
            <CardHeader>
                <div className="metric-card__header">
                    <CardTitle className="metric-card__title">{title}</CardTitle>
                    {Icon && (
                        <div className="metric-card__icon">
                            <Icon size={24} />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="metric-card__value">{value}</div>
                {description && (
                    <p className="metric-card__description">{description}</p>
                )}
                {trend !== undefined && (
                    <div className={`metric-card__trend ${getTrendColor()}`}>
                        {trend > 0 ? (
                            <ArrowUp size={16} />
                        ) : (
                            <ArrowDown size={16} />
                        )}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
