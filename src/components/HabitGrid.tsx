import React, { useState } from 'react';
import { format, isSameDay, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import clsx from 'clsx';
import { Check, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface HabitGridProps {
    onEditHabit?: (id: string) => void;
}

type ViewMode = 'week' | 'month';

export const HabitGrid: React.FC<HabitGridProps> = ({ onEditHabit }) => {
    const { habits, logs, toggleHabit } = useHabits();
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calculate days based on view mode
    const days = React.useMemo(() => {
        if (viewMode === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            return Array.from({ length: 7 }, (_, i) => addDays(start, i));
        } else {
            const start = startOfMonth(currentDate);
            const end = endOfMonth(currentDate);
            return eachDayOfInterval({ start, end });
        }
    }, [viewMode, currentDate]);

    const isCompleted = (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return logs[dateStr]?.[habitId] || false;
    };

    const navigate = (direction: 'prev' | 'next') => {
        const amount = direction === 'next' ? 1 : -1;
        if (viewMode === 'week') {
            setCurrentDate(d => addDays(d, amount * 7));
        } else {
            setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + amount, 1));
        }
    };

    const jumpToToday = () => setCurrentDate(new Date());

    // Format header date
    const headerTitle = viewMode === 'week'
        ? `Week of ${format(days[0], 'MMM d, yyyy')}`
        : format(currentDate, 'MMMM yyyy');

    return (
        <div className="bg-dark-800/30 rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full">
            {/* Header Controls */}
            <div className="p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-white min-w-[200px]">{headerTitle}</h3>
                    <div className="flex items-center gap-1 bg-dark-900/50 rounded-lg p-1 border border-white/5 relative">
                        <button
                            onClick={() => navigate('prev')}
                            className="p-1 hover:text-white text-gray-400 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={jumpToToday}
                            className="text-xs font-medium px-2 py-1 hover:text-white text-gray-400 transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => navigate('next')}
                            className="p-1 hover:text-white text-gray-400 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <div className="relative group">
                            <input
                                type="date"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                onChange={(e) => {
                                    if (e.target.valueAsDate) {
                                        setCurrentDate(e.target.valueAsDate);
                                    }
                                }}
                            />
                            <button className="p-1 group-hover:text-white text-gray-400 transition-colors" title="Jump to Date">
                                <Calendar className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex bg-dark-900/50 p-1 rounded-xl border border-white/5 mx-auto md:mx-0">
                    <button
                        onClick={() => setViewMode('week')}
                        className={clsx(
                            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                            viewMode === 'week'
                                ? "bg-gold-500 text-dark-950 shadow-lg"
                                : "text-gray-400 hover:text-white"
                        )}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setViewMode('month')}
                        className={clsx(
                            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                            viewMode === 'month'
                                ? "bg-gold-500 text-dark-950 shadow-lg"
                                : "text-gray-400 hover:text-white"
                        )}
                    >
                        Month
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent">
                <table className="w-full min-w-max border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 bg-dark-900/95 backdrop-blur-sm text-left py-4 px-6 text-gray-400 font-medium w-[250px] border-b border-white/5">
                                Habit
                            </th>
                            {days.map(date => (
                                <th key={date.toString()} className="text-center py-4 px-1 min-w-[50px] border-b border-white/5">
                                    <div className={clsx(
                                        "flex flex-col items-center justify-center rounded-xl w-10 h-14 mx-auto",
                                        isSameDay(date, new Date()) ? "bg-gold-500/10 text-gold-400 border border-gold-500/20" : "text-gray-500"
                                    )}>
                                        <span className="text-[10px] font-medium uppercase">{format(date, 'EEE')}</span>
                                        <span className={clsx("text-sm font-bold", isSameDay(date, new Date()) && "text-gold-400")}>{format(date, 'd')}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {habits.map(habit => (
                            <tr key={habit.id} className="hover:bg-white/5 transition-colors group">
                                <td className="sticky left-0 z-10 bg-dark-900/95 backdrop-blur-sm py-4 px-6 border-r border-white/5 group-hover:bg-dark-800/80 transition-colors">
                                    <div
                                        className="cursor-pointer group-hover:text-gold-400 transition-colors flex items-center justify-between"
                                        onClick={() => onEditHabit?.(habit.id)}
                                    >
                                        <div>
                                            <div className="font-medium text-gray-200 truncate max-w-[180px]">{habit.name}</div>
                                            <div className="text-xs text-gray-500">{habit.category}</div>
                                        </div>
                                    </div>
                                </td>
                                {days.map(date => {
                                    const completed = isCompleted(habit.id, date);
                                    const dateStr = format(date, 'yyyy-MM-dd');
                                    const isTodayDate = isSameDay(date, new Date());

                                    return (
                                        <td key={dateStr} className={clsx("py-4 px-1 text-center", isTodayDate && "bg-white/[0.02]")}>
                                            <button
                                                onClick={() => toggleHabit(habit.id, dateStr)}
                                                className={clsx(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 mx-auto",
                                                    completed
                                                        ? "bg-gold-500 text-dark-950 shadow-[0_0_8px_rgba(234,179,8,0.4)] transform scale-100"
                                                        : "bg-dark-900 border border-white/10 text-transparent hover:border-gold-500/50"
                                                )}
                                                title={`${habit.name} - ${format(date, 'MMM d')}`}
                                            >
                                                <Check className={clsx("w-5 h-5", completed ? "opacity-100" : "opacity-0")} strokeWidth={3} />
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {habits.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No habits yet. Click "New Habit" to get started!
                    </div>
                )}
            </div>
        </div>
    );
};
