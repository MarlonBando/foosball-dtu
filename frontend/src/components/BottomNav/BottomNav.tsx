import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { History, Trophy, User } from 'lucide-react';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname;
        if (path === '/home') return 'history';
        if (path === '/leaderboard') return 'leaderboard';
        if (path === '/profile') return 'profile';
        return '';
    };

    const activeTab = getActiveTab();

    const navItems = [
        {
            id: 'history',
            label: 'History',
            icon: History,
            path: '/home',
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
            path: '/profile',
        },
        {
            id: 'leaderboard',
            label: 'Leaderboard',
            icon: Trophy,
            path: '/leaderboard',
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
            <div className="mx-auto max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 flex justify-around items-center px-2 h-16">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex-1 relative flex flex-col items-center justify-center h-full transition-colors duration-300
                                ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className={`transition-all duration-300 transform 
                                ${isActive ? '-translate-y-2' : 'translate-y-0'}`}
                            >
                                <div className={`p-1.5 rounded-xl transition-all duration-300 
                                    ${isActive ? 'bg-primary/10 shadow-inner' : 'bg-transparent'}`}
                                >
                                    <Icon
                                        size={24}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>
                            </span>
                            <span className={`absolute bottom-2 text-[10px] font-medium transition-all duration-300
                                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
