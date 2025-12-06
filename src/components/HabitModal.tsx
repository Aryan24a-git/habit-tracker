import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import type { Category } from '../types';

interface HabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    editHabitId?: string | null;
}

const CATEGORIES: Category[] = ['Health', 'Mindset', 'Productivity', 'Discipline', 'General'];

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, editHabitId }) => {
    const { habits, addHabit, updateHabit, deleteHabit } = useHabits();

    const [name, setName] = useState('');
    const [category, setCategory] = useState<Category>('General');
    const [goal, setGoal] = useState(1);

    useEffect(() => {
        if (editHabitId) {
            const habit = habits.find(h => h.id === editHabitId);
            if (habit) {
                setName(habit.name);
                setCategory(habit.category);
                setGoal(habit.goal);
            }
        } else {
            setName('');
            setCategory('General');
            setGoal(1);
        }
    }, [editHabitId, habits, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (editHabitId) {
            updateHabit(editHabitId, { name, category, goal });
        } else {
            addHabit({ name, category, goal });
        }
        onClose();
    };

    const handleDelete = () => {
        if (editHabitId && confirm('Delete this habit?')) {
            deleteHabit(editHabitId);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    {editHabitId ? 'Edit Habit' : 'New Habit'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Habit Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                            placeholder="e.g. Morning Meditation"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${category === cat
                                            ? 'bg-gold-500 text-dark-950 font-medium'
                                            : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        {editHabitId && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex items-center justify-center px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            type="submit"
                            className="flex-1 bg-gold-500 text-dark-950 font-bold rounded-xl px-4 py-3 hover:bg-gold-400 transition-colors"
                        >
                            {editHabitId ? 'Save Changes' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
