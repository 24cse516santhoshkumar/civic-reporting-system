import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Phone, Mail, Calendar, UserPlus, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

const UsersList = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Form state for new admin
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPass, setNewAdminPass] = useState('');
    const [newAdminPhone, setNewAdminPhone] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);

            // STRICT SECURITY: Only Admins can view this page
            if (user.role !== 'ADMIN') {
                window.location.href = '/dashboard'; // Force redirect
                return;
            }
        } else {
            window.location.href = '/login';
        }
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:3000/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error("Failed to fetch users", err))
            .finally(() => setLoading(false));
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/auth/register-admin', {
                email: newAdminEmail,
                password: newAdminPass,
                phone: newAdminPhone
            }, {
                headers: { Authorization: `Bearer ${token} ` }
            });
            alert('New Admin Created Successfully!');
            setShowModal(false);
            setNewAdminEmail('');
            setNewAdminPass('');
            fetchUsers();
        } catch (err: any) {
            console.error(err);
            alert('Failed to create admin. Ensure you have permissions or email is unique.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout userRole={currentUser?.role}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white text-gray-900 tracking-tight">User Management</h1>
                        <p className="dark:text-gray-400 text-gray-600 mt-1">Manage system users and administrators.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 dark:text-gray-400 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="dark:bg-white/10 bg-white border dark:border-white/10 border-gray-200 rounded-xl pl-10 pr-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:border-blue-500 w-64 shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all font-bold"
                        >
                            <UserPlus size={18} />
                            <span>Create New Admin</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/60 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="min-w-full divide-y dark:divide-white/10 divide-gray-200">
                        <thead className="dark:bg-black/20 bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-white/10 divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center dark:text-gray-400 text-gray-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user.user_id} className="dark:hover:bg-white/5 hover:bg-black/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-sm font-bold text-white">{user.email?.[0].toUpperCase()}</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium dark:text-white text-gray-900">{user.email}</div>
                                                <div className="text-xs text-gray-500">{user.provider}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${user.role === 'ADMIN'
                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                            : 'bg-green-500/10 text-green-400 border-green-500/20'
                                            } `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400 text-gray-500">
                                        <div className="flex flex-col space-y-1">
                                            <span className="flex items-center"><Mail size={12} className="mr-2 opacity-70" /> {user.email}</span>
                                            <span className="flex items-center"><Phone size={12} className="mr-2 opacity-70" /> {user.phone_number || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400 text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-2 opacity-70" />
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => window.location.href = `/users/${user.user_id || user.id}`}
                                            className="text-blue-400 hover:text-blue-300 transition-colors mr-3"
                                        >
                                            View
                                        </button>
                                        {currentUser?.role === 'ADMIN' && (
                                            <button
                                                onClick={async () => {
                                                    const userId = user.user_id || user.id;
                                                    if (window.confirm(`Are you sure you want to delete user ${user.email}? This action cannot be undone.`)) {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            console.log(`Attempting to delete user: ${userId}`);
                                                            await axios.delete(`http://localhost:3000/users/${userId}`, {
                                                                headers: { Authorization: `Bearer ${token}` }
                                                            });
                                                            alert('User deleted successfully');
                                                            fetchUsers();
                                                        } catch (err: any) {
                                                            console.error("Deletion error details:", err.response?.data || err.message);
                                                            alert(`Failed to delete user: ${err.response?.data?.message || err.message}`);
                                                        }
                                                    }
                                                }}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredUsers.length === 0 && (
                        <div className="p-8 text-center dark:text-gray-400 text-gray-500">No users found matching your search.</div>
                    )}
                </div>

                {/* Create Admin Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-white dark:bg-gray-900 border dark:border-white/10 border-gray-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                            >
                                <div className="flex justify-between items-center px-6 py-4 border-b dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50">
                                    <h3 className="text-xl font-bold dark:text-white text-gray-900">Create Admin Account</h3>
                                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                                        <Shield className="inline-block w-4 h-4 mr-1 mb-0.5 text-blue-400" />
                                        This user will have full administrative privileges.
                                    </p>

                                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Email</label>
                                            <input
                                                required
                                                type="email"
                                                value={newAdminEmail}
                                                onChange={e => setNewAdminEmail(e.target.value)}
                                                className="w-full dark:bg-black/20 bg-gray-50 border dark:border-white/10 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Phone</label>
                                            <input
                                                required
                                                type="tel"
                                                value={newAdminPhone}
                                                onChange={e => setNewAdminPhone(e.target.value)}
                                                className="w-full dark:bg-black/20 bg-gray-50 border dark:border-white/10 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Password</label>
                                            <input
                                                required
                                                type="password"
                                                value={newAdminPass}
                                                onChange={e => setNewAdminPass(e.target.value)}
                                                className="w-full dark:bg-black/20 bg-gray-50 border dark:border-white/10 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 transition-all font-bold"
                                        >
                                            Create Admin
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default UsersList;
