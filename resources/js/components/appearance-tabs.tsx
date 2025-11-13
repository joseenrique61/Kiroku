import React, { useState } from 'react';

export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface AppearanceTabsProps {
    tabs: TabItem[];
    initialTab?: string;
}

const AppearanceTabs: React.FC<AppearanceTabsProps> = ({
    tabs,
    initialTab,
}) => {
    const [activeTab, setActiveTab] = useState(
        initialTab || (tabs.length > 0 ? tabs[0].id : ''),
    );

    return (
        <div className="appearance-tabs">
            <div className="appearance-tabs__list">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={[
                            'appearance-tabs__item',
                            activeTab === tab.id
                                ? 'appearance-tabs__item--active'
                                : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className="appearance-tabs__content">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};

export default AppearanceTabs;
