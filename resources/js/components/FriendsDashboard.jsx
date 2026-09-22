import React, { useState, useEffect } from 'react';
import { 
    Users, 
    UserPlus, 
    Inbox, 
    HelpCircle, 
    Check, 
    X, 
    MessageSquare, 
    MoreVertical, 
    ShieldAlert, 
    Loader2 
} from 'lucide-react';

export default function FriendsDashboard({ activeTab, onSelectTab, currentUser, onOpenUserProfile }) {
    const [addFriendInput, setAddFriendInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [addFriendStatus, setAddFriendStatus] = useState({ type: '', message: '' });
    const [sentRequestUserIds, setSentRequestUserIds] = useState([]);
    const [sendingUserId, setSendingUserId] = useState(null);
    
    // Data list pertemanan
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Ambil daftar pertemanan saat komponen dimuat
    const fetchFriendships = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        try {
            const res = await fetch('/api/friendships', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            if (res.ok) {
                const data = await res.json();
                setFriends(data.friends || []);
                setPendingRequests(data.pending_requests || []);
            }
        } catch (err) {
            console.error('Failed to load friendships:', err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchFriendships();
    }, [activeTab]);

    // Live Search User
    const handleSearchUsers = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoadingSearch(true);
        const token = localStorage.getItem('auth_token');
        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.users?.data || data.users || []);
            }
        } catch (err) {
            console.error('Search user error:', err);
        } finally {
            setLoadingSearch(false);
        }
    };

    // Kirim Permintaan Pertemanan
    const handleSendFriendRequest = async (targetId) => {
        const token = localStorage.getItem('auth_token');
        setSendingUserId(targetId);
        setAddFriendStatus({ type: 'loading', message: 'Mengirim permintaan pertemanan...' });

        try {
            const res = await fetch('/api/friendships/request', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ addressee_id: targetId }),
            });

            const data = await res.json();
            if (res.ok) {
                setSentRequestUserIds((prev) => [...prev, targetId]);
                setAddFriendStatus({ 
                    type: 'success', 
                    message: data.message || 'Permintaan pertemanan berhasil dikirim!' 
                });
                fetchFriendships();
            } else {
                setAddFriendStatus({ 
                    type: 'error', 
                    message: data.error?.addressee_id?.[0] || data.error || data.message || 'Gagal mengirim permintaan pertemanan.' 
                });
            }
        } catch (err) {
            setAddFriendStatus({ type: 'error', message: 'Terjadi kesalahan koneksi.' });
        } finally {
            setSendingUserId(null);
        }
    };

    // Terima Permintaan Pertemanan
    const handleAcceptRequest = async (friendshipId) => {
        const token = localStorage.getItem('auth_token');
        try {
            const res = await fetch(`/api/friendships/${friendshipId}/accept`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (res.ok) {
                fetchFriendships();
            }
        } catch (err) {
            console.error('Accept request error:', err);
        }
    };

    // Tolak / Batalkan Permintaan Pertemanan
    const handleRejectRequest = async (friendshipId) => {
        const token = localStorage.getItem('auth_token');
        try {
            const res = await fetch(`/api/friendships/${friendshipId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (res.ok) {
                fetchFriendships();
            }
        } catch (err) {
            console.error('Reject request error:', err);
        }
    };

    // Helper untuk mengambil objek user teman dari baris relasi
    const getFriendUser = (f) => {
        if (!currentUser) return f.requester || f.addressee;
        return f.requester_id === currentUser.id ? f.addressee : f.requester;
    };

    // Filter daftar teman sesuai tab aktif
    const onlineFriends = friends.filter((f) => {
        const u = getFriendUser(f);
        return u?.status === 'online' || u?.status === 'away';
    });

    const displayedFriends = activeTab === 'online' ? onlineFriends : friends;

    return (
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden select-none">
            {/* Header Topbar */}
            <header className="h-14 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-950/50 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-200 border-r border-slate-800 pr-4">
                        <Users className="w-5 h-5 text-slate-400" />
                        <span>Teman</span>
                    </div>

                    {/* Sub-Tabs Nav */}
                    <div className="flex items-center gap-1">
                        {[
                            { id: 'online', label: `Online (${onlineFriends.length})` },
                            { id: 'all', label: `Semua (${friends.length})` },
                            { id: 'pending', label: `Menunggu (${pendingRequests.length})` },
                            { id: 'blocked', label: 'Diblokir' },
                        ].map((tab) => (
                            <button
                                type="button"
                                key={tab.id}
                                onClick={() => onSelectTab(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => onSelectTab('add_friend')}
                            className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'add_friend'
                                    ? 'bg-[#2ECC71] text-slate-950 shadow-[0_0_12px_rgba(46,204,113,0.3)]'
                                    : 'bg-[#2ECC71]/15 text-[#2ECC71] hover:bg-[#2ECC71] hover:text-slate-950'
                            }`}
                        >
                            Tambah Teman
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                    <Inbox className="w-5 h-5 hover:text-slate-200 cursor-pointer" />
                    <HelpCircle className="w-5 h-5 hover:text-slate-200 cursor-pointer" />
                </div>
            </header>

            {/* Main Content View */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'add_friend' ? (
                    /* ================= TAB: TAMBAH TEMAN ================= */
                    <div className="max-w-2xl">
                        <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide mb-1">
                            Tambah Teman
                        </h2>
                        <p className="text-slate-400 text-xs mb-4">
                            Ketik nama atau @username untuk mencari dan mengirim permintaan pertemanan.
                        </p>

                        {/* Search Input Form */}
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearchUsers(addFriendInput);
                            }}
                            className="relative mb-6"
                        >
                            <div className="flex items-center bg-slate-900 border border-slate-800 focus-within:border-[#2ECC71] rounded-2xl px-4 py-2 transition-all shadow-inner">
                                <input
                                    type="text"
                                    value={addFriendInput}
                                    onChange={(e) => {
                                        setAddFriendInput(e.target.value);
                                        handleSearchUsers(e.target.value);
                                    }}
                                    placeholder="Ketik username atau nama user..."
                                    className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_10px_rgba(46,204,113,0.2)] transition-colors cursor-pointer shrink-0"
                                >
                                    Cari
                                </button>
                            </div>

                            {/* Status Alert Notification */}
                            {addFriendStatus.message && (
                                <div className={`mt-3 p-3 rounded-xl text-xs flex items-center justify-between ${
                                    addFriendStatus.type === 'success' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                }`}>
                                    <span>{addFriendStatus.message}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setAddFriendStatus({ type: '', message: '' })} 
                                        className="font-bold cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* Search Results */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Hasil Pencarian {searchResults.length > 0 && `(${searchResults.length})`}
                            </h3>

                            {loadingSearch && (
                                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-4">
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                    <span>Mencari pengguna...</span>
                                </div>
                            )}

                            {!loadingSearch && searchResults.length === 0 && addFriendInput && (
                                <div className="text-slate-500 text-xs py-4 text-center">
                                    Tidak ada pengguna yang cocok dengan "{addFriendInput}".
                                </div>
                            )}

                            {searchResults.map((usr) => (
                                <div
                                    key={usr.id}
                                    className="p-3 bg-slate-900/60 border border-slate-800/70 hover:border-slate-700 rounded-2xl flex items-center justify-between transition-colors group"
                                >
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 mr-2"
                                        onClick={() => onOpenUserProfile && onOpenUserProfile(usr)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-emerald-400 overflow-hidden shrink-0">
                                            {usr.avatar_url ? (
                                                <img src={usr.avatar_url} alt={usr.name} className="w-full h-full object-cover" />
                                            ) : (
                                                usr.name?.charAt(0).toUpperCase() || 'U'
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 truncate group-hover:text-emerald-400 transition-colors">
                                                <span>{usr.display_name || usr.name}</span>
                                                <span className="text-xs text-slate-400 font-normal font-mono">@{usr.username || 'user'}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 truncate">
                                                {usr.bio || usr.custom_status || usr.status || 'Connect Member'}
                                            </div>
                                        </div>
                                    </div>

                                    {usr.id !== currentUser?.id && (
                                        sentRequestUserIds.includes(usr.id) ? (
                                            <span className="px-3.5 py-1.5 bg-slate-800 text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-500/30 flex items-center gap-1.5 cursor-default select-none shrink-0">
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Permintaan Terkirim</span>
                                            </span>
                                        ) : sendingUserId === usr.id ? (
                                            <button
                                                type="button"
                                                disabled
                                                className="px-3.5 py-1.5 bg-[#2ECC71]/50 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-not-allowed shrink-0"
                                            >
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Mengirim...</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSendFriendRequest(usr.id)}
                                                className="px-3.5 py-1.5 bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                <span>Tambah Teman</span>
                                            </button>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'pending' ? (
                    /* ================= TAB: MENUNGGU (PENDING REQUESTS) ================= */
                    <div className="max-w-2xl space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Permintaan Pertemanan Masuk ({pendingRequests.length})
                        </h3>

                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-xs">
                                Tidak ada permintaan pertemanan yang tertunda.
                            </div>
                        ) : (
                            pendingRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between"
                                >
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 mr-2"
                                        onClick={() => onOpenUserProfile && onOpenUserProfile(req.requester)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-emerald-400 shrink-0">
                                            {req.requester?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-slate-100 truncate hover:text-emerald-400 transition-colors">
                                                {req.requester?.display_name || req.requester?.name}
                                            </div>
                                            <div className="text-xs text-slate-400 truncate">
                                                @{req.requester?.username || 'user'} • Permintaan Masuk
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleAcceptRequest(req.id)}
                                            className="p-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                                            title="Terima Permintaan"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRejectRequest(req.id)}
                                            className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                                            title="Tolak Permintaan"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* ================= TAB: ONLINE & SEMUA TEMAN ================= */
                    <div className="max-w-3xl space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            {activeTab === 'online' ? `Teman Online (${onlineFriends.length})` : `Semua Teman (${friends.length})`}
                        </h3>

                        {displayedFriends.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 text-slate-600 border border-slate-800">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-1">
                                    {activeTab === 'online' ? 'Tidak ada teman yang sedang online' : 'Belum memiliki teman'}
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm">
                                    Klik tombol Tambah Teman di atas untuk mulai mencari dan terhubung dengan rekan Anda.
                                </p>
                            </div>
                        ) : (
                            displayedFriends.map((f) => {
                                const friendUser = getFriendUser(f);
                                if (!friendUser) return null;

                                return (
                                    <div
                                        key={f.id}
                                        className="p-3 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl flex items-center justify-between transition-colors group cursor-pointer"
                                    >
                                        <div 
                                            className="flex items-center gap-3 min-w-0 flex-1 mr-2"
                                            onClick={() => onOpenUserProfile && onOpenUserProfile(friendUser)}
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-emerald-400 overflow-hidden">
                                                    {friendUser.avatar_url ? (
                                                        <img src={friendUser.avatar_url} alt={friendUser.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        friendUser.name?.charAt(0).toUpperCase() || 'U'
                                                    )}
                                                </div>
                                                <span 
                                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-slate-950 ${
                                                        friendUser.status === 'online' ? 'bg-[#2ECC71]' : 'bg-slate-500'
                                                    }`} 
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 truncate group-hover:text-emerald-400 transition-colors">
                                                    <span>{friendUser.display_name || friendUser.name}</span>
                                                    <span className="text-xs text-slate-500 font-mono">@{friendUser.username || 'user'}</span>
                                                </div>
                                                <div className="text-xs text-slate-400 truncate">
                                                    {friendUser.custom_status || (friendUser.status === 'online' ? 'Online' : 'Offline')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions (Message) */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => onOpenUserProfile && onOpenUserProfile(friendUser)}
                                                className="p-2 bg-slate-800 hover:bg-[#2ECC71] hover:text-slate-950 text-slate-300 rounded-xl transition-all cursor-pointer"
                                                title="Lihat Profil / Pesan"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
