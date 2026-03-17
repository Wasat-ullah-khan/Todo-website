import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckCircle2, Circle, Trash2, Edit3, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateTodoThunk } from '../redux/todoSlice';
import confetti from 'canvas-confetti';
import { Calendar } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const TodoItem = ({ todo, onToggle, onDelete }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDescription, setEditDescription] = useState(todo.description || '');
    const [editDueDate, setEditDueDate] = useState(todo.dueDate ? todo.dueDate.split('T')[0] : '');

    const handleToggle = () => {
        if (!todo.completed) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4f46e5', '#818cf8', '#ffffff']
            });
        }
        onToggle(todo);
    };

    const handleSave = () => {
        if (!editTitle.trim()) return;
        dispatch(updateTodoThunk({
            id: todo._id,
            updates: { title: editTitle, description: editDescription, dueDate: editDueDate || null }
        }));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setEditDescription(todo.description || '');
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-6 mb-3 glass-card rounded-[2.2rem] shadow-xl hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.6)] transition-all duration-500 group border border-white/15 relative overflow-hidden ${isEditing ? 'ring-2 ring-indigo-500/50 shadow-indigo-500/20' : 'hover:-translate-y-1.5'}`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 ${todo.completed ? 'bg-emerald-500 shadow-[2px_0_15px_rgba(16,185,129,0.5)]' : 'bg-indigo-500 shadow-[2px_0_15px_rgba(79,70,229,0.5)]'}`}></div>
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div
                        key="editing"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-3"
                    >
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/60 border border-indigo-500 outline-none text-slate-950 dark:text-white font-bold shadow-sm"
                            placeholder="Title"
                            autoFocus
                        />
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-blue-500/30 outline-none text-slate-800 dark:text-slate-200 text-sm resize-none h-20"
                            placeholder="Description"
                        />
                        <div className="flex items-center space-x-2 px-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className="bg-transparent text-xs font-bold outline-none text-indigo-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCancel}
                                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleSave}
                                className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-1 px-3"
                            >
                                <Check className="w-5 h-5" />
                                <span className="font-bold text-sm">Save</span>
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="viewing"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4 flex-1">
                            <button
                                onClick={handleToggle}
                                className="focus:outline-none transition-transform active:scale-90 relative"
                            >
                                {todo.completed ? (
                                    <div className="relative">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            className="absolute inset-0 bg-emerald-500 rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <Circle className="w-8 h-8 text-slate-500/50 group-hover:text-indigo-500 transition-all duration-300" />
                                )}
                            </button>
                            <div className={`${todo.completed ? 'opacity-40 grayscale-[0.5]' : ''} flex-1`}>
                                <h3 className={`font-black text-xl transition-all ${todo.completed ? 'opacity-30 line-through' : ''}`} style={{ color: 'var(--text-primary)' }}>
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p className={`text-sm font-bold transition-all ${todo.completed ? 'opacity-30' : ''} line-clamp-2 mt-1`} style={{ color: 'var(--text-secondary)' }}>{todo.description}</p>
                                )}
                                {todo.dueDate && !todo.completed && (
                                    <div className={`flex items-center space-x-1.5 mt-2 text-[10px] font-black uppercase tracking-wider ${isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate)) ? 'text-red-500' : 'text-indigo-500/70'}`}>
                                        <Calendar className="w-3 h-3" />
                                        <span>{isToday(new Date(todo.dueDate)) ? 'Due Today' : format(new Date(todo.dueDate), 'MMM dd, yyyy')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-indigo-500/20"
                                title="Edit Task"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onDelete(todo._id)}
                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-500/20"
                                title="Delete Task"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TodoItem;
