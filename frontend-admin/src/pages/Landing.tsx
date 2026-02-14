import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Activity, Users, CheckCircle, Truck, Lightbulb, Moon, Sun, Globe, Radio, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
    const { theme, toggleTheme } = useTheme();

    const stats = [
        { label: 'Active Nodes', value: '1,240', icon: Globe },
        { label: 'Uptime', value: '99.9%', icon: Activity },
        { label: 'Resolutions', value: '45.2k', icon: CheckCircle },
        { label: 'Response', value: '< 2h', icon: Zap },
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-[#020617] text-gray-900 dark:text-gray-100 font-sans selection:bg-cyan-500 selection:text-black">

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">CivicConnect</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/about" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">About System</Link>
                            <Link to="/admin/login" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">Admin Portal</Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/5"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <Link to="/signup" className="group relative px-6 py-2.5 overflow-hidden rounded-sm font-black text-xs uppercase tracking-widest transition-all">
                                <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500"></span>
                                <span className="relative flex items-center gap-2 text-white">
                                    Initialize <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-20 lg:pt-56 lg:pb-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                            System Live • All Sectors Operational
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-gray-900 dark:text-white uppercase italic"
                        >
                            The Digital Architecture <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Of Civic Action.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl text-lg text-gray-400 font-medium leading-relaxed mb-12"
                        >
                            A decentralized tactical interface for urban management. Report outages, infrastructure failure, and civic needs directly to the command core.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-4 justify-center"
                        >
                            <Link to="/signup" className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:bg-cyan-500 dark:hover:bg-cyan-400 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                Begin Deployment
                            </Link>
                            <Link to="/login" className="px-10 py-5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                                Access Console
                            </Link>
                        </motion.div>
                    </div>

                    {/* Dashboard Preview / Tactical Frame */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="mt-24 relative mx-auto max-w-5xl group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                            <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-0.5 bg-black/40 rounded-full text-[8px] font-mono text-gray-500 uppercase tracking-widest border border-white/5">
                                        civic_connect_os_v2.0
                                    </div>
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
                                alt="Dashboard Preview"
                                className="w-full opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20 animate-[scan_4s_linear_infinite]" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Tactical Metrics Strip */}
            <div className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center lg:items-start group">
                                <div className="flex items-center gap-3 mb-2">
                                    <stat.icon size={16} className="text-cyan-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}</span>
                                </div>
                                <div className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sector Operations Section */}
            <section className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white uppercase italic">
                                Operational <br />
                                <span className="text-cyan-500">Sectors.</span>
                            </h2>
                            <p className="text-gray-400 font-medium">
                                Specialized reporting vectors optimized for municipal response units.
                            </p>
                        </div>
                        <div className="hidden lg:flex gap-4">
                            <div className="p-4 border border-white/5 bg-white/5 rounded-sm">
                                <Radio size={20} className="text-cyan-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/10">
                        {[
                            { icon: Truck, title: 'Transport', desc: 'Pavement integrity, lane blockage, and structural decay.', color: 'cyan' },
                            { icon: CheckCircle, title: 'Sanitation', desc: 'Waste vector management and environmental hazards.', color: 'emerald' },
                            { icon: Lightbulb, title: 'Energy', desc: 'Grid failures, public luminosity, and electrical hazards.', color: 'yellow' },
                            { icon: Users, title: 'Civic', desc: 'Public space optimization and community welfare.', color: 'purple' },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#020617] p-10 group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all">
                                <div className="text-cyan-500 mb-8 transform group-hover:rotate-12 transition-transform">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section / Video Placeholder Effect */}
            <section className="py-32 bg-gray-50 dark:bg-white flex flex-col items-center text-center px-6">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-black uppercase italic mb-8">
                    Architecture <br /> Of Accountability.
                </h2>
                <p className="max-w-3xl text-xl text-gray-600 font-medium mb-12">
                    We bridge the gap between citizen observation and institutional response. Every byte of data is tracked, verified, and pushed to resolution.
                </p>
                <Link to="/signup" className="group flex items-center gap-4 text-gray-900 dark:text-black font-black uppercase tracking-widest hover:text-cyan-600 transition-colors">
                    Join the mesh <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </section>

            {/* Tactical Footer */}
            <footer className="bg-white dark:bg-black py-16 border-t border-gray-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-6">
                                <Shield className="h-6 w-6 text-cyan-500" />
                                <span className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase">CivicConnect</span>
                            </div>
                            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                                A high-performance urban reporting utility designed for the modern citizen. Secure, automated, and tactical.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 mb-6">Protocols</h4>
                            <ul className="space-y-3 text-sm font-bold text-gray-400">
                                <li><Link to="/about" className="hover:text-white transition-colors uppercase tracking-tighter">About System</Link></li>
                                <li><Link to="/admin/login" className="hover:text-white transition-colors uppercase tracking-tighter">Admin Portal</Link></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-tighter">User Manual</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 mb-6">Security</h4>
                            <ul className="space-y-3 text-sm font-bold text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-tighter">Privacy Mesh</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-tighter">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-tighter">API Access</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                            &copy; 2026 civic_connect_core_v2.0 // all_rights_reserved
                        </div>
                        <div className="flex gap-6">
                            <div className="h-1 w-8 bg-cyan-500/20"></div>
                            <div className="h-1 w-8 bg-blue-500/20"></div>
                            <div className="h-1 w-8 bg-purple-500/20"></div>
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes scan {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(100vh); }
                }
            `}</style>
        </div>
    );
};

export default Landing;
