import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import MainChatPage from './pages/MainChatPage';

export default function MainApp() {
    const [user, setUser] = useState(() => {
        const cached = localStorage.getItem('user_data');
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(true);

    // Verifikasi Token dan Ambil Profil User Terbaru dari Backend saat Aplikasi Dimuat
    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    localStorage.setItem('user_data', JSON.stringify(data.user));
                } else {
                    // Token expired / tidak valid
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth verification error:', err);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const handleLoginSuccess = (userData, token) => {
        setUser(userData);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
    };

    const handleUserUpdated = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen w-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-100 font-sans">
                <div className="w-10 h-10 border-3 border-[#2ECC71]/20 border-t-[#2ECC71] rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-medium tracking-wide">Memuat Connect...</span>
            </div>
        );
    }

    return user ? (
        <MainChatPage 
            user={user} 
            onLogout={handleLogout} 
            onUserUpdated={handleUserUpdated}
        />
    ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
    );
}
