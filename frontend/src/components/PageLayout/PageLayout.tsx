import React from 'react';
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
        <div
            className={`page-layout page-layout--${variant} ${className}`}
            style={{ backgroundColor }}
        >
            {children}
        </div>
    );
};

export default PageLayout;
