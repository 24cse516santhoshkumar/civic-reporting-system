import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Users, FileText, CheckCircle, Clock, AlertTriangle, MapPin, Calendar, ArrowRight, Activity, TrendingUp, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import DashboardMap from '../components/DashboardMap';
import DashboardCharts from '../components/DashboardCharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface User {
    user_id: string;
    email: string;
    role: string;
}

interface Report {
    report_id: string;
    user_id: string;
    title: string;
    location: string;
    created_at: string;
    status: string;
    image_url?: string;
}

interface DashboardStats {
    total: number;
    resolved: number;
    open: number; // pending
    inProgress: number;
    totalUsers?: number;
    avgResolutionTime?: string;
    wardPerformance?: Record<string, number>;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        total: 0,
        resolved: 0,
        open: 0,
        inProgress: 0
    });
    const [recentReports, setRecentReports] = useState<Report[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, reportsRes] = await Promise.all([
                api.get('/analytics/dashboard-stats'),
                api.get('/reports')
            ]);
            setStats(statsRes.data);
            setRecentReports(reportsRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReport = async (report_id: string) => {
        if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;

        try {
            await api.delete(`/reports/${report_id}`);
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to delete report", error);
            alert("Failed to delete report. You might not have permission.");
        }
    };

    const handleGenerateUserReport = async () => {
        const dashboardElement = document.getElementById('dashboard-content');
        if (!dashboardElement) return;

        try {
            const canvas = await html2canvas(dashboardElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#020617'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Civic_Users_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            OPEN: "bg-red-500/10 text-red-400 border-red-500/20",
            IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            APPROVED: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            RESOLVED: "bg-green-500/10 text-green-400 border-green-500/20",
            REJECTED: "bg-red-500/10 text-red-400 border-red-500/20"
        };
        return (
            <span className={`px-2 py-1 rounded-md text-xs font-bold border ${styles[status as keyof typeof styles] || "bg-gray-500/10 text-gray-400"}`}>
                {status === 'APPROVED' ? 'ACCEPTED' : status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <Layout userRole={user?.role}>
            <div id="dashboard-content" className="max-w-7xl mx-auto space-y-8 p-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white text-gray-900 tracking-tight">
                            Welcome back, {user?.email?.split('@')[0] || 'User'}
                        </h1>
                        <p className="dark:text-gray-400 text-gray-600 mt-1">Here's what's happening in your city today.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex gap-3">
                            {/* Admin Buttons */}
                            {user?.role === 'ADMIN' && (
                                <>
                                    <button
                                        onClick={() => navigate('/reports')}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl border border-white/10 transition-all font-bold flex items-center gap-2"
                                    >
                                        <FileText size={18} /> All Reports
                                    </button>
                                    <button
                                        onClick={handleGenerateUserReport}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all font-bold flex items-center gap-2"
                                    >
                                        <FileText size={18} /> Users Report
                                    </button>
                                </>
                            )}

                            {/* Official Buttons */}
                            {user?.role === 'OFFICIAL' && (
                                <Link
                                    to="/reports"
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all font-bold flex items-center gap-2"
                                >
                                    <FileText size={18} /> View All Reports
                                </Link>
                            )}

                            {/* Citizen Buttons */}
                            {user?.role !== 'ADMIN' && user?.role !== 'OFFICIAL' && (
                                <button
                                    onClick={() => navigate('/create-report')}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all font-bold flex items-center gap-2"
                                >
                                    <FileText size={18} /> Create Report
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {user?.role === 'ADMIN' && (
                        <>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium dark:text-gray-400 text-gray-600">Total Reports</p>
                                        <h3 className="text-3xl font-bold dark:text-white text-gray-900 mt-1">{stats.total}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 dark:text-blue-400">
                                        <FileText size={24} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-green-500 dark:text-green-400">
                                    <TrendingUp size={14} className="mr-1" /> +12% from last month
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium dark:text-gray-400 text-gray-600">Resolved</p>
                                        <h3 className="text-3xl font-bold dark:text-white text-gray-900 mt-1">{stats.resolved}</h3>
                                    </div>
                                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500 dark:text-green-400">
                                        <CheckCircle size={24} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs dark:text-gray-400 text-gray-500">
                                    <Activity size={14} className="mr-1" /> Avg time: {stats.avgResolutionTime || 'N/A'}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium dark:text-gray-400 text-gray-600">In Progress</p>
                                        <h3 className="text-3xl font-bold dark:text-white text-gray-900 mt-1">{stats.inProgress}</h3>
                                    </div>
                                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 dark:text-yellow-400">
                                        <Clock size={24} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-yellow-600 dark:text-yellow-500">
                                    <AlertTriangle size={14} className="mr-1" /> {stats.open} Pending validation
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium dark:text-gray-400 text-gray-600">Active Users</p>
                                        <h3 className="text-3xl font-bold dark:text-white text-gray-900 mt-1">{(stats as DashboardStats & { totalUsers?: number }).totalUsers || 0}</h3>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 dark:text-purple-400">
                                        <Users size={24} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-green-500 dark:text-green-400">
                                    <TrendingUp size={14} className="mr-1" /> +5% new users
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Map Section */}
                <DashboardMap />

                {/* Charts Section */}
                <DashboardCharts stats={stats} />

                {/* Recent Activities */}
                <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold dark:text-white text-gray-900">Recent Reports</h2>
                        {/* Reports page is deleted, so no View All link */}
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-10 dark:text-gray-400 text-gray-500">Loading reports...</div>
                        ) : recentReports.length > 0 ? (
                            recentReports.map((report) => (
                                <div key={report.report_id} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-lg transition-all border border-transparent hover:border-white/20 dark:hover:border-white/10 group cursor-pointer relative" onClick={() => navigate(`/issues/${report.report_id}`)}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                                            {report.image_url ? (
                                                <img src={report.image_url} alt="Report" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center dark:bg-gray-800 bg-gray-300 dark:text-gray-500 text-gray-400">
                                                    <FileText size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold dark:text-white text-gray-900 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors pr-8">{report.title}</h4>
                                            <div className="flex items-center text-xs dark:text-gray-400 text-gray-500 mt-1 gap-3">
                                                <span className="flex items-center"><MapPin size={12} className="mr-1 text-red-400" /> {report.location}</span>
                                                <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(report.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={report.status} />

                                        {/* Admin Actions */}
                                        {user?.role === 'ADMIN' && report.status === 'OPEN' && (
                                            <div className="flex gap-2 ml-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        api.patch(`/reports/${report.report_id}/status`, { status: 'IN_PROGRESS' }).then(() => fetchDashboardData());
                                                    }}
                                                    className="p-1 px-2 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white text-xs font-bold transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        api.patch(`/reports/${report.report_id}/status`, { status: 'REJECTED' }).then(() => fetchDashboardData());
                                                    }}
                                                    className="p-1 px-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {/* Official Actions */}
                                        {user?.role === 'OFFICIAL' && report.status !== 'RESOLVED' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    api.patch(`/reports/${report.report_id}/status`, { status: 'RESOLVED' }).then(() => fetchDashboardData());
                                                }}
                                                className="ml-2 p-1 px-2 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white text-xs font-bold transition-colors"
                                            >
                                                Complete
                                            </button>
                                        )}

                                        <ArrowRight size={16} className="dark:text-gray-600 text-gray-400 group-hover:translate-x-1 transition-transform duration-300 ml-2" />

                                        {/* Delete Button - Only for Owner */}
                                        {user?.user_id === report.user_id && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteReport(report.report_id);
                                                }}
                                                className="p-2 rounded-lg group-hover:scale-100 transition-transform bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                                title="Delete Report"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 dark:text-gray-400 text-gray-500">No recent reports found.</div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

