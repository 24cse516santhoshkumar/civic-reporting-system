import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowRight, Shield, Activity, UserPlus, Fingerprint, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Key mismatch: Passwords do not align');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/register', {
                email,
                password,
                phone
            });
            alert('Identity Protocol Initialized! Proceed to Authentication.');
            navigate('/login');
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error && (err.message === 'Network Error')) {
                const demoUser = { email, phone, role: 'CITIZEN', id: 'demo-new-user-' + Date.now() };
                localStorage.setItem('demo_pending_user', JSON.stringify({ ...demoUser, password }));
                alert('(Demo Mode) Offline Identity Created. Authorized for Login.');
                navigate('/login');
            } else {
                setError('Registration failed. Identity Conflict.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white dark:bg-[#020617] text-gray-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white transition-colors duration-500">

            {/* Liquid Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-tr from-cyan-600/10 to-emerald-500/10 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* Left Side: Signup Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="order-2 lg:order-1"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl p-12 shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden">

                            {/* Scanning HUD */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/20 animate-[scan_5s_linear_infinite]" />
                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500/30 m-4"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500/30 m-4"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500/30 m-4"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-500/30 m-4"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">Create Account</h2>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-2 italic font-bold">New Citizen Registration</p>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                        <UserPlus size={24} className="text-blue-500 animate-pulse" />
                                    </div>
                                </div>

                                <form onSubmit={handleSignup} className="space-y-6">
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
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-gray-100/50 dark:bg-black/60 border border-gray-200 dark:border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-500 text-gray-900 dark:text-white"
                                                placeholder="user@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Phone Number</label>
                                        <div className="relative group/input">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" />
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-gray-100/50 dark:bg-black/60 border border-gray-200 dark:border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-500 text-gray-900 dark:text-white"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-gray-100/50 dark:bg-black/60 border border-gray-200 dark:border-white/5 rounded-2xl py-4.5 px-6 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-500 text-gray-900 dark:text-white"
                                                placeholder="••••••"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-gray-100/50 dark:bg-black/60 border border-gray-200 dark:border-white/5 rounded-2xl py-4.5 px-6 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-500 text-gray-900 dark:text-white"
                                                placeholder="••••••"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group/btn py-6 overflow-hidden rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-500/20"
                                    >
                                        <span className="absolute inset-0 bg-gray-900 dark:bg-white group-hover:bg-blue-500 transition-colors duration-500"></span>
                                        <span className="relative flex items-center justify-center gap-3 text-white dark:text-black">
                                            {loading ? (
                                                <div className="h-4 w-4 border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>Sign Up <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-12 text-center pt-10 border-t border-gray-100 dark:border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        Already registered?{' '}
                                        <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-all italic border-b border-blue-500/30 hover:border-blue-500 ml-2">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Branding Space */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="order-1 lg:order-2 space-y-12"
                >
                    <Link to="/" className="inline-flex items-center gap-4 group">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic dark:text-white text-gray-900">CivicConnect</span>
                    </Link>

                    <h1 className="text-7xl font-black tracking-tighter leading-[0.85] uppercase italic text-gray-900 dark:text-white">
                        Join The <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Network.</span>
                    </h1>

                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-sm">
                        Create an account to report issues, track resolutions, and contribute to your community's well-being.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { label: 'Priority', desc: 'Secure Logging', icon: Activity, color: 'text-blue-500' },
                            { label: 'Tracking', desc: 'Real-time Updates', icon: Lock, color: 'text-purple-500' },
                            { label: 'Privacy', desc: 'Encrypted Data', icon: Fingerprint, color: 'text-cyan-500' },
                            { label: 'Impact', desc: 'Community Wide', icon: Globe, color: 'text-emerald-500' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all duration-500">
                                <stat.icon size={24} className={`${stat.color} mb-4 group-hover:scale-110 transition-transform`} />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">{stat.label}</h4>
                                <p className="text-[9px] font-mono text-gray-500 uppercase mt-2 tracking-widest">{stat.desc}</p>
                            </div>
                        ))}
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

export default Signup;
