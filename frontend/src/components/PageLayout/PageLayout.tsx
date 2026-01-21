import React from 'react';
import BottomNav from '../BottomNav/BottomNav';
import CreateMatchButton from '../CreateMatchButton/CreateMatchButton';
import './PageLayout.css';

interface PageLayoutProps {
    children: React.ReactNode;
    variant?: 'centered' | 'full';
    backgroundColor?: string;
    className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    variant = 'centered',
    backgroundColor = '#f0f2f5',
    className = '',
}) => {
    return (
        <div className="min-h-screen relative pb-32">
            <div
                className={`page-layout page-layout--${variant} ${className}`}
                style={{ backgroundColor }}
            >
                {children}
            </div>
            <CreateMatchButton />
            <BottomNav />
        </div>
    );
};

export default PageLayout;
