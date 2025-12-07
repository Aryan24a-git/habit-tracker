import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase } from 'lucide-react';
import { clsx } from 'clsx';

export const PomodoroTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        let interval: any;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            playAlert();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode: 'work' | 'break') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const playAlert = () => {
        // Simple oscillator beep
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioContextRef.current;
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);

        oscillator.start();
        setTimeout(() => oscillator.stop(), 500);
    };

    return (
        <div className="bg-dark-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-gold-500/20 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-dark-700">
                <div
                    className={clsx("h-full transition-all duration-1000", mode === 'work' ? "bg-gold-500" : "bg-green-500")}
                    style={{ width: `${(timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) * 100}%` }}
                />
            </div>

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {mode === 'work' ? (
                        <>
                            <Briefcase className="w-5 h-5 text-gold-500" />
                            Focus Timer
                        </>
                    ) : (
                        <>
                            <Coffee className="w-5 h-5 text-green-500" />
                            Break Time
                        </>
                    )}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => switchMode('work')}
                        className={clsx(
                            "text-xs px-3 py-1 rounded-full transition-colors",
                            mode === 'work' ? "bg-gold-500 text-black font-bold" : "bg-dark-700 text-gray-400 hover:text-white"
                        )}
                    >
                        Work
                    </button>
                    <button
                        onClick={() => switchMode('break')}
                        className={clsx(
                            "text-xs px-3 py-1 rounded-full transition-colors",
                            mode === 'break' ? "bg-green-500 text-black font-bold" : "bg-dark-700 text-gray-400 hover:text-white"
                        )}
                    >
                        Break
                    </button>
                </div>
            </div>

            <div className="text-center mb-8">
                <div className={clsx(
                    "text-6xl font-black tabular-nums tracking-tight transition-colors duration-300",
                    mode === 'work' ? "text-white" : "text-green-400"
                )}>
                    {formatTime(timeLeft)}
                </div>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                    {isActive ? 'Keep going!' : 'Ready to start?'}
                </p>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={toggleTimer}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95",
                        mode === 'work'
                            ? "bg-gold-500 text-dark-950 hover:bg-gold-400"
                            : "bg-green-500 text-dark-950 hover:bg-green-400"
                    )}
                >
                    {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={resetTimer}
                    className="p-3 bg-dark-700 text-gray-400 rounded-xl hover:bg-dark-600 hover:text-white transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
