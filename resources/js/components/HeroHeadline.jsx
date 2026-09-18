import React from 'react';
import { Headphones, Mic, MessageSquare, Video } from 'lucide-react';

export default function HeroHeadline() {
    return (
        <div className="flex flex-col items-start text-left max-w-xl">
            {/* 4 Icon Komunikasi di Atas Teks - Ukuran Lebih Besar */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-slate-900/80 border border-[#2ECC71]/40 flex items-center justify-center text-[#2ECC71] shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:scale-110 transition-transform duration-300">
                    <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-slate-900/80 border border-[#2ECC71]/40 flex items-center justify-center text-[#2ECC71] shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:scale-110 transition-transform duration-300">
                    <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-slate-900/80 border border-[#2ECC71]/40 flex items-center justify-center text-[#2ECC71] shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-slate-900/80 border border-[#2ECC71]/40 flex items-center justify-center text-[#2ECC71] shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:scale-110 transition-transform duration-300">
                    <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
            </div>

            {/* Headline Teks Ukuran Besar di Kiri Halaman */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] drop-shadow-xl">
                <span className="text-[#FBFBFA]">Let's connect </span>
                <br className="hidden sm:block" />
                <span className="text-[#2ECC71]">with your friend's</span>
            </h1>

            <p className="mt-3 sm:mt-4 text-slate-300/90 text-sm sm:text-base lg:text-lg font-medium max-w-md leading-relaxed drop-shadow">
                Nikmati komunikasi mudah dan lancar dengan teman dan komunitas Anda dalam satu platform Connect.
            </p>
        </div>
    );
}
