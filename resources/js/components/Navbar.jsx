import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function Navbar({ activeTab, onTabChange }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3.5 flex items-center justify-between transition-all duration-300">
            {/* Logo / Identitas Kiri Atas */}
            <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => onTabChange('login')}
            >
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#FBFBFA] group-hover:text-[#2ECC71] transition-colors duration-200">
                    Connect<span className="text-[#2ECC71]">.</span>
                </span>
            </div>

            {/* Navigasi Kanan Atas */}
            <nav className="flex items-center gap-2.5">
                <button
                    type="button"
                    onClick={() => onTabChange('login')}
                    className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2ECC71] ${
                        activeTab === 'login'
                            ? 'bg-[#2ECC71] text-slate-950 shadow-[0_0_15px_rgba(46,204,113,0.4)] hover:bg-[#27ae60]'
                            : 'text-[#FBFBFA] bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-500'
                    }`}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange('register')}
                    className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2ECC71] ${
                        activeTab === 'register'
                            ? 'bg-[#2ECC71] text-slate-950 shadow-[0_0_15px_rgba(46,204,113,0.4)] hover:bg-[#27ae60]'
                            : 'text-[#FBFBFA] bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-500'
                    }`}
                >
                    Register
                </button>
            </nav>
        </header>
    );
}
