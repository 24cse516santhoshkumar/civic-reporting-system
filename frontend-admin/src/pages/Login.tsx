import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Shield, Activity, Fingerprint, Globe } from 'lucide-react';
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
        } catch (err: any) {
            setError('Authentication Failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#020617] text-white font-sans selection:bg-cyan-500 selection:text-black">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Branding / Identity */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block space-y-8"
                >
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                            <Shield className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">CivicConnect</span>
                    </Link>

                    <h1 className="text-6xl font-black tracking-tighter leading-[0.9] uppercase italic">
                        Initialize <br />
                        <span className="text-cyan-500">Citizen Uplink.</span>
                    </h1>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-gray-400 group">
                            <div className="h-10 w-10 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                                <Fingerprint size={20} className="text-cyan-500" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-white">Encryption Protocol</h4>
                                <p className="text-[10px] font-mono opacity-60 uppercase">AES-256 Multi-layer Identity Masking</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400 group">
                            <div className="h-10 w-10 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                                <Globe size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-white">Global Mesh</h4>
                                <p className="text-[10px] font-mono opacity-60 uppercase">Decentralized City Response Infrastructure</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ x: ['100%', '-100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                    className="h-full w-full bg-cyan-500/40"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-sm p-10 shadow-2xl overflow-hidden">

                            {/* Scanning Line */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 animate-[scan_4s_linear_infinite]" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-10">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Access Console</h2>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mt-1 italic">Identify yourself to the core</p>
                                    </div>
                                    <Activity size={24} className="text-cyan-500 animate-pulse" />
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-red-500/10 border border-red-500/20 p-4 text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-3"
                                            >
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Identity Tag (Email)</label>
                                        <div className="relative group/input">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700"
                                                placeholder="user@mesh.system"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Access Key (Password)</label>
                                        <div className="relative group/input">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input type="checkbox" className="peer appearance-none h-4 w-4 border border-white/10 bg-black/40 checked:bg-cyan-500 transition-all" />
                                                <div className="absolute pointer-events-none hidden peer-checked:block text-black font-black text-[10px]">✓</div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors">Maintain Link</span>
                                        </label>
                                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60 hover:text-cyan-400 transition-colors italic">Key Recovery</a>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group/btn py-5 overflow-hidden rounded-sm font-black text-xs uppercase tracking-[0.3em] transition-all transform active:scale-95 disabled:opacity-50"
                                    >
                                        <span className="absolute inset-0 bg-white group-hover:bg-cyan-400"></span>
                                        <span className="relative flex items-center justify-center gap-3 text-black">
                                            {loading ? (
                                                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                            ) : (
                                                <>Authorize Session <ArrowRight size={16} /></>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-12 text-center pt-8 border-t border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        No Identity on Mesh?{' '}
                                        <Link to="/signup" className="text-cyan-500 hover:text-cyan-400 transition-colors italic">
                                            Initialize New Link
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
                    from { transform: translateY(-30%); }
                    to { transform: translateY(130%); }
                }
            `}</style>
        </div>
    );
};

export default Login;
