import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Habit, HabitLog, HabitContextType } from '../types';
import { subMonths, isBefore, parseISO } from 'date-fns';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const STORAGE_KEY_HABITS = 'habit-tracker-habits';
const STORAGE_KEY_LOGS = 'habit-tracker-logs';
const MAX_STORAGE_MONTHS = 6;

const DEFAULT_HABITS: Habit[] = [
    { id: '1', name: 'Morning Walk', category: 'Health', goal: 1, streak: 0, completedTotal: 0, createdAt: new Date().toISOString() },
    { id: '2', name: 'Read 10 Pages', category: 'Mindset', goal: 1, streak: 0, completedTotal: 0, createdAt: new Date().toISOString() },
    { id: '3', name: 'Deep Work (2h)', category: 'Productivity', goal: 1, streak: 0, completedTotal: 0, createdAt: new Date().toISOString() },
    { id: '4', name: 'No Sugar', category: 'Health', goal: 1, streak: 0, completedTotal: 0, createdAt: new Date().toISOString() },
];

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_HABITS);
        return stored ? JSON.parse(stored) : DEFAULT_HABITS;
    });

    const [logs, setLogs] = useState<HabitLog>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_LOGS);
        return stored ? JSON.parse(stored) : {};
    });

    // Prune old logs (older than 6 months)
    useEffect(() => {
        const cutoffDate = subMonths(new Date(), MAX_STORAGE_MONTHS);
        let hasChanges = false;

        const newLogs = { ...logs };
        Object.keys(newLogs).forEach(dateStr => {
            const date = parseISO(dateStr);
            if (isBefore(date, cutoffDate)) {
                delete newLogs[dateStr];
                hasChanges = true;
            }
        });

        if (hasChanges) {
            setLogs(newLogs);
            console.log('Pruned old habit logs');
        }
    }, []); // Run once on mount

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    }, [habits]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    }, [logs]);

    const addHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'completedTotal' | 'createdAt'>) => {
        const habit: Habit = {
            ...newHabit,
            id: crypto.randomUUID(),
            streak: 0,
            completedTotal: 0,
            createdAt: new Date().toISOString(),
        };
        setHabits([...habits, habit]);
    };

    const updateHabit = (id: string, updates: Partial<Habit>) => {
        setHabits(habits.map(h => h.id === id ? { ...h, ...updates } : h));
    };

    const deleteHabit = (id: string) => {
        setHabits(habits.filter(h => h.id !== id));
        // Clean up logs? Optional
    };

    const toggleHabit = (id: string, date: string) => {
        setLogs(prev => {
            const dateLogs = prev[date] || {};
            const isCompleted = !dateLogs[id];

            const newLogs = {
                ...prev,
                [date]: {
                    ...dateLogs,
                    [id]: isCompleted
                }
            };

            // Update streak/stats logic would go here, simplified for now
            return newLogs;
        });
    };

    const resetProgress = () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            setLogs({});
        }
    };

    const getCompletionPercentage = (habitId: string, range: number = 7) => {
        const dates = Array.from({ length: range }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        });

        const completedCount = dates.reduce((acc, date) => {
            return acc + (logs[date]?.[habitId] ? 1 : 0);
        }, 0);

        return Math.round((completedCount / range) * 100);
    };

    return (
        <HabitContext.Provider value={{ habits, logs, addHabit, updateHabit, deleteHabit, toggleHabit, resetProgress, getCompletionPercentage }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabits must be used within a HabitProvider');
    return context;
};
