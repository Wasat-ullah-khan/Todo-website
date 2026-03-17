import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Plus, ListTodo, LogOut, User, Loader2, CheckCircle, Calendar, Edit3, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchTodos, addTodo, toggleTodo, removeTodo } from './redux/todoSlice';
import { logout } from './redux/authSlice';
import TodoItem from './components/TodoItem';
import ProgressDashboard from './components/ProgressDashboard';
import Auth from './pages/Auth';
import Landing from './pages/Landing';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

function TodoWorkspace() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: todos, status } = useSelector((state) => state.todos);
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Title is required');

    dispatch(addTodo({ title, description, dueDate: dueDate || null }));
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  const filteredTodos = todos; // No search filter applied

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 transition-colors duration-500 relative">
      <div className="bg-mesh"></div>
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto relative z-10 px-0 sm:px-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-6 sm:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-5"
          >
            <div className="p-3 sm:p-4 bg-indigo-600 rounded-2xl sm:rounded-3xl shadow-2xl shadow-indigo-500/40 text-white transform hover:rotate-12 transition-all duration-500 cursor-pointer">
              <ListTodo className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                Todo<span style={{ color: 'var(--text-accent)' }}>.</span>
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className="h-[1px] w-8 bg-indigo-500/50"></div>
                <p className="text-[10px] sm:text-xs font-black opacity-60 uppercase tracking-[0.4em]" style={{ color: 'var(--text-muted)' }}>Workspace</p>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {user && (
              <div className="flex items-center space-x-3 px-3 py-2 sm:px-4 sm:py-2 glass-card rounded-xl sm:rounded-2xl">
                <div className="p-1.5 sm:p-2 bg-indigo-500/10 rounded-lg sm:rounded-xl">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold truncate max-w-[100px] sm:max-w-none" style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-3 sm:p-4 glass-card rounded-2xl sm:rounded-3xl text-red-500 hover:bg-red-500 hover:text-white transition-all border border-slate-200 dark:border-white/10"
              title="Logout"
            >
              <LogOut className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Task Creation */}
          <div className="lg:col-span-5 space-y-8">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleAddTodo}
              className="glass-card rounded-[2.5rem] p-6 lg:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative group overflow-hidden border border-white/10"
            >
              <div className="absolute inset-x-0 -top-px h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="space-y-7">
                <div className="space-y-2.5">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] ml-2 flex items-center space-x-2" style={{ color: 'var(--text-accent)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Task Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-slate-300 dark:border-white/5 focus:border-indigo-500 outline-none transition-all font-bold text-base shadow-sm focus:shadow-md"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] ml-2 flex items-center space-x-2" style={{ color: 'var(--text-accent)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Description</span>
                  </label>
                  <textarea
                    placeholder="Context..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 focus:border-indigo-500/50 outline-none transition-all font-medium resize-none h-28 shadow-inner focus:shadow-md"
                    style={{ color: 'var(--text-primary)' }}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] ml-2 flex items-center space-x-2" style={{ color: 'var(--text-accent)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>Due Date</span>
                    </label>
                    <div className="relative group/input">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors pointer-events-none" />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 focus:border-indigo-500/50 outline-none transition-all font-bold text-sm shadow-inner"
                        style={{ color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black rounded-2xl shadow-[0_10px_20px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.2em] text-xs h-[52px]"
                  >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    <span>Create Task</span>
                  </button>
                </div>
              </div>
            </motion.form>
          </div>

          {/* Right Column: List & Dashboard */}
          <div className="lg:col-span-7 space-y-12">
            <ProgressDashboard todos={todos} status={status} />

            <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 gap-6 pt-10 mt-6 border-t border-white/5">
              <div className="flex items-center space-x-5">
                <h2 className="text-2xl lg:text-4xl font-black italic tracking-tighter bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent">
                  Tasks
                </h2>
                <div className="px-5 py-2 bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                    {todos.length} Active
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {status === 'loading' ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-400">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p className="font-medium">Loading tasks...</p>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="text-center py-20 text-slate-400 glass-card rounded-2xl border-dashed">
                  <p className="text-lg">No tasks yet.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredTodos.map(todo => (
                    <TodoItem
                      key={todo._id}
                      todo={todo}
                      onToggle={(t) => dispatch(toggleTodo(t))}
                      onDelete={(id) => dispatch(removeTodo(id))}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <TodoWorkspace />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
