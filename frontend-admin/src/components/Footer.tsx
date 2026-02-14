import { Shield } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative z-50 border-t border-white/5 bg-black/40 backdrop-blur-xl py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">CivicConnect</span>
                    </div>
                    <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] max-w-xs text-center md:text-left leading-relaxed">
                        A tactical utility for urban infrastructure management. v2.0.0-PROCORE
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Network Control</div>
                    <p className="text-gray-400 text-sm font-medium">
                        &copy; 2026 Civic Reporting System.
                    </p>
                    <p className="font-mono text-cyan-500/60 text-xs mt-1 hover:text-cyan-400 transition-colors uppercase cursor-pointer">
                        core.node_01@civic.auth
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
