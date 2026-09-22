import React, { useState } from 'react';
import { X, MessageSquare, UserPlus, ShieldAlert, Check, Loader2, Phone, Calendar, AtSign, User } from 'lucide-react';

export default function UserProfileCard({ isOpen, onClose, targetUser, isFriend, isPending, onSendFriendRequest, onStartDirectMessage }) {
    const [sendingRequest, setSendingRequest] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    if (!isOpen || !targetUser) return null;

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

    const getStatusLabel = (status) => {
        switch (status) {
            case 'online':
                return 'Online';
            case 'away':
                return 'Away / Istirahat';
            case 'busy':
            case 'dnd':
                return 'Jangan Ganggu';
            default:
                return 'Offline';
        }
    };

    const handleSendRequest = async () => {
        if (!onSendFriendRequest || sendingRequest || requestSent) return;
        setSendingRequest(true);
        try {
            await onSendFriendRequest(targetUser.id);
            setRequestSent(true);
        } catch (e) {
            console.error(e);
        } finally {
            setSendingRequest(false);
        }
    };

    const formattedJoinDate = targetUser.created_at 
        ? new Date(targetUser.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Profile Card Container */}
            <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden">
                
                {/* Header Banner */}
                <div className="h-20 bg-gradient-to-r from-emerald-600/30 via-slate-800 to-slate-900 border-b border-slate-800 relative">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/60 text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors cursor-pointer"
                        title="Tutup"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Avatar & Main Info */}
                <div className="px-5 pb-5 -mt-10">
                    <div className="relative inline-block mb-3">
                        <div className="w-20 h-20 rounded-full bg-slate-800 border-4 border-slate-900 overflow-hidden flex items-center justify-center font-bold text-xl text-emerald-400 shadow-md">
                            {targetUser.avatar_url ? (
                                <img src={targetUser.avatar_url} alt={targetUser.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{targetUser.name ? targetUser.name.charAt(0).toUpperCase() : 'U'}</span>
                            )}
                        </div>
                        <span 
                            className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-3 ring-slate-900 ${getStatusColor(targetUser.status || 'online')}`} 
                            title={getStatusLabel(targetUser.status || 'online')}
                        />
                    </div>

                    {/* Names & Tag */}
                    <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                            {targetUser.display_name || targetUser.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">
                            @{targetUser.username || 'user'}
                        </p>
                    </div>

                    {/* Custom Status Quote if present */}
                    {targetUser.custom_status && (
                        <div className="mt-3 px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 italic">
                            "{targetUser.custom_status}"
                        </div>
                    )}

                    <hr className="my-4 border-slate-800/80" />

                    {/* Bio & Details Section */}
                    <div className="space-y-3 text-xs">
                        {targetUser.bio && (
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Tentang Saya
                                </h4>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                    {targetUser.bio}
                                </p>
                            </div>
                        )}

                        <div className="space-y-1.5 pt-1">
                            {targetUser.phone && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{targetUser.phone}</span>
                                </div>
                            )}

                            {formattedJoinDate && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Bergabung sejak {formattedJoinDate}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 flex items-center gap-2">
                        {isFriend ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (onStartDirectMessage) onStartDirectMessage(targetUser);
                                    onClose();
                                }}
                                className="flex-1 py-2 px-3 bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Kirim Pesan</span>
                            </button>
                        ) : isPending || requestSent ? (
                            <button
                                type="button"
                                disabled
                                className="flex-1 py-2 px-3 bg-slate-800 text-slate-400 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                            >
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Permintaan Dikirim</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSendRequest}
                                disabled={sendingRequest}
                                className="flex-1 py-2 px-3 bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            >
                                {sendingRequest ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Mengirim...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-3.5 h-3.5" />
                                        <span>Tambah Teman</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
