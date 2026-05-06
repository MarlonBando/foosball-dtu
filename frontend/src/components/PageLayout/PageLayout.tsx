import React from 'react';
import { useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const isTournamentRoute = location.pathname === '/tournament' || location.pathname.startsWith('/tournament/');
    const shouldShowNav = !['/login', '/signup'].includes(location.pathname) && !isTournamentRoute;
    const shouldShowCreateButton = shouldShowNav && !location.pathname.startsWith('/match');

    return (
        <div className="page-layout-root">
            <div
                className={`page-layout page-layout--${variant} ${className}`}
                style={{ backgroundColor }}
            >
                {children}
            </div>
            {shouldShowNav && (
                <>
                    {shouldShowCreateButton && <CreateMatchButton />}
                    <BottomNav />
                </>
            )}
        </div>
    );
};

export default PageLayout;
