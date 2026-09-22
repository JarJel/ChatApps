import React, { useState, useEffect } from 'react';
import { X, User, AtSign, Phone, Image, FileText, Activity, Loader2, Check, Sparkles } from 'lucide-react';

export default function UserSettingsModal({ isOpen, onClose, currentUser, onUserUpdated }) {
    const [formData, setFormData] = useState({
        name: '',
        display_name: '',
        username: '',
        bio: '',
        phone: '',
        avatar_url: '',
        status: 'online',
        custom_status: '',
    });

    const [loading, setLoading] = useState(false);
    const [statusFeedback, setStatusFeedback] = useState({ type: '', message: '' });

    // Sync form data with current user when modal opens
    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                display_name: currentUser.display_name || '',
                username: currentUser.username || '',
                bio: currentUser.bio || '',
                phone: currentUser.phone || '',
                avatar_url: currentUser.avatar_url || '',
                status: currentUser.status || 'online',
                custom_status: currentUser.custom_status || '',
            });
            setStatusFeedback({ type: '', message: '' });
        }
    }, [currentUser, isOpen]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !currentUser) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleStatusSelect = (statusValue) => {
        setFormData({
            ...formData,
            status: statusValue,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusFeedback({ type: '', message: '' });

        const token = localStorage.getItem('auth_token');

        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatusFeedback({ type: 'success', message: 'Profil berhasil diperbarui!' });
                if (onUserUpdated && data.user) {
                    onUserUpdated(data.user);
                }
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                setStatusFeedback({ 
                    type: 'error', 
                    message: data.message || (data.errors ? Object.values(data.errors)[0][0] : 'Gagal memperbarui profil.') 
                });
            }
        } catch (err) {
            setStatusFeedback({ type: 'error', message: 'Terjadi kesalahan jaringan.' });
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: 'online', label: 'Online', color: 'bg-[#2ECC71]' },
        { value: 'away', label: 'Away / Istirahat', color: 'bg-amber-400' },
        { value: 'dnd', label: 'Jangan Ganggu (DND)', color: 'bg-rose-500' },
        { value: 'offline', label: 'Invisible / Offline', color: 'bg-slate-500' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Dialog Container */}
            <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
                    <div>
                        <h2 className="text-base font-bold text-slate-100">
                            Pengaturan Profil Pengguna
                        </h2>
                        <p className="text-xs text-slate-400">
                            Kelola tampilan publik, identitas, dan status aktif Anda.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Tutup (Esc)"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    
                    {/* Status Feedback Alert */}
                    {statusFeedback.message && (
                        <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
                            statusFeedback.type === 'success' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                            <span>{statusFeedback.message}</span>
                            <button type="button" onClick={() => setStatusFeedback({ type: '', message: '' })}>✕</button>
                        </div>
                    )}

                    {/* Avatar Preview & URL */}
                    <div className="flex items-center gap-4 p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-emerald-400 overflow-hidden shrink-0">
                            {formData.avatar_url ? (
                                <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                formData.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Avatar URL
                            </label>
                            <div className="relative">
                                <Image className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                                <input
                                    type="url"
                                    name="avatar_url"
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2ECC71]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Aktif Selector */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Status Aktif
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleStatusSelect(opt.value)}
                                    className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                                        formData.status === opt.value
                                            ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                    }`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.color}`} />
                                    <span className="truncate">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Status Quote */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Status Khusus (Custom Status)
                        </label>
                        <input
                            type="text"
                            name="custom_status"
                            value={formData.custom_status}
                            onChange={handleChange}
                            placeholder="Contoh: Coding Laravel & React 🚀"
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2ECC71]"
                        />
                    </div>

                    {/* Display Name & Username (Grid 2 Kolom) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Nama Tampilan (Display Name)
                            </label>
                            <input
                                type="text"
                                name="display_name"
                                value={formData.display_name}
                                onChange={handleChange}
                                placeholder="Nama panggilan Anda"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2ECC71]"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Username (@username)
                            </label>
                            <div className="relative">
                                <span className="text-slate-500 text-xs absolute left-3 top-2.5">@</span>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="username_unik"
                                    className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2ECC71]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Full Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nama lengkap asli"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2ECC71]"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Nomor Telepon
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="081234567890"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2ECC71]"
                            />
                        </div>
                    </div>

                    {/* Bio Textarea */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Tentang Saya (Bio)
                        </label>
                        <textarea
                            name="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Ceritakan sedikit tentang Anda..."
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2ECC71] resize-none"
                        />
                    </div>
                </form>

                {/* Modal Footer Actions */}
                <div className="px-6 py-3.5 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Simpan Perubahan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
