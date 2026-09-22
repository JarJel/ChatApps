import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus } from 'lucide-react';

export default function ServerSidebar({ activeServerId, onSelectServer, onOpenCreateServer }) {
    const [servers, setServers] = useState([]);

    useEffect(() => {
        const fetchServers = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const res = await fetch('/api/servers', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setServers(data.servers || []);
                }
            } catch (err) {
                console.error('Failed to load servers:', err);
            }
        };

        fetchServers();
    }, []);

    return (
        <nav className="w-[72px] shrink-0 bg-slate-950 flex flex-col items-center py-3 gap-2 border-r border-slate-900/80 z-20">
            {/* Home / Direct Messages Button */}
            <button
                type="button"
                onClick={() => onSelectServer(null)}
                className={`relative group w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    activeServerId === null
                        ? 'bg-[#2ECC71] text-slate-950 rounded-2xl shadow-[0_0_15px_rgba(46,204,113,0.4)]'
                        : 'bg-slate-900 text-slate-300 hover:bg-[#2ECC71] hover:text-slate-950 hover:rounded-2xl rounded-3xl'
                }`}
                title="Direct Messages"
            >
                {/* Active Pill Indicator */}
                <span 
                    className={`absolute -left-3 w-1 bg-white rounded-r-full transition-all duration-300 ${
                        activeServerId === null ? 'h-10' : 'h-2 group-hover:h-5'
                    }`} 
                />
                <MessageSquare className="w-6 h-6" />
            </button>

            {/* Separator */}
            <div className="w-8 h-[2px] bg-slate-800 rounded-full my-1" />

            {/* Server List */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2 no-scrollbar">
                {servers.map((srv) => {
                    const isActive = activeServerId === srv.id;
                    return (
                        <button
                            type="button"
                            key={srv.id}
                            onClick={() => onSelectServer(srv.id)}
                            className={`relative group w-12 h-12 flex items-center justify-center transition-all duration-300 cursor-pointer font-bold text-sm overflow-hidden ${
                                isActive
                                    ? 'bg-emerald-600 text-white rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-900 text-slate-300 hover:bg-emerald-600 hover:text-white rounded-3xl hover:rounded-2xl'
                            }`}
                            title={srv.name}
                        >
                            <span 
                                className={`absolute -left-3 w-1 bg-white rounded-r-full transition-all duration-300 ${
                                    isActive ? 'h-10' : 'h-2 group-hover:h-5'
                                }`} 
                            />
                            {srv.icon_url ? (
                                <img src={srv.icon_url} alt={srv.name} className="w-full h-full object-cover" />
                            ) : (
                                srv.name.substring(0, 2).toUpperCase()
                            )}
                        </button>
                    );
                })}

                {/* Add Server Button */}
                <button
                    type="button"
                    onClick={onOpenCreateServer}
                    className="w-12 h-12 rounded-3xl hover:rounded-2xl bg-slate-900 hover:bg-[#2ECC71] text-[#2ECC71] hover:text-slate-950 flex items-center justify-center transition-all duration-200 cursor-pointer group"
                    title="Tambah Server Baru"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
                </button>
            </div>
        </nav>
    );
}
