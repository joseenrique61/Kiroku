import { Head } from '@inertiajs/react';

import AppearanceTabs, { TabItem } from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    const appearanceTabs: TabItem[] = [
        {
            id: 'theme',
            label: 'Theme',
            content: (
                <div>
                    <p>Theme settings content goes here.</p>
                </div>
            ),
        },
        {
            id: 'language',
            label: 'Language',
            content: (
                <div>
                    <p>Language settings content goes here.</p>
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="appearance-settings">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs tabs={appearanceTabs} />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}