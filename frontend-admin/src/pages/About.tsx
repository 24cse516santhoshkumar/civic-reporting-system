import { Link } from 'react-router-dom';
import { Shield, Target, Cpu, Users, ArrowRight, Zap, Globe, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen relative overflow-x-hidden bg-[#020617] text-gray-100 font-sans selection:bg-cyan-500 selection:text-black">

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
            </div>

            {/* Navigation (Simple) */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white uppercase italic">CivicConnect</span>
                        </Link>

                        <div className="flex items-center space-x-6">
                            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Access Console</Link>
                            <Link to="/signup" className="px-6 py-2.5 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all rounded-sm">
                                Initialize Link
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                    >
                        Sector_Alpha // Foundation Protocol
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] text-white uppercase italic"
                    >
                        Our Mission: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Urban Optimization.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-3xl mx-auto text-xl text-gray-400 font-medium leading-relaxed mb-12"
                    >
                        CivicConnect is a decentralized reporting utility designed to synchronize citizen observations with rapid institucional response. We provide the architecture for accountable urban evolution.
                    </motion.p>
                </div>
            </header>

            {/* Core Values / Pillars */}
            <section className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Target,
                                title: 'Precision Response',
                                desc: 'Our AI engine categorizes and routes reports to the exact municipal unit responsible for resolution, eliminating bureaucratic delay.',
                                meta: 'LATENCY < 500MS'
                            },
                            {
                                icon: Cpu,
                                title: 'Automated Ledger',
                                desc: 'Every action taken by city officials is logged on a transparent ledger, ensuring public accountability for every reported issue.',
                                meta: 'BLOCK_SYNC:ACTIVE'
                            },
                            {
                                icon: Globe,
                                title: 'Urban Network',
                                desc: 'Creating a mesh of active citizens who act as the nervous system of the city, detecting failures before they become catastrophes.',
                                meta: 'NODES: 1.2K+'
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                                <div className="relative p-10 bg-white/[0.02] border border-white/5 rounded-sm hover:border-cyan-500/30 transition-all flex flex-col items-center text-center">
                                    <div className="h-16 w-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                        <stat.icon size={28} className="text-cyan-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter italic">{stat.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{stat.desc}</p>
                                    <div className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.2em]">{stat.meta}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works (Tactical Flow) */}
            <section className="py-32 bg-white flex flex-col items-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black tracking-tighter text-black uppercase italic mb-6">Operational Flow.</h2>
                        <p className="text-gray-600 font-medium uppercase tracking-widest text-xs">Citizen to City: Synchronized Logic</p>
                    </div>

                    <div className="space-y-24">
                        {[
                            {
                                step: '01',
                                title: 'Observation Capture',
                                desc: 'Citizens detect infrastructure anomalies—potholes, outages, or hazards—and initialize a report through the encrypted terminal.',
                                icon: Radio,
                                align: 'flex-row'
                            },
                            {
                                step: '02',
                                title: 'AI Categorization',
                                desc: 'Our neural core analyzes visual data and metadata to verify the event and route it to the appropriate command unit.',
                                iconTag: Zap,
                                align: 'flex-row-reverse'
                            },
                            {
                                step: '03',
                                title: 'Resolution Mesh',
                                desc: 'Response teams are dispatched. Status updates are pushed to the reporting citizen in real-time until the anomaly is resolved.',
                                icon: Users,
                                align: 'flex-row'
                            },
                        ].map((item, i) => (
                            <div key={i} className={`flex flex-col md:${item.align} items-center gap-12 lg:gap-24`}>
                                <div className="flex-1">
                                    <div className="text-cyan-500 font-mono text-xs uppercase tracking-[0.5em] mb-4">Phase_{item.step}</div>
                                    <h3 className="text-4xl font-black tracking-tighter text-black uppercase italic mb-6">{item.title}</h3>
                                    <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-xl">{item.desc}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="h-48 w-48 bg-black border border-white/5 rounded-full flex items-center justify-center relative group">
                                        <div className="absolute inset-4 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                                        <div className="absolute inset-8 border border-blue-500/20 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
                                        {item.iconTag && <item.iconTag size={40} className="text-cyan-500 group-hover:scale-125 transition-transform duration-500" />}
                                        {!item.iconTag && <item.icon size={40} className="text-cyan-500" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Section */}
            <section className="py-32 relative z-10 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic mb-10">
                        Become A <br /> <span className="text-cyan-500">Node In The System.</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-medium mb-12">
                        Start your journey toward a more efficient, responsive, and accountable city today.
                    </p>
                    <Link to="/signup" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black uppercase tracking-[0.2em] transform hover:scale-105 transition-all group">
                        Initialize Identity <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-16 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-cyan-500" />
                        <span className="text-xl font-black text-white italic tracking-tighter uppercase">CivicConnect</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest text-center">
                        ESTABLISHED 2026 // COMMAND_CORE_v2.0 // DECENTRALIZED_GOVERNANCE_PROTOCOL
                    </div>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/login" className="hover:text-white transition-colors">Access</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
