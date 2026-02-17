import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { FileText, Filter, Search, MapPin, Calendar, ArrowRight, CheckCircle2, XCircle, Clock, MoreVertical, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
    report_id: string;
    user_id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    status: string;
    created_at: string;
    image_url?: string;
    priority?: string;
    user?: {
        full_name: string;
        email: string;
    };
}

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports');
            setReports(res.data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.patch(`/reports/${id}/status`, { status: newStatus });
            // Optimistic update
            setReports(reports.map(r => r.report_id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
            fetchReports(); // Revert on failure
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesStatus = filterStatus === 'ALL' || report.status === filterStatus;
        const matchesCategory = filterCategory === 'ALL' || report.category === filterCategory;
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearch;
    });

    const categories = Array.from(new Set(reports.map(r => r.category)));

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            PENDING: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
            OPEN: "bg-red-500/20 text-red-400 border-red-500/30",
            IN_PROGRESS: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            RESOLVED: "bg-green-500/20 text-green-400 border-green-500/30",
            REJECTED: "bg-gray-500/20 text-gray-400 border-gray-500/30"
        };
        const icons = {
            PENDING: <Clock size={12} />,
            OPEN: <AlertTriangle size={12} />,
            IN_PROGRESS: <Clock size={12} />,
            RESOLVED: <CheckCircle2 size={12} />,
            REJECTED: <XCircle size={12} />
        };

        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${styles[status as keyof typeof styles] || "bg-gray-500/10 text-gray-400"}`}>
                {icons[status as keyof typeof styles]}
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <Layout userRole={user?.role}>
            <div className="max-w-7xl mx-auto p-4 space-y-8 min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 tracking-tight drop-shadow-sm">
                            Mission Control
                        </h1>
                        <p className="text-gray-400 mt-2 font-medium text-lg">Monitor and respond to citizen reports in real-time.</p>
                    </div>

                    {/* Stats Summary (Optional Micro-dashboard) */}
                    <div className="flex gap-4">
                        <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="block text-2xl font-bold text-white">{reports.filter(r => r.status === 'OPEN').length}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Open</span>
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="block text-2xl font-bold text-green-400">{reports.filter(r => r.status === 'RESOLVED').length}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Resolved</span>
                        </div>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="sticky top-4 z-30 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title, location, description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border-none rounded-xl leading-5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-white/10 transition-all sm:text-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none h-full bg-white/5 hover:bg-white/10 border-l border-white/5 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:bg-white/20 transition-all cursor-pointer text-sm font-medium"
                            >
                                <option value="ALL">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>

                        <div className="relative">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="appearance-none h-full bg-white/5 hover:bg-white/10 border-l border-white/5 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:bg-white/20 transition-all cursor-pointer text-sm font-medium w-full md:w-48"
                            >
                                <option value="ALL">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <MoreVertical className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    <AnimatePresence>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white/5 rounded-3xl h-64 animate-pulse" />
                            ))
                        ) : filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <motion.div
                                    key={report.report_id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    onClick={() => navigate(`/issues/${report.report_id}`)}
                                    className="group relative bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer flex flex-col"
                                >
                                    {/* Image Area */}
                                    <div className="aspect-video w-full bg-gray-800 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 opactiy-80" />
                                        {report.image_url ? (
                                            <img
                                                src={report.image_url}
                                                alt={report.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        {/* Fallback pattern if no image or error */}
                                        <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center ${report.image_url ? 'hidden' : ''}`}>
                                            <FileText className="text-white/10" size={64} />
                                        </div>

                                        <div className="absolute top-4 right-4 z-20">
                                            <StatusBadge status={report.status} />
                                        </div>
                                        <div className="absolute bottom-4 left-4 z-20 max-w-[80%]">
                                            <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10 mb-2">
                                                {report.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                            {report.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                                            {report.description}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-6">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-blue-500" />
                                                <span className="truncate max-w-[120px]">{report.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-purple-500" />
                                                <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex gap-2">
                                                {user?.role === 'OFFICIAL' && report.status !== 'RESOLVED' && (
                                                    <button
                                                        onClick={(e) => handleStatusUpdate(report.report_id, 'RESOLVED', e)}
                                                        className="px-4 py-2 bg-green-500/10 hover:bg-green-500 hover:text-white text-green-500 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-green-500/20"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                        Complete
                                                    </button>
                                                )}
                                                {user?.role === 'ADMIN' && report.status === 'OPEN' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => handleStatusUpdate(report.report_id, 'IN_PROGRESS', e)}
                                                            className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl transition-all"
                                                            title="Mark In Progress"
                                                        >
                                                            <Clock size={18} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleStatusUpdate(report.report_id, 'REJECTED', e)}
                                                            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all"
                                                            title="Reject Report"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                                <ArrowRight size={16} className="text-gray-400 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <Search className="text-gray-600" size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No reports found</h3>
                                <p className="text-gray-400 max-w-md">
                                    No reports match your current filters. Try adjusting your search query or status filter.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
};

export default Reports;
