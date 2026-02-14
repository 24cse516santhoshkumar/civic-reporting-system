import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Lock, ArrowRight, ShieldCheck, Cpu, Terminal } from 'lucide-react';
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
            const res = await axios.post('http://localhost:3000/auth/login', { email, password });
            const user = res.data.user;

            if (user.role !== 'ADMIN') {
                setError('PERMISSION DENIED: UNPRIVILEGED IDENTITY DETECTED.');
                return;
            }

            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError('AUTHENTICATION FAILURE: INVALID COMMAND CORE CREDENTIALS.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#050000] text-red-50 font-sans selection:bg-red-600 selection:text-white">

            {/* Serious Background Grid */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg px-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1 border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 italic">
                        <Terminal size={12} />
                        Level 4 Security Clearance Required
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="relative group">
                        {/* Red glow effect */}
                        <div className="absolute -inset-1 bg-red-600/20 blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                        <div className="relative bg-black/80 backdrop-blur-3xl border border-red-900/30 rounded-sm p-10 shadow-[0_0_50px_rgba(255,0,0,0.1)] overflow-hidden">

                            {/* Warning Strip */}
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600/50"></div>

                            {/* Scanning Line (Aggressive) */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/40 animate-[scan_2s_linear_infinite]" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col items-center mb-10">
                                    <div className="h-16 w-16 bg-red-600/10 border border-red-600/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                                        <ShieldAlert className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white text-center">Command Core <br /> <span className="text-red-600">Authentication</span></h2>
                                    <p className="text-[10px] font-mono text-red-900 uppercase tracking-[0.2em] mt-3 italic text-center font-black">Authorized personnel only // monitor_active:true</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-red-600 border-l-4 border-white p-4 text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-3"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-white animate-ping"></div>
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-red-900 ml-1">Admin Identity Key</label>
                                        <div className="relative group/input">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-red-950/20 border border-red-900/30 rounded-sm py-4 px-4 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-red-900/40 text-red-100"
                                                placeholder="admin_id_vector@civic.auth"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-red-900 ml-1">Access Protocol Pass</label>
                                        <div className="relative group/input">
                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-900/40 group-focus-within/input:text-red-600 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-red-950/20 border border-red-900/30 rounded-sm py-4 px-4 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-red-900/40 text-red-100"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group/btn py-5 overflow-hidden rounded-sm font-black text-xs uppercase tracking-[0.4em] transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4"
                                    >
                                        <span className="absolute inset-0 bg-red-600 group-hover:bg-red-500"></span>
                                        <span className="relative flex items-center justify-center gap-3 text-white">
                                            {loading ? (
                                                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>Elevate Privileges <ArrowRight size={16} /></>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-12 grid grid-cols-2 gap-px bg-red-900/20 border border-red-900/30">
                                    <div className="p-4 flex flex-col items-center">
                                        <Cpu size={14} className="text-red-900 mb-2" />
                                        <span className="text-[8px] font-mono text-red-900 uppercase">Vector Sync: 100%</span>
                                    </div>
                                    <div className="p-4 flex flex-col items-center border-l border-red-900/30">
                                        <ShieldCheck size={14} className="text-red-900 mb-2" />
                                        <span className="text-[8px] font-mono text-red-900 uppercase">Kernel Auth: Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-red-900 hover:text-red-600 transition-colors italic">
                        ← Terminate Admin Session / Return to Citizen Mesh
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    from { transform: translateY(-30%); }
                    to { transform: translateY(130%); }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
