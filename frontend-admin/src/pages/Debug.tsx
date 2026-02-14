import { useState, useEffect } from 'react';
import { Activity, Server, Database, Wifi, ShieldCheck, Cpu, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const BACKGROUNDS = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
];

const Debug = () => {
    const [stats, setStats] = useState([
        { name: 'API Server', status: 'Online', latency: '45ms', icon: Server, color: 'text-green-400' },
        { name: 'Database', status: 'Connected', latency: '12ms', icon: Database, color: 'text-blue-400' },
        { name: 'WebSocket', status: 'Active', latency: '5ms', icon: Wifi, color: 'text-purple-400' },
        { name: 'Auth Service', status: 'Secure', latency: '28ms', icon: ShieldCheck, color: 'text-cyan-400' },
    ]);

    // Auto-refresh state
    const [refreshTimer, setRefreshTimer] = useState(30);
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const [currentBg, setCurrentBg] = useState(0);

    const [userReports, setUserReports] = useState([
        { email: 'citizen@example.com', role: 'CITIZEN', reports: 12 },
        { email: 'admin@civic.local', role: 'ADMIN', reports: 5 },
        { email: 'user.test@gmail.com', role: 'CITIZEN', reports: 3 },
        { email: 'guest_77@temp.net', role: 'GUEST', reports: 0 },
    ]);

    const [logs, setLogs] = useState([
        { type: 'info', msg: 'Initializing debug interface...', color: 'text-green-400' },
        { type: 'info', msg: 'Connected to admin_node_v1.0.4', color: 'text-green-400' },
        { type: 'net', msg: 'WebSocket channel established', color: 'text-blue-400' },
        { type: 'warn', msg: 'High memory usage detected', color: 'text-yellow-400' },
        { type: 'ready', msg: 'Waiting for commands...', color: 'text-green-400' },
    ]);

    // Background Rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % BACKGROUNDS.length);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    // Latency simulation (fast updates)
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => prev.map(s => ({
                ...s,
                latency: Math.floor(Math.random() * 50 + 5) + 'ms'
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // 30 Seconds Refresher Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setRefreshTimer((prev) => {
                if (prev <= 1) {
                    refreshData();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const refreshData = () => {
        setLastRefreshed(new Date());

        // Randomize mock reports slightly
        setUserReports(prev => prev.map(u => ({
            ...u,
            reports: u.reports + (Math.random() > 0.7 ? 1 : 0)
        })));

        // Add a mock log
        const newLog = Math.random() > 0.5
            ? { type: 'net', msg: `Ping received from client_${Math.floor(Math.random() * 1000)}`, color: 'text-blue-400' }
            : { type: 'info', msg: 'System check completed. All green.', color: 'text-green-400' };

        setLogs(prev => [...prev.slice(1), newLog]);
    };

    return (
        <div className="min-h-screen relative flex overflow-hidden text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 bg-gray-900">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBg}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${BACKGROUNDS[currentBg]})` }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"></div>
                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black/40 to-purple-900/20"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col min-h-screen">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                        <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 mr-3 transition-colors">
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="font-medium">Back to Dashboard</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between mb-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="flex items-center space-x-6">
                        <div className="h-16 w-16 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/50 shadow-lg shadow-red-500/20">
                            <Cpu className="h-8 w-8 text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">System Diagnostics</h1>
                            <p className="text-gray-400 flex items-center mt-1">
                                Real-time infrastructure monitoring
                                <span className="mx-3 text-white/20">|</span>
                                <span className="text-xs border border-white/10 rounded-full px-3 py-1 bg-white/5 flex items-center text-blue-300">
                                    <RefreshCw className={`h-3 w-3 mr-2 ${refreshTimer <= 5 ? 'animate-spin text-yellow-400' : ''}`} />
                                    Refreshing in {refreshTimer}s
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 text-right">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-bold shadow-lg shadow-green-500/10 mb-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            SYSTEM OPTIMAL
                        </div>
                        <div className="text-xs text-gray-500 font-mono">Last updated: {lastRefreshed.toLocaleTimeString()}</div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg bg-black/20 ${stat.color}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-lg font-medium text-gray-200">{stat.name}</span>
                                </div>
                                <Activity className="h-4 w-4 text-gray-600 animate-pulse" />
                            </div>
                            <div className="mt-6 flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                                    <div className={`text-sm font-bold ${stat.color} flex items-center`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${stat.color.replace('text', 'bg')} mr-2`}></div>
                                        {stat.status}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Latency</div>
                                    <div className="text-xl font-mono text-white tracking-widest">{stat.latency}</div>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-black/20 rounded-full h-1 overflow-hidden">
                                <motion.div
                                    className={`h-full ${stat.color.replace('text', 'bg')}`}
                                    initial={{ width: '0%' }}
                                    animate={{ width: ['30%', '70%', '40%', '80%'] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>


                {/* User Report Statistics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <ShieldCheck className="h-6 w-6 mr-3 text-blue-400" />
                            User Report Analytics
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="pb-4 font-medium pl-2">User Identity</th>
                                        <th className="pb-4 font-medium">System Role</th>
                                        <th className="pb-4 font-medium text-right pr-2">Reports Filed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {userReports.map((u, i) => (
                                        <tr key={i} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 text-sm text-gray-300 group-hover:text-white pl-2 font-medium">{u.email}</td>
                                            <td className="py-4 text-xs">
                                                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wide ${u.role === 'ADMIN' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm font-mono text-right text-white pr-2">
                                                <span className="bg-white/10 px-2 py-1 rounded-lg">{u.reports}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col"
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Live Ingestion Stream</h3>
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center p-3 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-lg mr-3 shadow-lg">
                                        📸
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">Image Upload</p>
                                        <p className="text-[10px] text-gray-400 font-mono">ID: img_{Math.floor(Math.random() * 9000) + 1000}</p>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">System Logs</h4>
                            <div className="space-y-1.5 font-mono text-xs">
                                {logs.slice(-3).map((log, i) => (
                                    <p key={i} className="truncate"><span className={log.color}>➜</span> <span className="text-gray-400">[{log.type}]</span> {log.msg}</p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Debug;
