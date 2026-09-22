import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, UserPlus, MessageSquare, User, Check } from 'lucide-react';

export default function UserSearchInput({ isOpen, onClose, onSelectUser, currentUser }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Handle ESC to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Debounced search (300ms)
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            const token = localStorage.getItem('auth_token');
            try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(query.trim())}&limit=8`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    const list = data.users?.data || data.users || [];
                    // Exclude current user from search result list if present
                    setResults(list.filter(u => u.id !== currentUser?.id));
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, currentUser?.id]);

    if (!isOpen) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-[#2ECC71]';
            case 'away': return 'bg-amber-400';
            case 'busy':
            case 'dnd': return 'bg-rose-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Quick Search Dialog */}
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col">
                
                {/* Search Bar Input */}
                <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ketik nama pengguna atau @username..."
                        className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                    {loading && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />}
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            className="p-1 rounded text-slate-500 hover:text-slate-300"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">ESC</kbd>
                </div>

                {/* Results List */}
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                    {query.trim() === '' ? (
                        <div className="py-8 text-center text-xs text-slate-500">
                            Cari teman baru berdasarkan nama atau username.
                        </div>
                    ) : loading ? (
                        <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                            <span>Mencari pengguna...</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500">
                            Tidak ditemukan pengguna yang cocok dengan "<span className="text-slate-300">{query}</span>".
                        </div>
                    ) : (
                        results.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => {
                                    if (onSelectUser) onSelectUser(user);
                                    onClose();
                                }}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative shrink-0">
                                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 overflow-hidden">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                                            )}
                                        </div>
                                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${getStatusColor(user.status || 'online')}`} />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                                            {user.display_name || user.name}
                                        </div>
                                        <div className="text-[11px] text-slate-500 font-mono truncate">
                                            @{user.username || 'user'}
                                        </div>
                                    </div>
                                </div>

                                <span className="text-[11px] font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                                    Lihat Profil →
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Quick Hint Footer */}
                <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Gunakan <kbd className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">↑</kbd> <kbd className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">↓</kbd> untuk navigasi</span>
                    <span>Tekan <kbd className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">ESC</kbd> untuk menutup</span>
                </div>
            </div>
        </div>
    );
}
