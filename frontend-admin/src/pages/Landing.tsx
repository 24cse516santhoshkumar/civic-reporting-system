import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Users, CheckCircle, Moon, Sun, Zap, MousePointer2, Truck, Trash2, AlertTriangle, Box, Layers } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
    const { theme, toggleTheme } = useTheme();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const stats = [
        { label: 'Reports Filed', value: '2,840', icon: Shield, color: 'text-cyan-400' },
        { label: 'Resolutions', value: '94%', icon: CheckCircle, color: 'text-emerald-400' },
        { label: 'Active Citizens', value: '1,200+', icon: Users, color: 'text-purple-400' },
        { label: 'Avg Response', value: '< 4h', icon: Zap, color: 'text-amber-400' },
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-[#020617] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 selection:bg-cyan-500 selection:text-black">

            {/* Premium Liquid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-tr from-purple-600/10 to-pink-500/10 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Glass Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-3xl transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex justify-between h-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-3 group cursor-pointer"
                        >
                            <div className="h-11 w-11 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:rotate-[10deg] transition-transform duration-500">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">CivicConnect</span>
                        </motion.div>

                        <div className="hidden md:flex items-center space-x-12">
                            <Link to="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-cyan-400 transition-all hover:tracking-[0.3em]">About System</Link>
                            <Link to="/admin/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-cyan-400 transition-all hover:tracking-[0.3em]">Admin Portal</Link>
                        </div>

                        <div className="flex items-center space-x-6">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <Link to="/signup" className="group relative px-8 py-3 rounded-full overflow-hidden font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 active:scale-95">
                                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-gradient-xy"></span>
                                <span className="relative flex items-center gap-2 text-white">
                                    Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10">
                {/* Hero Section */}
                <header className="relative pt-48 pb-32 lg:pt-64 lg:pb-48">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="flex flex-col items-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-500 dark:text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                System Operational • Live Reporting
                            </motion.div>

                            <motion.div style={{ y: y1, opacity }}>
                                <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter mb-10 leading-[0.85] text-gray-900 dark:text-white uppercase italic">
                                    Civic <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Reporting.</span>
                                </h1>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="max-w-2xl text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-16 px-4"
                            >
                                Empowering citizens with a high-speed, transparent interface for municipal issue tracking. Report hazards. Track resolutions. Improve your city.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-xl"
                            >
                                <Link to="/signup" className="flex-1 px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] transform transition-all hover:scale-105 shadow-2xl hover:shadow-cyan-500/20 text-xs">
                                    Report Issue
                                </Link>
                                <Link to="/login" className="flex-1 px-10 py-5 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-black uppercase tracking-[0.2em] hover:bg-white/80 dark:hover:bg-white/10 transition-all text-xs">
                                    View Dashboard
                                </Link>
                            </motion.div>
                        </div>

                        {/* Tactical Frame */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 1.2, ease: "circOut" }}
                            className="mt-32 relative mx-auto max-w-6xl group"
                        >
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-[#020617] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                                <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-6 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="px-6 py-1 bg-black/60 rounded-full text-[9px] font-mono text-cyan-500/60 uppercase tracking-[0.3em] border border-cyan-500/20">
                                            CIVIC_CONNECT_V4.0_PUBLIC
                                        </div>
                                    </div>
                                    <MousePointer2 size={14} className="text-gray-600" />
                                </div>
                                <div className="aspect-video relative overflow-hidden group">
                                    <img
                                        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2613&ixlib=rb-4.0.3"
                                        alt="City Dashboard"
                                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>

                                    {/* Liquid HUD Elements */}
                                    <div className="absolute top-10 left-10 p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl border-l-4 border-l-cyan-500">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2">Live Incident Map</h4>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div animate={{ x: [-128, 128] }} transition={{ duration: 2, repeat: Infinity }} className="h-full w-full bg-cyan-500" />
                                            </div>
                                            <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div animate={{ x: [-96, 96] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full w-full bg-blue-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* Glass Metrics Strip */}
                <section className="py-20 relative px-6 group">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white/40 dark:bg-white/[0.02] backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[3rem] p-12 shadow-2xl group-hover:border-cyan-500/30 transition-all duration-500">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                                {stats.map((stat, i) => (
                                    <div key={i} className="flex flex-col items-center lg:items-start group/stat">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 group-hover/stat:rotate-[15deg] group-hover/stat:scale-110 transition-all duration-500">
                                                <stat.icon size={20} className={stat.color} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
                                        </div>
                                        <div className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Operations Grid */}
                <section className="py-40 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
                            <div className="max-w-2xl">
                                <motion.span className="text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block italic">Service Categories</motion.span>
                                <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic leading-[0.9]">
                                    Community <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Services.</span>
                                </h2>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-sm">
                                Specialized reporting channels for every aspect of city infrastructure and public welfare.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Truck, title: 'Transport', desc: 'Potholes, signal failures, and obstruction reporting.', color: 'from-blue-500 to-cyan-400', iconColor: 'text-cyan-400' },
                                { icon: Trash2, title: 'Sanitation', desc: 'Garbage collection delays and waste management issues.', color: 'from-emerald-500 to-teal-400', iconColor: 'text-emerald-400' },
                                { icon: Zap, title: 'Utilities', desc: 'Power outages, water leaks, and street light failures.', color: 'from-amber-500 to-orange-400', iconColor: 'text-amber-400' },
                                { icon: AlertTriangle, title: 'Public Safety', desc: 'Hazards, vandalism, and community safety concerns.', color: 'from-purple-500 to-pink-400', iconColor: 'text-red-400' },
                            ].map((item, idx) => (
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    key={idx}
                                    className="relative group/card"
                                >
                                    <div className={`absolute - inset - px rounded - 3xl bg - gradient - to - br ${item.color} opacity - 0 group - hover / card: opacity - 10 dark: group - hover / card: opacity - 20 transition - all duration - 500`}></div>
                                    <div className="bg-white/80 dark:bg-white/[0.01] backdrop-blur-xl p-10 rounded-3xl border border-gray-200 dark:border-white/5 group-hover/card:border-white/20 transition-all duration-500 shadow-xl dark:shadow-none h-full flex flex-col">
                                        <div className={`mb - 8 p - 4 rounded - 2xl bg - gray - 100 dark: bg - white / 5 border border - white / 5 w - fit ${item.iconColor} group - hover / card: scale - 110 transition - transform duration - 500`}>
                                            <item.icon size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter italic">{item.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-auto font-medium">{item.desc}</p>
                                        <div className="mt-8 pt-8 border-t border-white/5">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-500 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                File Report <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-64 relative flex flex-col items-center text-center px-6 overflow-hidden">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 z-0 bg-gray-900 pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"></div>
                    </motion.div>

                    <div className="relative z-10 max-w-4xl">
                        <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter text-white uppercase italic leading-[0.85] mb-12">
                            Infrastructure <br /> <span className="text-cyan-400">Evolution.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-400 font-medium mb-20 leading-relaxed px-4">
                            We don't just fix problems; we upgrade the entire connection between citizens and their city. Join the network.
                        </p>
                        <Link to="/signup" className="group relative inline-flex items-center gap-6 px-12 py-6 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all rounded-full text-sm">
                            Initialize Link <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                        </Link>
                    </div>
                </section>
            </main>

            {/* Tactical Glass Footer */}
            <footer className="relative bg-white dark:bg-[#020617] py-24 border-t border-gray-200 dark:border-white/10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
                        <div className="col-span-1 md:col-span-2 space-y-10">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-2xl">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase">CivicConnect</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-sm leading-relaxed">
                                A modern urban reporting platform built for active citizenship. Secure. Transparent. Effective.
                            </p>
                        </div>
                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/80">Platform</h4>
                            <ul className="space-y-6 text-xs font-black text-gray-400">
                                <li><Link to="/about" className="hover:text-cyan-400 transition-all uppercase tracking-widest block">About System</Link></li>
                                <li><Link to="/admin/login" className="hover:text-cyan-400 transition-all uppercase tracking-widest block">Admin Portal</Link></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-all uppercase tracking-widest block">User Guide</a></li>
                            </ul>
                        </div>
                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/80">Legal</h4>
                            <ul className="space-y-6 text-xs font-black text-gray-400">
                                <li><a href="#" className="hover:text-cyan-400 transition-all uppercase tracking-widest block">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-all uppercase tracking-widest block">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-all uppercase tracking-widest block">Accessibility</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100 dark:border-white/5 gap-8">
                        <div className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.4em]">
                            &copy; 2026 civic_connect_system // all_rights_reserved
                        </div>
                        <div className="flex gap-4">
                            <div className="p-2 border border-white/5 rounded-lg bg-white/5 hover:border-cyan-500/50 transition-colors cursor-pointer"><Box size={14} className="text-gray-600" /></div>
                            <div className="p-2 border border-white/5 rounded-lg bg-white/5 hover:border-blue-500/50 transition-colors cursor-pointer"><Layers size={14} className="text-gray-600" /></div>
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
@keyframes scan {
                    from { transform: translateY(-100 %); }
                    to { transform: translateY(110vh); }
}
                .animate - gradient - xy {
    background - size: 400 % 400 %;
    animation: gradient - xy 15s ease infinite;
}
@keyframes gradient - xy {
    0 % { background- position: 0 % 50 %;
}
50 % { background- position: 100 % 50 %; }
100 % { background- position: 0 % 50 %; }
                }
`}</style>
        </div>
    );
};

export default Landing;
