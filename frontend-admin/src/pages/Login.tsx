import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Shield, Activity, Fingerprint, Globe, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
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

            if (user.role === 'ADMIN') {
                setError('Admins must use the Admin Login portal.');
                return;
            }

            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch {
            setError('Authentication Failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white dark:bg-[#020617] text-gray-900 dark:text-white font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-500">

            {/* Liquid Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        x: [0, -50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-gradient-to-tr from-purple-600/10 to-pink-500/10 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* Left Side: Identity Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="hidden lg:block space-y-12"
                >
                    <Link to="/" className="inline-flex items-center gap-4 group">
                        <div className="h-14 w-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter uppercase italic dark:text-white text-gray-900">CivicConnect</span>
                    </Link>

                    <h1 className="text-7xl font-black tracking-tighter leading-[0.85] uppercase italic text-gray-900 dark:text-white">
                        Access <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Your Portal.</span>
                    </h1>

                    <div className="space-y-8">
                        {[
                            { icon: Fingerprint, title: 'Secure Access', desc: 'Encrypted login protocol', color: 'text-cyan-500' },
                            { icon: Globe, title: 'Networked', desc: 'Connect to city services', color: 'text-blue-500' },
                            { icon: KeyRound, title: 'Verified', desc: 'Identity protection active', color: 'text-purple-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 group">
                                <div className="h-12 w-12 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                                    <item.icon size={24} className={item.color} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{item.title}</h4>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-1 w-16 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                                    className="h-full w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Glass Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl p-12 shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden">

                            {/* Scanning HUD */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 animate-[scan_5s_linear_infinite]" />
                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500/30 m-4"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500/30 m-4"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500/30 m-4"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500/30 m-4"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-12">
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">Citizen Login</h2>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-2 italic font-bold">Secure Civic Gateway</p>
                                    </div>
                                    <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                        <Activity size={24} className="text-cyan-500 animate-pulse" />
                                    </div>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-8">
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -10, opacity: 0 }}
                                                className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-4"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Email Address</label>
                                        <div className="relative group/input">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-cyan-500 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-gray-100/50 dark:bg-black/60 border border-gray-200 dark:border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-gray-500 text-gray-900 dark:text-white"
                                                placeholder="user@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Password</label>
                                        <div className="relative group/input">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-cyan-500 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-gray-100/50 dark:bg-black/60 border border-gray-200 dark:border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-gray-500 text-gray-900 dark:text-white"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between px-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input type="checkbox" className="peer appearance-none h-5 w-5 border border-gray-200 dark:border-white/10 bg-gray-100/50 dark:bg-black/60 rounded-lg checked:bg-cyan-500 transition-all" />
                                                <div className="absolute pointer-events-none hidden peer-checked:block text-black font-black text-[10px]">✓</div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-cyan-500 transition-colors">Remember Me</span>
                                        </label>
                                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60 hover:text-cyan-500 transition-colors italic">Forgot Password?</a>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group/btn py-6 overflow-hidden rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl shadow-cyan-500/20"
                                    >
                                        <span className="absolute inset-0 bg-gray-900 dark:bg-white group-hover:bg-cyan-500 transition-colors duration-500"></span>
                                        <span className="relative flex items-center justify-center gap-3 text-white dark:text-black">
                                            {loading ? (
                                                <div className="h-4 w-4 border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>Sign In <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-16 text-center pt-10 border-t border-gray-100 dark:border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="text-cyan-500 hover:text-cyan-400 transition-all italic border-b border-cyan-500/30 hover:border-cyan-500 ml-2">
                                            Create Account
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
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

export default Login;
