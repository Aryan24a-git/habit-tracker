import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { clsx } from 'clsx';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

const STORAGE_KEY_TODOS = 'habit-tracker-todos';

export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_TODOS);
        return stored ? JSON.parse(stored) : [];
    });
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
    }, [todos]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const todo: Todo = {
            id: crypto.randomUUID(),
            text: newTodo.trim(),
            completed: false,
            createdAt: Date.now()
        };

        setTodos([todo, ...todos]);
        setNewTodo('');
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div className="bg-dark-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm h-full flex flex-col hover:border-gold-500/20 transition-all duration-500">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-gold-500" />
                Quick Tasks
            </h3>

            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a task..."
                    className="flex-1 bg-dark-900/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
                />
                <button
                    type="submit"
                    disabled={!newTodo.trim()}
                    className="bg-gold-500 text-dark-950 p-2.5 rounded-xl hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-dark-700 min-h-[200px] max-h-[300px]">
                {todos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-2">
                        <div className="w-12 h-12 rounded-full bg-dark-700/50 flex items-center justify-center">
                            <CheckSquare className="w-6 h-6 opacity-50" />
                        </div>
                        <p>No tasks yet. Add one!</p>
                    </div>
                ) : (
                    todos.map(todo => (
                        <div
                            key={todo.id}
                            className="group flex items-center gap-3 p-3 rounded-xl bg-dark-700/30 hover:bg-dark-700/50 border border-transparent hover:border-white/5 transition-all"
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className={clsx(
                                    "flex-shrink-0 transition-colors",
                                    todo.completed ? "text-green-500" : "text-gray-500 hover:text-gold-500"
                                )}
                            >
                                {todo.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                            </button>

                            <span className={clsx(
                                "flex-1 text-sm transition-all break-all",
                                todo.completed ? "text-gray-500 line-through" : "text-gray-200"
                            )}>
                                {todo.text}
                            </span>

                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
