import React from 'react';
import { Users, UserPlus, Search, Plus } from 'lucide-react';
import UserMiniProfile from './UserMiniProfile';

export default function ConversationSidebar({ activeTab, onSelectTab, user, onLogout, onOpenSettings, onOpenSearch }) {
    return (
        <aside className="w-64 shrink-0 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between z-10 select-none">
            {/* Search Bar / Quick Finder Button */}
            <div className="p-3 border-b border-slate-800/80">
                <button 
                    type="button"
                    onClick={onOpenSearch}
                    className="w-full h-8 px-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-xs flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5" />
                        <span>Cari atau mulai chat...</span>
                    </span>
                    <kbd className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500">Ctrl K</kbd>
                </button>
            </div>

            {/* Navigation Menu (Friends & Direct Messages) */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
                {/* Friends Tab Button */}
                <button
                    type="button"
                    onClick={() => onSelectTab('online')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                        activeTab !== 'add_friend'
                            ? 'bg-slate-800 text-emerald-400'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    <span>Teman</span>
                </button>

                {/* Add Friend Shortcut */}
                <button
                    type="button"
                    onClick={() => onSelectTab('add_friend')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                        activeTab === 'add_friend'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                    }`}
                >
                    <UserPlus className="w-4 h-4 text-[#2ECC71]" />
                    <span>Tambah Teman</span>
                </button>

                {/* Direct Messages Section Header */}
                <div className="pt-4 pb-1 px-3 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Pesan Langsung</span>
                    <Plus className="w-3.5 h-3.5 hover:text-slate-200 cursor-pointer" />
                </div>

                {/* Empty State / Recent DMs List */}
                <div className="text-center py-6 px-4 text-slate-500 text-xs">
                    Belum ada percakapan langsung aktif. Tambahkan teman untuk memulai mengobrol!
                </div>
            </div>

            {/* User Mini Profile (Bagian Bawah Kolom 2) */}
            <UserMiniProfile 
                user={user} 
                onLogout={onLogout}
                onOpenSettings={onOpenSettings}
            />
        </aside>
    );
}
