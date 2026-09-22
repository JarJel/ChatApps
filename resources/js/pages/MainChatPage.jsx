import React, { useState, useEffect } from 'react';
import ServerSidebar from '../components/ServerSidebar';
import ConversationSidebar from '../components/ConversationSidebar';
import FriendsDashboard from '../components/FriendsDashboard';
import UserSettingsModal from '../components/UserSettingsModal';
import UserSearchInput from '../components/UserSearchInput';
import UserProfileCard from '../components/UserProfileCard';

export default function MainChatPage({ user, onLogout, onUserUpdated }) {
    const [activeTab, setActiveTab] = useState('online'); // 'online' | 'all' | 'pending' | 'blocked' | 'add_friend'
    const [activeServerId, setActiveServerId] = useState(null); // null = Direct Messages / Home

    // Modals state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedProfileUser, setSelectedProfileUser] = useState(null);

    // Global shortcut Ctrl+K to open search dialog
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSendFriendRequest = async (targetId) => {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/friendships/request', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ addressee_id: targetId }),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Gagal mengirim permintaan');
        }
    };

    return (
        <div className="h-screen w-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans select-none">
            {/* Kolom 1: Navigasi Server */}
            <ServerSidebar 
                activeServerId={activeServerId} 
                onSelectServer={setActiveServerId}
                onOpenCreateServer={() => console.log('Open Create Server Modal')}
            />

            {/* Kolom 2: Percakapan & Teman */}
            <ConversationSidebar 
                activeTab={activeTab} 
                onSelectTab={setActiveTab} 
                user={user} 
                onLogout={onLogout}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Kolom 3: Dashboard Utama (Teman & Konten Aktif) */}
            <FriendsDashboard 
                activeTab={activeTab} 
                onSelectTab={setActiveTab} 
                currentUser={user}
                onOpenUserProfile={(targetUser) => setSelectedProfileUser(targetUser)}
            />

            {/* ================= MODALS & POPOVERS ================= */}

            {/* 1. Modal Pengaturan Profil User */}
            <UserSettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentUser={user}
                onUserUpdated={(updatedUser) => {
                    if (onUserUpdated) onUserUpdated(updatedUser);
                }}
            />

            {/* 2. Modal Quick Search User (Ctrl+K) */}
            <UserSearchInput 
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                currentUser={user}
                onSelectUser={(selected) => {
                    setSelectedProfileUser(selected);
                }}
            />

            {/* 3. Popover Detail Profil User */}
            <UserProfileCard 
                isOpen={!!selectedProfileUser}
                onClose={() => setSelectedProfileUser(null)}
                targetUser={selectedProfileUser}
                onSendFriendRequest={handleSendFriendRequest}
                onStartDirectMessage={(target) => {
                    console.log('Start DM with', target);
                }}
            />
        </div>
    );
}
