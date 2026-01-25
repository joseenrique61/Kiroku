import { StatWidgetProps } from '@/types/chart-types';

export function StatWidget({
    label,
    value,
    icon: Icon,
    variant = 'default',
}: StatWidgetProps) {
    return (
        <div className={`stat-widget stat-widget--${variant}`}>
            {Icon && (
                <div className="stat-widget__icon">
                    <Icon size={20} />
                </div>
            )}
            <div className="stat-widget__content">
                <div className="stat-widget__label">{label}</div>
                <div className="stat-widget__value">{value}</div>
            </div>
        </div>
    );
}
