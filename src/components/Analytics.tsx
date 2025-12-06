import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useHabits } from '../context/HabitContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export const Analytics: React.FC = () => {
    const { habits, logs } = useHabits();

    // 1. Completion Trend (Last 30 Days)
    const today = new Date();
    const last30Days = eachDayOfInterval({
        start: subDays(today, 29),
        end: today
    });

    const trendData = last30Days.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLogs = logs[dateStr] || {};
        const completedCount = Object.values(dayLogs).filter(Boolean).length;
        // Percentage of habits completed that day
        const percentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

        return {
            date: format(date, 'MMM dd'),
            completion: percentage
        };
    });

    // 2. Habit Performance (Which habit is most consistent?)
    const performanceData = habits.map(habit => {
        // Calculate total completions in last 30 days
        let total = 0;
        last30Days.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            if (logs[dateStr]?.[habit.id]) total++;
        });

        return {
            name: habit.name,
            total: total
        };
    }).sort((a, b) => b.total - a.total); // Top performers first

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Completion Trend Chart */}
                <div className="bg-dark-800/30 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">30-Day Consistency</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#666"
                                    tick={{ fill: '#666' }}
                                    tickLine={false}
                                    interval={6}
                                />
                                <YAxis
                                    stroke="#666"
                                    tick={{ fill: '#666' }}
                                    tickLine={false}
                                    unit="%"
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                                    itemStyle={{ color: '#EAB308' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="completion"
                                    stroke="#EAB308"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCompletion)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Habit Performance Chart */}
                <div className="bg-dark-800/30 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Top Habits (Last 30 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#666" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={120}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                                />
                                <Bar dataKey="total" fill="#EAB308" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
