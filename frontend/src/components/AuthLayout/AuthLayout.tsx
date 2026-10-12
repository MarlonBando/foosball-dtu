import React from 'react';
import Logo from '../Logo/Logo';

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

// Shared shell for the login and signup pages: red hero banner with the logo,
// and a white card overlapping it that holds the form.
const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children, footer }) => {
    return (
        <div className="min-h-screen min-h-dvh bg-slate-50 flex flex-col text-left">
            {/* Hero Banner - Red Background */}
            <div className="bg-primary text-white px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-20 rounded-b-3xl shadow-2xl relative overflow-hidden">
                {/* Decorative blur elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl pointer-events-none"></div>

                <div className="relative z-10 max-w-md mx-auto text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white p-1 shadow-lg ring-4 ring-white/20">
                        <Logo className="w-full! h-full! p-0! border-0!" alt="Foosball DTU" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    <p className="text-white/80 mt-1">{subtitle}</p>
                </div>
            </div>

            {/* Form Card - overlaps the banner */}
            <div className="flex-1 w-full max-w-md mx-auto px-4 -mt-12 pb-[max(2rem,env(safe-area-inset-bottom))] relative z-10">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    {children}
                </div>
                {footer && (
                    <div className="mt-6 text-center text-sm text-gray-500">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthLayout;
