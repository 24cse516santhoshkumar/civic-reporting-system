import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Mail, Phone, Shield, Calendar, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const BACKGROUNDS = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80'
];

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>({
        email: '',
        phone_number: '',
        role: '',
        user_id: '',
        created_at: new Date().toISOString()
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentBg, setCurrentBg] = useState(0);
    const [deleting, setDeleting] = useState(false);

    // Get logged in user to check permissions
    const loggedInUserStr = localStorage.getItem('user');
    const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

    const handleDelete = async () => {
        const userId = userData.user_id || userData.id || id;

        if (!userId) {
            alert("Error: No user ID found to delete.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete user ${userData.email || 'this user'}? This action cannot be undone.`)) {
            return;
        }

        setDeleting(true);
        try {
            console.log(`Attempting to delete user: ${userId}`);
            await api.delete(`/users/${userId}`);
            alert("User deleted successfully.");
            navigate('/users'); // Navigate back to the list
        } catch (error: any) {
            console.error("Failed to delete user", error.response?.data || error.message);
            alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % BACKGROUNDS.length);
        }, 12000);

        const fetchUser = async () => {
            try {
                const targetId = id || (loggedInUser?.id || loggedInUser?.user_id);

                if (targetId) {
                    // 1. Try fetching from API
                    try {
                        const res = await api.get(`/users/${targetId}`);
                        setUserData(res.data);
                    } catch (apiErr) {
                        console.warn("API unavailable, falling back to local storage/mock", apiErr);
                        // 2. Fallback: Use loggedInUser data if IDs match or if it's 'me'
                        if (loggedInUser && (loggedInUser.id === targetId || loggedInUser.user_id === targetId || !id)) {
                            setUserData({
                                ...loggedInUser,
                                phone_number: loggedInUser.phone_number || loggedInUser.phone || 'Not provided',
                                created_at: loggedInUser.created_at || new Date().toISOString()
                            });
                        } else {
                            // 3. Mock Data Last Resort
                            setUserData({
                                email: 'citizen@example.com',
                                phone_number: '+1 (555) 000-0000',
                                role: 'CITIZEN',
                                user_id: targetId || 'user-123',
                                created_at: new Date().toISOString()
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        return () => clearInterval(interval);
    }, [id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Mock API Call delay
        await new Promise(r => setTimeout(r, 800));

        try {
            // Try Real API
            if (userData.user_id) {
                await api.patch(`/users/${userData.user_id}`, {
                    phone_number: userData.phone_number,
                    email: userData.email,
                });
            }

            // Update Local Storage if it's the current user
            if (loggedInUser && (loggedInUser.id === userData.user_id || loggedInUser.user_id === userData.user_id)) {
                const updatedUser = { ...loggedInUser, email: userData.email, phone_number: userData.phone_number, phone: userData.phone_number };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            alert('Profile Updated Successfully!');
        } catch (err) {
            console.error("Save failed, but updating local state for demo", err);
            // Demo Fallback
            if (loggedInUser) {
                const updatedUser = { ...loggedInUser, email: userData.email, phone_number: userData.phone_number, phone: userData.phone_number };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('Profile Updated (Local)!');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const canEdit = true; // Allow editing for demo purposes mostly

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
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-gray-400 mt-2">Manage your account details and preferences.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="md:flex">
                        {/* Sidebar / Avatar Section */}
                        <div className="md:w-1/3 bg-black/20 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-white/10">
                            <div className="relative mb-6">
                                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-1 shadow-xl shadow-blue-500/20">
                                    <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center text-white text-5xl font-bold">
                                        {userData.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors shadow-lg border border-gray-900">
                                    <Camera className="h-4 w-4 text-white" />
                                </button>
                            </div>

                            <h2 className="text-xl font-bold text-white text-center break-all">{userData.email || 'User'}</h2>
                            <div className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30">
                                {userData.role || 'CITIZEN'}
                            </div>

                            <div className="mt-8 w-full space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pass Score</div>
                                    <div className="text-2xl font-bold text-green-400">98%</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reports</div>
                                    <div className="text-2xl font-bold text-blue-400">12</div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="md:w-2/3 p-8">
                            <form onSubmit={handleSave} className="space-y-6">
                                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4 mb-6">
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                type="email"
                                                value={userData.email || ''}
                                                onChange={e => setUserData({ ...userData, email: e.target.value })}
                                                disabled={!canEdit}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                type="tel"
                                                value={userData.phone_number || ''}
                                                onChange={e => setUserData({ ...userData, phone_number: e.target.value })}
                                                disabled={!canEdit}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                                            <div className="relative">
                                                <Shield className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={userData.role || ''}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Joined Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={new Date(userData.created_at).toLocaleDateString()}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-between">
                                    {loggedInUser?.role === 'ADMIN' && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={deleting || !canEdit}
                                            className="flex items-center px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold transition-all disabled:opacity-50"
                                        >
                                            <Trash2 className="h-5 w-5 mr-2" />
                                            {deleting ? 'Deleting...' : 'Delete User'}
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={saving || !canEdit}
                                        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default UserProfile;
