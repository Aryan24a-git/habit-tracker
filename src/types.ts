export type Category = 'Health' | 'Mindset' | 'Productivity' | 'Discipline' | 'General';

export interface Habit {
    id: string;
    name: string;
    category: Category;
    goal: number; // e.g. target completions per week or just daily goal=1
    streak: number;
    completedTotal: number;
    createdAt: string; // ISO date
}

export interface HabitLog {
    [date: string]: { // key: "YYYY-MM-DD"
        [habitId: string]: boolean;
    };
}

export interface HabitContextType {
    habits: Habit[];
    logs: HabitLog;
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedTotal' | 'createdAt'>) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    deleteHabit: (id: string) => void;
    toggleHabit: (id: string, date: string) => void;
    resetProgress: () => void;
    getCompletionPercentage: (habitId: string, range?: number) => number;
}
