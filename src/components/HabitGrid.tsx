import React, { useState, useRef, useEffect } from 'react';
import { format, isSameDay, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import clsx from 'clsx';
import { Check, ChevronLeft, ChevronRight, Calendar, GripVertical } from 'lucide-react';

interface HabitGridProps {
    onEditHabit?: (id: string) => void;
}

type ViewMode = 'week' | 'month';

export const HabitGrid: React.FC<HabitGridProps> = ({ onEditHabit }) => {
    const { habits, logs, toggleHabit } = useHabits();
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Resizable column state
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

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

    // Resizing Logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            // Limit width between 100px and 400px
            const newWidth = Math.max(100, Math.min(400, e.clientX - (sidebarRef.current?.getBoundingClientRect().left || 0)));
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

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
    const getHeaderTitle = () => {
        if (viewMode === 'week') {
            const start = days[0];
            const end = days[days.length - 1];
            // "Dec 1 - Dec 7, 2025" or "Dec 29, 2025 - Jan 4, 2026" logic
            const startFormat = isSameDay(start, end) ? '' : format(start, 'MMM d');
            const endFormat = format(end, 'MMM d, yyyy');
            return `${startFormat} - ${endFormat}`;
        }
        return format(currentDate, 'MMMM yyyy');
    };

    return (
        <div className="bg-dark-800/30 rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full select-none">
            {/* Header Controls */}
            <div className="p-6 pb-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-white min-w-[200px] whitespace-nowrap">
                            {getHeaderTitle()}
                        </h3>
                        {/* Navigation */}
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
                    {/* Current Date Subtitle */}
                    <div className="text-xs text-gold-500/80 font-medium">
                        Current Date: {format(new Date(), 'EEEE, MMMM do, yyyy')}
                    </div>
                </div>

                <div className="flex bg-dark-900/50 p-1 rounded-xl border border-white/5 mx-auto xl:mx-0">
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

            <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent relative" ref={sidebarRef}>
                <table className="w-full min-w-max border-collapse">
                    <thead>
                        <tr>
                            <th
                                className="sticky left-0 z-20 bg-dark-900/95 backdrop-blur-sm text-left border-b border-white/5 group"
                                style={{ width: sidebarWidth, minWidth: sidebarWidth, maxWidth: sidebarWidth }}
                            >
                                <div className="flex items-center justify-between h-full py-4 px-6 relative">
                                    <span className="text-gray-400 font-medium">Habit</span>
                                    {/* Resizer Handle */}
                                    <div
                                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gold-500/50 active:bg-gold-500 transition-colors z-30 flex items-center justify-center"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            setIsResizing(true);
                                        }}
                                    >
                                        <GripVertical className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
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
                                <td
                                    className="sticky left-0 z-10 bg-dark-900/95 backdrop-blur-sm py-4 px-6 border-r border-white/5 group-hover:bg-dark-800/80 transition-colors"
                                    style={{ width: sidebarWidth, minWidth: sidebarWidth, maxWidth: sidebarWidth }}
                                >
                                    <div
                                        className="cursor-pointer group-hover:text-gold-400 transition-colors flex items-center justify-between overflow-hidden"
                                        onClick={() => onEditHabit?.(habit.id)}
                                    >
                                        <div className="truncate">
                                            <div className="font-medium text-gray-200 truncate" title={habit.name}>{habit.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{habit.category}</div>
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
