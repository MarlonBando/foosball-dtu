import React, { useId, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, ChevronDown, Eye, EyeOff } from 'lucide-react';
import Spinner from '../Spinner/Spinner';

const controlClass = `w-full h-12 pl-11 rounded-xl border border-slate-200 bg-slate-50
    text-base placeholder-gray-400 transition-all
    focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:opacity-60`;

interface FieldShellProps {
    id: string;
    label: string;
    icon: LucideIcon;
    hint?: React.ReactNode;
    children: React.ReactNode;
}

const FieldShell: React.FC<FieldShellProps> = ({ id, label, icon: Icon, hint, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label}
        </label>
        <div className="relative">
            <Icon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            {children}
        </div>
        {hint && <p id={`${id}-hint`} className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
);

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    hint?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({ label, icon, hint, type = 'text', ...props }) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <FieldShell id={id} label={label} icon={icon} hint={hint}>
            <input
                id={id}
                type={isPassword && showPassword ? 'text' : type}
                aria-describedby={hint ? `${id}-hint` : undefined}
                className={`${controlClass} text-gray-900 ${isPassword ? 'pr-12' : 'pr-4'}`}
                {...props}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center
                               text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </FieldShell>
    );
};

interface AuthSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    icon: LucideIcon;
    hint?: React.ReactNode;
}

export const AuthSelect: React.FC<AuthSelectProps> = ({ label, icon, hint, children, value, ...props }) => {
    const id = useId();

    return (
        <FieldShell id={id} label={label} icon={icon} hint={hint}>
            <select
                id={id}
                value={value}
                aria-describedby={hint ? `${id}-hint` : undefined}
                className={`${controlClass} pr-10 appearance-none cursor-pointer ${value ? 'text-gray-900' : 'text-gray-400'}`}
                {...props}
            >
                {children}
            </select>
            <ChevronDown
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
        </FieldShell>
    );
};

export const AuthError: React.FC<{ message: string }> = ({ message }) => (
    <div
        role="alert"
        className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700"
    >
        <AlertCircle size={18} className="shrink-0 mt-px" />
        <span>{message}</span>
    </div>
);

interface AuthSubmitProps {
    loading: boolean;
    loadingLabel: string;
    children: React.ReactNode;
}

export const AuthSubmit: React.FC<AuthSubmitProps> = ({ loading, loadingLabel, children }) => (
    <button
        type="submit"
        disabled={loading}
        className="w-full h-12 mt-2 rounded-xl bg-primary text-white font-semibold text-base
                   flex items-center justify-center gap-2 shadow-lg shadow-primary/25
                   hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer
                   disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
    >
        {loading ? (
            <>
                <Spinner size="small" color="#ffffff" />
                <span>{loadingLabel}</span>
            </>
        ) : (
            children
        )}
    </button>
);
