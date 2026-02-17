import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, User, ArrowRight, Zap, Activity, AlertCircle, Fingerprint, Terminal, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`, { email, password });
            const user = res.data.user;

            if (user.role !== 'ADMIN') {
                setError('ACCESS DENIED: Insufficient Clearance Levels.');
                return;
            }

            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard'); // Corrected navigation path
        } catch {
            setError('VALIDATION FAILED: Invalid Command Credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#020617] text-white font-mono selection:bg-red-500 selection:text-white">

            {/* Tactical Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: [0, 45, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-red-600/30 to-black rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.05, 0.15, 0.05],
                        rotate: [0, -45, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-tr from-gray-900 to-red-900/40 rounded-full blur-[150px]"
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-200"></div>
            </div>

            <div className="relative z-10 w-full max-lg:max-w-md lg:max-w-lg px-6">

                {/* Security Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 space-y-4"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                        <AlertCircle size={14} /> Secure Admin Portal
                    </div>
                </motion.div>

                {/* Login Terminal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                >
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-red-600/20 rounded-3xl blur-2xl group-hover:bg-red-600/30 transition duration-1000"></div>

                        <div className="relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl overflow-hidden">

                            {/* Terminal Border Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/40 m-4"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500/40 m-4"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/40 m-4"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/40 m-4"></div>

                            {/* HUD Scan Line */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/20 animate-[scan_6s_linear_infinite]" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col items-center mb-12">
                                    <div className="h-20 w-20 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.3)] mb-6 rotate-45 group-hover:rotate-[225deg] transition-transform duration-1000">
                                        <Shield className="h-10 w-10 text-white -rotate-45 group-hover:-rotate-[225deg] transition-transform duration-1000" />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
                                        <Terminal size={24} className="text-red-500" />
                                        Administrator
                                    </h2>
                                    <div className="h-1 w-24 bg-red-500/20 rounded-full mt-4 relative overflow-hidden">
                                        <motion.div
                                            animate={{ x: [-100, 100] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 w-1/2 bg-red-500"
                                        />
                                    </div>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-8">
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 20, opacity: 0 }}
                                                className="bg-red-950/40 border-l-4 border-red-600 p-5 text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-4 shadow-lg shadow-red-900/20"
                                            >
                                                <Target size={18} className="animate-pulse" />
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-red-500/60">Admin Email</label>
                                            <span className="text-[8px] text-white/20">Clearance: Level_7</span>
                                        </div>
                                        <div className="relative group/input">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within/input:text-red-500 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-red-950/20 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all placeholder:text-white/10 text-white"
                                                placeholder="ADM_CORE_X12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-red-500/60">Password</label>
                                            <span className="text-[8px] text-white/20">Protocol: RSA_4096</span>
                                        </div>
                                        <div className="relative group/input">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within/input:text-red-500 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-red-950/20 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all placeholder:text-white/10 text-white"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group/btn py-6 overflow-hidden rounded-2xl font-black text-[12px] uppercase tracking-[0.5em] transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl shadow-red-500/20"
                                    >
                                        <span className="absolute inset-0 bg-red-600 group-hover:bg-red-500 transition-colors duration-500"></span>
                                        <span className="relative flex items-center justify-center gap-4 text-white">
                                            {loading ? (
                                                <Activity size={20} className="animate-spin" />
                                            ) : (
                                                <>Access Dashboard <Zap size={18} className="group-hover:scale-125 transition-transform" /></>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-16 flex items-center justify-between pt-10 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
                                    <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                                        <ArrowRight size={14} className="rotate-180" /> Standard Portal
                                    </Link>
                                    <div className="flex gap-4">
                                        <Fingerprint size={16} className="text-red-500/40" />
                                        <Terminal size={16} className="text-red-500/40" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Secure Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-center"
                >
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                        All activities are monitored and logged. <br />
                        Unauthorized access will trigger node isolation.
                    </p>
                </motion.div>
            </div>

            <style>{`
                @keyframes scan {
                    from { transform: translateY(-50%); }
                    to { transform: translateY(150%); }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
