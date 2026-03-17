import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { login, register, reset } from '../redux/authSlice';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (location.state?.initialMode === 'signup') {
            setIsLogin(false);
        } else if (location.state?.initialMode === 'login') {
            setIsLogin(true);
        }
    }, [location.state]);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }

    }, [user, isError, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission started. Mode:', isLogin ? 'Login' : 'Signup');
        console.log('Form data:', { email, password: '***' });

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            if (isLogin) {
                console.log('Dispatching login...');
                const result = await dispatch(login({ email, password })).unwrap();
                console.log('Login successful, result:', result);
            } else {
                console.log('Dispatching register...');
                const result = await dispatch(register({ email, password })).unwrap();
                console.log('Signup successful, result:', result);
            }
            // Explicit navigation on success
            console.log('Navigating to /workspace with replace...');
            navigate('/workspace', { replace: true });
        } catch (err) {
            console.error('Submission failed with error:', err);
            // Error is handled by state and useEffect
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="bg-mesh"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[380px] w-full glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 relative z-10 shadow-2xl border-white/5"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 text-white mb-4 transform hover:rotate-12 transition-all">
                        {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight italic" style={{ color: 'var(--text-accent)' }}>
                        {isLogin ? 'Hello Again.' : 'Sign Up.'}
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-50" style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? 'Access your workspace' : 'Create professional account'}
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: 'var(--text-accent)' }}>Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Email address"
                                className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-black/40 border border-white/5 focus:border-indigo-500/50 outline-none transition-all font-bold text-base shadow-sm focus:shadow-md placeholder:text-slate-600"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: 'var(--text-accent)' }}>Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="Password"
                                className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-black/40 border border-white/5 focus:border-indigo-500/50 outline-none transition-all font-bold text-base shadow-sm focus:shadow-md placeholder:text-slate-600"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                                <ArrowRight className="w-5 h-5 stroke-[3px]" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-indigo-600 hover:text-indigo-500 font-black underline underline-offset-4"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
