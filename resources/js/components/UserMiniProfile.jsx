import React, { useState } from 'react';
import { Mic, MicOff, Headphones, Settings, LogOut } from 'lucide-react';

export default function UserMiniProfile({ user, onLogout, onOpenSettings }) {
    const [micMuted, setMicMuted] = useState(false);
    const [deafened, setDeafened] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    if (!user) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return 'bg-[#2ECC71]';
            case 'away':
                return 'bg-amber-400';
            case 'busy':
            case 'dnd':
                return 'bg-rose-500';
            default:
                return 'bg-slate-500';
        }
    };

    const handleConfirmLogout = () => {
        setShowLogoutConfirm(false);
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <>
            <div className="h-13 bg-slate-950/90 border-t border-slate-800/80 px-2.5 flex items-center justify-between select-none">
                {/* User Avatar + Name + Status */}
                <div 
                    onClick={onOpenSettings}
                    className="flex items-center gap-2.5 min-w-0 flex-1 p-1 -ml-1 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    title="Pengaturan Akun"
                >
                    {/* Avatar with Status Dot */}
                    <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center overflow-hidden border border-slate-700">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                            )}
                        </div>
                        <span 
                            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-slate-950 ${getStatusColor(user.status || 'online')}`} 
                        />
                    </div>

                    {/* Name & Custom Status */}
                    <div className="min-w-0 flex-1 leading-none space-y-1">
                        <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 truncate transition-colors">
                            {user.display_name || user.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                            {user.custom_status || `@${user.username || 'user'}`}
                        </div>
                    </div>
                </div>

                {/* Minimal Action Buttons */}
                <div className="flex items-center gap-0.5 shrink-0 text-slate-400">
                    <button
                        type="button"
                        onClick={() => setMicMuted(!micMuted)}
                        className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${micMuted ? 'text-rose-400' : 'hover:text-slate-200'}`}
                        title={micMuted ? 'Unmute' : 'Mute'}
                    >
                        {micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>

                    <button
                        type="button"
                        onClick={() => setDeafened(!deafened)}
                        className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${deafened ? 'text-rose-400' : 'hover:text-slate-200'}`}
                        title={deafened ? 'Undeafen' : 'Deafen'}
                    >
                        <Headphones className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={onOpenSettings}
                        className="p-1.5 rounded-md hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer"
                        title="Pengaturan Profil"
                    >
                        <Settings className="w-3.5 h-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(true)}
                        className="p-1.5 rounded-md hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Keluar"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* ========================================================
                MINIMALIST LOGOUT CONFIRMATION MODAL (Clean & Refined)
            ======================================================== */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
                    {/* Backdrop Click to Cancel */}
                    <div 
                        className="absolute inset-0" 
                        onClick={() => setShowLogoutConfirm(false)} 
                    />

                    {/* Modal Box */}
                    <div className="relative w-full max-w-xs bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl z-10 space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-100">
                                Keluar dari Akun?
                            </h3>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                Apakah Anda yakin ingin keluar dari <strong className="text-slate-200 font-medium">{user.display_name || user.name}</strong>?
                            </p>
                        </div>

                        {/* Minimal Actions */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
