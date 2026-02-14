import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowRight, Shield, Activity, UserPlus } from 'lucide-react';
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
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message === 'Network Error' || !err.response) {
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
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#020617] text-white font-sans selection:bg-cyan-500 selection:text-black">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Signup Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="order-2 lg:order-1"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-sm p-10 shadow-2xl overflow-hidden">

                            {/* Scanning Line */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/20 animate-[scan_4s_linear_infinite]" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-10">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Initialize Link</h2>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mt-1 italic">Register new identity on the mesh</p>
                                    </div>
                                    <UserPlus size={24} className="text-blue-500 animate-pulse" />
                                </div>

                                <form onSubmit={handleSignup} className="space-y-5">
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
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-gray-700"
                                                placeholder="citizen@mesh.system"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Comm Link (Phone)</label>
                                        <div className="relative group/input">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-gray-700"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Access Key</label>
                                            <div className="relative group/input">
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 px-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-gray-700"
                                                    placeholder="••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Verify Key</label>
                                            <div className="relative group/input">
                                                <input
                                                    type="password"
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 px-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-gray-700"
                                                    placeholder="••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group/btn py-5 overflow-hidden rounded-sm font-black text-xs uppercase tracking-[0.3em] transition-all transform active:scale-95 disabled:opacity-50 mt-4"
                                    >
                                        <span className="absolute inset-0 bg-white group-hover:bg-blue-400"></span>
                                        <span className="relative flex items-center justify-center gap-3 text-black">
                                            {loading ? (
                                                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                            ) : (
                                                <>Initialize Identity <ArrowRight size={16} /></>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-10 text-center pt-8 border-t border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        Already linked to Mesh?{' '}
                                        <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors italic">
                                            Authenticate Now
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Branding / Benefits */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="order-1 lg:order-2 space-y-8"
                >
                    <Link to="/" className="inline-flex lg:hidden items-center gap-3 group mb-8">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">CivicConnect</span>
                    </Link>

                    <h1 className="text-6xl font-black tracking-tighter leading-[0.9] uppercase italic">
                        The Future <br />
                        <span className="text-blue-500">Starts Here.</span>
                    </h1>

                    <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
                        Synchronize your reports with the city command core. Direct real-time impact on urban health.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Priority', desc: 'Accelerated Tasking', icon: Activity },
                            { label: 'Tracking', desc: 'Secure Ledger', icon: Lock },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-blue-500/30 transition-all">
                                <stat.icon size={20} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{stat.label}</h4>
                                <p className="text-[9px] font-mono text-gray-600 uppercase mt-1">{stat.desc}</p>
                            </div>
                        ))}
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

export default Signup;
