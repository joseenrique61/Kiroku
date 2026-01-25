import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    action?: ReactNode;
    className?: string;
}

export function ChartCard({
    title,
    description,
    children,
    action,
    className = '',
}: ChartCardProps) {
    return (
        <Card className={`chart-card ${className}`}>
            <CardHeader>
                <div className="chart-card__header">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {description && (
                            <CardDescription>{description}</CardDescription>
                        )}
                    </div>
                    {action && <div className="chart-card__action">{action}</div>}
                </div>
            </CardHeader>
            <CardContent className="chart-card__content">
                {children}
            </CardContent>
        </Card>
    );
}
