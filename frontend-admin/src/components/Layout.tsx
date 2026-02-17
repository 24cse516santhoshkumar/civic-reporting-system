import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Moon, ArrowLeft, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const BACKGROUNDS = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
];

interface LayoutProps {
    children: React.ReactNode;
    userRole?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole }) => {
    const [currentBg, setCurrentBg] = useState(0);
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % BACKGROUNDS.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const isDashboard = location.pathname === '/dashboard';

    return (
        <div className={`min-h-screen relative flex flex-col overflow-hidden font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#0f172a]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBg}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
                        style={{ backgroundImage: `url(${BACKGROUNDS[currentBg]})` }}
                    />
                </AnimatePresence>
                {/* Overlay - Adjust based on theme */}
                <div className={`absolute inset-0 backdrop-blur-[2px] transition-colors duration-500 ${isDarkMode ? 'bg-black/80' : 'bg-white/40'}`}></div>
            </div>

            {/* Header */}
            <header className={`relative z-50 backdrop-blur-xl border-b shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/60 border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo / Back Button */}
                        <div className="flex items-center">
                            {!isDashboard ? (
                                <Link to="/dashboard" className="flex items-center space-x-3 mr-8 group">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10 group-hover:bg-white/20' : 'bg-black/5 group-hover:bg-black/10'}`}>
                                        <ArrowLeft className={`h-5 w-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
                                    </div>
                                    <span className={`text-xl font-bold tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Back to Dashboard
                                    </span>
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="flex items-center space-x-3 mr-8">
                                    <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <span className={`text-xl font-bold tracking-wider hidden sm:block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        CIVIC{userRole === 'ADMIN' && <span className="text-blue-500 font-light">ADMIN</span>}
                                    </span>
                                </Link>
                            )}
                        </div>

                        {/* Desktop Nav & Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isDashboard && (
                                <nav className="flex space-x-2 mr-4">

                                    {userRole === 'ADMIN' && (
                                        <Link to="/users" className={`px-4 py-2 rounded-lg transition-colors font-medium ${isDarkMode ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'}`}>
                                            Users
                                        </Link>
                                    )}
                                    <Link to="/profile" className={`px-4 py-2 rounded-lg transition-colors font-medium ${isDarkMode ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'}`}>
                                        Profile
                                    </Link>
                                    <Link to="/monitor" className={`px-4 py-2 rounded-lg transition-colors font-medium ${isDarkMode ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'}`}>
                                        Monitor
                                    </Link>
                                </nav>
                            )}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-black/5 text-gray-700 hover:bg-black/10'}`}
                                aria-label="Toggle Theme"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <button
                                onClick={handleLogout}
                                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                                aria-label="Logout"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`md:hidden border-t ${isDarkMode ? 'border-white/10 bg-black/40' : 'border-gray-200 bg-white/60'} backdrop-blur-xl`}
                        >
                            <div className="px-4 pt-2 pb-4 space-y-1">

                                {userRole === 'ADMIN' && (
                                    <Link to="/users" className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}>
                                        Users
                                    </Link>
                                )}
                                <button
                                    onClick={toggleTheme}
                                    className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
                                >
                                    {isDarkMode ? <Sun size={18} className="mr-2 text-yellow-400" /> : <Moon size={18} className="mr-2 text-gray-600" />}
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/10`}
                                >
                                    <LogOut size={18} className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header >

            <main className="flex-1 overflow-x-hidden overflow-y-auto relative z-10 px-4 sm:px-6 py-8 custom-scrollbar">
                {children}
            </main>
        </div >
    );
};

export default Layout;
