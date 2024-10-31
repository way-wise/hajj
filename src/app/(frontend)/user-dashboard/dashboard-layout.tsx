import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {

}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }: { children: ReactNode }) => {
    return (
        <div className='w-full h-screen'>
            <div className="container">
                <div className='py-12 flex gap-12 items-start'>
                    <Sidebar />
                    <div className='w-3/4 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-lg'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;