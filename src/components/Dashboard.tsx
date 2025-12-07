import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { Flame, CheckCircle2, TrendingUp, Plus } from 'lucide-react';
import { HabitGrid } from './HabitGrid';
import { HabitModal } from './HabitModal';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Dashboard: React.FC = () => {
  const { habits, logs } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHabitId, setEditHabitId] = useState<string | null>(null);

  // Basic stats calculation
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLogs = logs[todayStr] || {};

  // Prepare Pie Data
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => todayLogs[h.id]);
  const pendingCount = totalHabits - completedHabits.length;

  const COLORS = [
    '#F472B6', // Pink
    '#38BDF8', // Light Blue
    '#34D399', // Emerald
    '#A78BFA', // Violet
    '#FBBF24', // Amber
    '#FB7185', // Rose
    '#22D3EE', // Cyan
  ];

  const pieData = [
    ...completedHabits.map((h, index) => ({
      name: h.name,
      value: 1, // Equal weight
      color: COLORS[index % COLORS.length]
    })),
    ...(pendingCount > 0 ? [{
      name: 'Pending Tasks',
      value: pendingCount,
      color: '#374151' // Dark Gray
    }] : [])
  ];

  const completedToday = completedHabits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleOpenNew = () => {
    setEditHabitId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditHabitId(id);
    setIsModalOpen(true);
  };

  // Animation classes
  const cardClass = "bg-dark-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm transition-all duration-500 hover:border-gold-500/20 hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.1)]";

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index: _ }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Let's keep the momentum going</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-gold-500 text-dark-950 font-bold px-6 py-3 rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>New Habit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {/* Stats Column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={cardClass}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                <Flame className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-sm text-gray-500">Current Day Streak</div>
          </div>

          <div className={cardClass}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{completedToday} / {totalHabits}</div>
            <div className="text-sm text-gray-500">Habits Completed Today</div>
          </div>

          <div className={cardClass}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{completionRate}%</div>
            <div className="text-sm text-gray-500">Daily Completion Rate</div>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className={`${cardClass} flex flex-col items-center justify-center min-h-[300px]`}>
          <h3 className="text-lg font-bold text-white mb-4 self-start">Daily Productivity Breakdown</h3>
          <div className="w-full h-[200px]">
            {totalHabits > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No habits to show
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Habit Grid */}
      <HabitGrid onEditHabit={handleEdit} />

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editHabitId={editHabitId}
      />
    </div>
  );
};
