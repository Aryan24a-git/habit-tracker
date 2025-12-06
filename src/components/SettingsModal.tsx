import React from 'react';
import { X, RefreshCw, Trash2, AlertTriangle, User, Instagram, Github, Linkedin } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { InstallPWA } from './InstallPWA';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { resetProgress } = useHabits();

    if (!isOpen) return null;

    const handleReset = () => {
        resetProgress();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-dark-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-gold-500" />
                    Settings
                </h2>

                <div className="space-y-6">
                    {/* PWA Install Button */}
                    <InstallPWA />

                    {/* Personal Bio */}
                    <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                        <h3 className="text-gold-400 font-bold flex items-center gap-2 mb-3">
                            <User className="w-5 h-5" />
                            About Developer
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed italic mb-4">
                            "Hi, I’m Aryan — a B.Tech CSE student focused on backend engineering, DevOps, and AI systems. I love building real-world projects, experimenting with automation, and creating intelligent tools that solve practical problems. Always learning, always improving."
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                            <a
                                href="https://www.instagram.com/aryan_24a"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/5 rounded-lg hover:bg-gold-500/10 hover:text-gold-400 transition-all duration-200 group"
                                title="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com/Aryan24a-git"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/5 rounded-lg hover:bg-gold-500/10 hover:text-gold-400 transition-all duration-200 group"
                                title="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com/in/aryan-sk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/5 rounded-lg hover:bg-gold-500/10 hover:text-gold-400 transition-all duration-200 group"
                                title="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
                        <h3 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Resetting functionality works exactly like the original sheet. It will clear all checkboxes for all days.
                        </p>
                        <button
                            onClick={handleReset}
                            className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" />
                            Reset All Progress
                        </button>
                    </div>

                    {/* Copyright Footer */}
                    <div className="text-center text-gray-500 text-xs border-t border-white/5 pt-4">
                        © 2025 Aryan. All Rights Reserved ❤️.
                    </div>
                </div>
            </div>
        </div>
    );
};
