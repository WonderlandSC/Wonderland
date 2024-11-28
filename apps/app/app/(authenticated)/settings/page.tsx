// apps/app/app/(authenticated)/settings/page.tsx

import React from 'react';
import { Card } from '@repo/design-system/components/ui/card';
import Link from 'next/link';

const SettingsPage = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <CardGrid />
        </div>
    );
};

const CardGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4  text-center rounded-lg">
            <h2 className="text-lg font-semibold">Teachers</h2>
        </Card>
        <Link href="/settings/pricing">
        <Card className="p-4  text-center rounded-lg">
            <h2 className="text-lg font-semibold">Pricing</h2>
        </Card>
        </Link>
        <Card className="p-4  text-center rounded-lg">
            <h2 className="text-lg font-semibold">More</h2>
        </Card>
    </div>
);

export default SettingsPage;