import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle2, Activity, Share2, Download, Shield, User, Phone, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BACKGROUNDS = [
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
];

const DEPARTMENTS = [
    'Roads & Bridges',
    'Sanitation',
    'Electrical',
    'Water Supply',
    'Public Health',
    'General Administration'
];

interface Issue {
    report_id: string;
    id?: string; // for mock fallback
    title: string;
    category: string;
    description: string;
    location: string;
    status: string;
    user_id: string;
    created_at: string;
    updated_at?: string;
    image_url?: string;
    imageUrl?: string; // for compatibility
    priority?: string;
    reporter?: string;
    reporterPhone?: string;
    assigned_department?: string;
    date?: string; // for display
}

const IssueDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentBg, setCurrentBg] = useState(0);
    const [issue, setIssue] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % BACKGROUNDS.length);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}`)
            .then(res => {
                const data = res.data;
                const reporterName = data.user?.email ? data.user.email.split('@')[0] : 'Citizen User';

                setIssue({
                    ...data,
                    report_id: data.report_id || id || '',
                    title: data.category || 'Untitled Report', // Title is usually category in this design
                    user_id: data.user_id || '',
                    created_at: data.created_at || new Date().toISOString(),
                    category: data.category || 'Report Issue',
                    date: new Date(data.created_at).toLocaleDateString(),
                    imageUrl: data.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    priority: 'HIGH',
                    reporter: reporterName,
                    reporterPhone: data.user?.phone_number || 'N/A'
                });
                setLoading(false);
            })
            .catch(err => {
                console.log("Failed to fetch issue, using mock", err);
                // Mock fallback...
                const mockIssue: Issue = {
                    report_id: id || 'mock-id',
                    id: id || 'mock-id',
                    title: 'Road Damage Mock',
                    user_id: 'mock-user',
                    created_at: new Date().toISOString(),
                    category: 'Road Damage',
                    description: 'Severe pothole causing traffic congestion.',
                    location: 'Main Street, City Center',
                    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    status: 'OPEN',
                    priority: 'HIGH',
                    date: new Date().toLocaleDateString(),
                    reporter: 'Citizen #1234',
                    reporterPhone: '+91 98765 43210'
                }
                setIssue(mockIssue);
                setLoading(false);
            });
    }, [id]);

    const handleShare = async () => {
        if (!issue) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Civic Issue: ${issue.category}`,
                    text: `Check out this issue reported at ${issue.location}: ${issue.description}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const handleDownloadPdf = async () => {
        if (!reportRef.current || !issue) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true, // Important for external images
                logging: true,
                backgroundColor: '#111827' // Dark background for PDF
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`report-${issue.id}.pdf`);
        } catch (error) {
            console.error("PDF Download failed", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const handleDeleteIssue = async () => {
        if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            if (!issue) return;
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Report deleted successfully.");
            navigate('/dashboard');
        } catch (error: unknown) {
            console.error("Delete failed", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            alert(`Failed to delete report: ${errMsg}`);
        }
    };

    const handleAssignDepartment = async (dept: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}/assign-department`, { department: dept }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (issue) {
                setIssue({ ...issue, assigned_department: dept, updated_at: new Date().toISOString() });
            }
            alert(`Report assigned to ${dept}`);
        } catch (error: unknown) {
            console.error("Assignment failed", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            alert(`Failed to assign department: ${errMsg}`);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (issue) {
                setIssue({ ...issue, status: newStatus, updated_at: new Date().toISOString() });
            }
            alert(`Report status updated to ${newStatus}`);
        } catch (error: unknown) {
            console.error("Status update failed", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            alert(`Failed to update status: ${errMsg}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="flex flex-col items-center">
                    <Activity className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-400">Loading Report Details...</p>
                </div>
            </div>
        );
    }

    if (!issue) return <div className="text-white text-center mt-20">Issue not found</div>;

    return (
        <div className="min-h-screen relative flex overflow-hidden text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 bg-gray-900 pointer-events-none">
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
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col min-h-screen">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/10"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleShare}
                            className="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
                            title="Share Report"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className={`p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 flex items-center gap-2 ${downloading ? 'opacity-50 cursor-wait' : ''}`}
                            title="Download PDF"
                        >
                            {downloading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div> : <Download className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Content Container for PDF Capture */}
                <div ref={reportRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 rounded-3xl">
                    {/* Left Column: Image & Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Image Card */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">
                            <div className="absolute top-4 right-4 z-20">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-md border border-white/10 flex items-center
                                    ${issue.status === 'OPEN' ? 'bg-blue-500/80 text-white' :
                                        issue.status === 'RESOLVED' ? 'bg-green-500/80 text-white' :
                                            issue.status === 'APPROVED' ? 'bg-cyan-500/80 text-white' :
                                                'bg-yellow-500/80 text-white'}`
                                }>
                                    {issue.status === 'RESOLVED' ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Activity className="h-4 w-4 mr-2" />}
                                    {issue.status === 'APPROVED' ? 'ACCEPTED' : issue.status}
                                </span>
                            </div>
                            <div className="h-96 w-full overflow-hidden relative bg-gray-800">
                                <img
                                    src={issue.imageUrl}
                                    alt="Issue Evidence"
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous" // Crucial for html2canvas
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h1 className="text-4xl font-bold text-white mb-2 shadow-sm">{issue.category}</h1>
                                    <div className="flex items-center text-gray-300 text-sm">
                                        <MapPin className="h-4 w-4 mr-1.5 text-blue-400" />
                                        {issue.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-lg">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <span className="bg-blue-500/20 p-2 rounded-lg mr-3">
                                    <Activity className="h-5 w-5 text-blue-400" />
                                </span>
                                Issue Details
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {issue.description}
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Priority</div>
                                    <div className="text-lg font-bold text-red-400 flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                                        {issue.priority}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reported Date</div>
                                    <div className="text-lg font-bold text-white flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        {issue.date}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 col-span-2">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Assigned Department</div>
                                    <div className="text-lg font-bold text-blue-400 flex items-center">
                                        <Shield className="h-4 w-4 mr-2 text-blue-500" />
                                        {issue.assigned_department || 'Unassigned'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Sidebar Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Reporter Info */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Reporter Information</h3>
                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">
                                    <User size={20} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-white font-bold">{issue.reporter}</p>
                                    <p className="text-blue-400 text-sm flex items-center gap-1">
                                        <Phone size={12} /> {issue.reporterPhone}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Sidebar */}
                        <div className="bg-gradient-to-b from-blue-900/40 to-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl" data-html2canvas-ignore>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center">
                                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                                {userRole === 'ADMIN' ? 'Administrative Actions' : userRole === 'OFFICIAL' ? 'Official Actions' : 'Report Actions'}
                            </h3>

                            <div className="space-y-4">
                                {userRole === 'OFFICIAL' && issue.status !== 'RESOLVED' && (
                                    <button
                                        onClick={() => handleUpdateStatus('RESOLVED')}
                                        className="w-full py-3 px-4 rounded-xl bg-green-600/10 hover:bg-green-600/20 text-green-500 font-bold border border-green-500/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={16} /> Complete Report
                                    </button>
                                )}
                                {userRole === 'ADMIN' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleUpdateStatus('APPROVED')}
                                                className="py-3 px-4 rounded-xl bg-green-600/10 hover:bg-green-600/20 text-green-500 font-bold border border-green-500/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={16} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus('REJECTED')}
                                                className="py-3 px-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold border border-red-500/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Activity size={16} /> Reject
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 uppercase tracking-wider ml-1">Assign Department</label>
                                            <div className="relative group/select">
                                                <select
                                                    value={issue.assigned_department || ""}
                                                    onChange={(e) => handleAssignDepartment(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-white"
                                                >
                                                    <option value="" disabled className="bg-gray-900">Select Department</option>
                                                    {DEPARTMENTS.map(dept => (
                                                        <option key={dept} value={dept} className="bg-gray-900 text-white">{dept}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within/select:text-blue-400 transition-colors">
                                                    <Activity className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {(userRole === 'ADMIN' || issue.user_id === user.user_id) && (
                                    <button
                                        onClick={handleDeleteIssue}
                                        className="w-full py-3 px-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-500 font-medium border border-red-500/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Report
                                    </button>
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-4 text-center italic">
                                Last updated: {new Date(issue.updated_at || issue.created_at).toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetail;
