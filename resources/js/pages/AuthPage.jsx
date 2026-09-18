import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroHeadline from '../components/HeroHeadline';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' atau 'register'

    return (
        <div className="relative min-h-screen w-full font-sans bg-slate-950 text-slate-100 flex flex-col justify-between">
            {/* Transparent Navbar */}
            <Navbar 
                activeTab={activeTab} 
                onTabChange={(tab) => setActiveTab(tab)} 
            />

            {/* Main Section dengan Background Image */}
            <main 
                className="relative flex-1 w-full min-h-screen flex items-center pt-20 pb-10 px-6 sm:px-10 lg:px-16 bg-cover bg-center bg-no-repeat transition-all duration-500"
                style={{
                    backgroundImage: "url('/images/background-login.webp')",
                }}
            >
                {/* Overlay Soft Gradient untuk Menjaga Keterbacaan Teks Kiri & Form Kanan */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/60 to-slate-950/85 pointer-events-none" />

                {/* Container Grid 2 Kolom: Kiri (Headline Besar & Icon), Kanan (Form) */}
                <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
                    {/* Sisi Kiri: Headline Teks Besar & 4 Icon Komunikasi (Menimpa Karakter Background) */}
                    <div className="md:col-span-6 lg:col-span-7 flex justify-start items-center">
                        <HeroHeadline />
                    </div>

                    {/* Sisi Kanan: Form Login / Register */}
                    <div className="md:col-span-6 lg:col-span-5 flex justify-center md:justify-end items-center">
                        {activeTab === 'login' ? (
                            <LoginForm 
                                onSwitchToRegister={() => setActiveTab('register')}
                                onSuccess={(data) => {
                                    console.log('Login sukses:', data);
                                }}
                            />
                        ) : (
                            <RegisterForm 
                                onSwitchToLogin={() => setActiveTab('login')}
                                onSuccess={(data) => {
                                    console.log('Register sukses:', data);
                                }}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
