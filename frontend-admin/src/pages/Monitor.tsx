import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, Shield, Users, Radio, MapPin, Clock, ArrowRight, Cpu, Zap, Wifi } from 'lucide-react';
import Layout from '../components/Layout';
import DashboardMap from '../components/DashboardMap';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
    report_id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    status: string;
    priority: string;
    image_url: string;
    created_at: string;
}

const Monitor = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock Live Metrics
    const [metrics, setMetrics] = useState({
        cpu: 45,
        mem: 62,
        lat: 24,
        uptime: '12:45:22'
    });

    const [backendStats, setBackendStats] = useState<{ totalUsers?: number; total?: number } | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:3000/analytics/dashboard-stats');
                setBackendStats(res.data);
            } catch (err) {
                console.error("Failed to fetch monitor stats", err);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                cpu: Math.floor(Math.random() * (60 - 40) + 40),
                mem: Math.floor(Math.random() * (70 - 60) + 60),
                lat: Math.floor(Math.random() * (30 - 20) + 20),
                uptime: new Date().toLocaleTimeString([], { hour12: false })
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reportsRes = await axios.get('http://localhost:3000/reports?limit=15');
                const data = reportsRes.data;
                setReports(data);

                // Generate a log from the most recent report if it's new
                if (data.length > 0) {
                    const latest = data[0];
                    const logMsg = `[${new Date().toLocaleTimeString()}] INCOMING: ${latest.category} alert at ${latest.location}`;
                    setLogs(prev => [logMsg, ...prev].slice(0, 50));
                }

                setLoading(false);
            } catch (error) {
                console.error("Monitor: Failed to fetch data", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [logs]);

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            'OPEN': 'text-red-400 border-red-500/30 bg-red-500/10',
            'IN_PROGRESS': 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
            'RESOLVED': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
        };
        return (
            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter border rounded-sm ${colors[status] || 'text-gray-400 border-gray-500/30 bg-gray-500/10'}`}>
                {status}
            </span>
        );
    };

    return (
        <Layout userRole="ADMIN">
            <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4 text-cyan-50 font-mono">

                {/* Tactical Header / System Pulse */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
                    <div className="bg-black/60 border border-cyan-500/20 p-3 rounded-sm flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1 opacity-20"><Cpu size={14} /></div>
                        <span className="text-[10px] text-cyan-500/60 uppercase font-black">Core Load</span>
                        <div className="flex items-end gap-2 mt-1">
                            <span className="text-2xl font-black">{metrics.cpu}%</span>
                            <div className="flex-1 h-1.5 bg-cyan-900/40 mb-1.5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${metrics.cpu}%` }} className="h-full bg-cyan-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/60 border border-purple-500/20 p-3 rounded-sm flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 opacity-20"><Zap size={14} /></div>
                        <span className="text-[10px] text-purple-500/60 uppercase font-black">Memory Stack</span>
                        <div className="flex items-end gap-2 mt-1">
                            <span className="text-2xl font-black">{metrics.mem}%</span>
                            <div className="flex-1 h-1.5 bg-purple-900/40 mb-1.5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${metrics.mem}%` }} className="h-full bg-purple-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/60 border border-emerald-500/20 p-3 rounded-sm flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 opacity-20"><Wifi size={14} /></div>
                        <span className="text-[10px] text-emerald-500/60 uppercase font-black">Sync Latency</span>
                        <div className="flex items-end gap-2 mt-1">
                            <span className="text-2xl font-black">{metrics.lat}ms</span>
                            <div className="flex-1 h-1.5 bg-emerald-900/40 mb-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[20%]" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/60 border border-yellow-500/20 p-3 rounded-sm flex flex-col relative overflow-hidden">
                        <span className="text-[10px] text-yellow-500/60 uppercase font-black">Active Units</span>
                        <div className="flex items-end gap-2 mt-1">
                            <span className="text-2xl font-black">
                                {String(backendStats?.totalUsers || 0).padStart(3, '0')}
                            </span>
                            <Shield size={16} className="text-yellow-500 mb-1.5 opacity-50" />
                        </div>
                    </div>
                    <div className="hidden md:flex bg-cyan-500/10 border border-cyan-500/40 p-3 rounded-sm flex-col justify-center items-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent animate-pulse" />
                        <span className="text-[10px] text-cyan-400 uppercase font-black tracking-widest">Operation Clock</span>
                        <span className="text-xl font-black tracking-tighter">{metrics.uptime}</span>
                    </div>
                </div>

                {/* Main Control Grid */}
                <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">

                    {/* LEFT: Tactical Map (Cyber Style) */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                        <div className="flex-1 bg-black/80 border border-cyan-500/30 rounded-sm relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                            <div className="absolute top-0 left-0 right-0 p-3 z-10 bg-gradient-to-b from-black to-transparent flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Geospatial Incident Array</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500/40 px-2 py-1 rounded-sm border border-cyan-500/30 transition-all uppercase">Vector</button>
                                    <button className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500/40 px-2 py-1 rounded-sm border border-cyan-500/30 transition-all uppercase">Thermal</button>
                                </div>
                            </div>

                            {/* Scanning Overlay Effect */}
                            <div className="absolute inset-0 pointer-events-none z-10">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/30 animate-[scan_4s_linear_infinite]" />
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
                            </div>

                            <div className="h-full w-full [&>div]:h-full [&>div]:mb-0 [&>div]:rounded-none [&>div]:border-0 [&>div>div]:h-full grayscale-[0.5] invert-[0.05] brightness-[0.8] contrast-[1.2]">
                                <DashboardMap />
                            </div>
                        </div>

                        {/* BOTTOM: System Console (Logs) */}
                        <div className="h-32 bg-black/90 border border-green-500/30 rounded-sm p-3 relative overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={14} className="text-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-500/80 uppercase font-bold">System Operations Log</span>
                            </div>
                            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar text-[11px] text-green-500/70 space-y-1">
                                {logs.length === 0 ? (
                                    <div className="animate-pulse">Establishing uplink connection...</div>
                                ) : (
                                    logs.map((log, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="opacity-40">::</span>
                                            <span>{log}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="absolute bottom-1 right-2 text-[8px] text-green-500/20 uppercase">SECURE_UPLINK_ENCRYPTED</div>
                        </div>
                    </div>

                    {/* RIGHT: Active Threats / Feed */}
                    <div className="col-span-12 lg:col-span-4 bg-black/60 border border-cyan-500/20 flex flex-col rounded-sm overflow-hidden">
                        <div className="p-3 border-b border-cyan-500/20 bg-cyan-500/5 flex justify-between items-center">
                            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Radio className="text-cyan-500 animate-pulse" size={14} /> Active Feed
                            </h2>
                            <span className="text-[10px] bg-red-500/20 text-red-500 px-2 rounded-full border border-red-500/20 animate-pulse">LIVE</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {loading ? (
                                    <div className="py-20 text-center text-cyan-500/40 text-xs animate-pulse">Interrogating Database...</div>
                                ) : (
                                    reports.map((report) => (
                                        <motion.div
                                            key={report.report_id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ x: 5, backgroundColor: 'rgba(6,182,212,0.1)' }}
                                            className="bg-black/40 border border-cyan-500/10 p-3 rounded-sm transition-all cursor-pointer group relative overflow-hidden"
                                            onClick={() => navigate(`/issues/${report.report_id}`)}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500/0 group-hover:bg-cyan-500 transition-all" />
                                            <div className="flex justify-between items-start mb-1">
                                                <StatusBadge status={report.status} />
                                                <span className="text-[10px] text-white/40 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase leading-tight mb-1">
                                                {report.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-[10px] text-cyan-500/50">
                                                <span className="flex items-center gap-1 truncate max-w-[80%]">
                                                    <MapPin size={10} className="text-red-500/60" />
                                                    {report.location}
                                                </span>
                                                <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Mini Stats */}
                        <div className="p-3 border-t border-cyan-500/20 bg-black flex justify-between items-center text-[10px]">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><Users size={12} className="text-cyan-500" /> {backendStats?.totalUsers || 0} Registered</span>
                                <span className="flex items-center gap-1"><Shield size={12} className="text-yellow-500" /> {backendStats?.total || 0} Reports</span>
                            </div>
                            <span className="animate-pulse text-green-500 italic">SYSTEM_READY</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Custom Scanline CSS */}
            <style>{`
                @keyframes scan {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(100vh); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.4); }
            `}</style>
        </Layout>
    );
};

export default Monitor;
