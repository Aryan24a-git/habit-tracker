import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, BarChart3, Settings, Menu } from 'lucide-react';
import clsx from 'clsx';
import { SettingsModal } from './SettingsModal';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'habits' | 'analytics';
    onTabChange: (tab: 'dashboard' | 'habits' | 'analytics') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'habits', label: 'My Habits', icon: CheckSquare },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ] as const;

    return (
        <div className="min-h-screen bg-dark-900 text-gray-100 flex font-sans">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 flex-col border-r border-dark-800 bg-dark-950/50 backdrop-blur-xl">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                        Habit Tracker
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={clsx(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                                activeTab === item.id
                                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20 shadow-[0_0_15px_-3px_rgba(234,179,8,0.1)]'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-dark-800">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 w-full transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-dark-950/80 backdrop-blur-md border-b border-dark-800 z-50 px-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gold-400">Habit Tracker</h1>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-300">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 pt-20 md:pt-0 p-4 md:p-8 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-dark-800 scrollbar-track-transparent">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-dark-950/95 md:hidden pt-20 px-6 space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={clsx(
                                'w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg',
                                activeTab === item.id ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400'
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={() => {
                                setIsSettingsOpen(true);
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg text-gray-400"
                        >
                            <Settings className="w-6 h-6" />
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};
