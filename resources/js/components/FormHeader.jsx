import React from 'react';
import { Headphones, Mic, MessageSquare, Video } from 'lucide-react';

export default function FormHeader() {
    return (
        <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
            {/* 4 Icon Komunikasi di Atas Teks */}
            <div className="flex items-center justify-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 border border-[#2ECC71]/30 flex items-center justify-center text-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.2)] hover:scale-110 transition-transform duration-200">
                    <Headphones className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 border border-[#2ECC71]/30 flex items-center justify-center text-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.2)] hover:scale-110 transition-transform duration-200">
                    <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 border border-[#2ECC71]/30 flex items-center justify-center text-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.2)] hover:scale-110 transition-transform duration-200">
                    <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 border border-[#2ECC71]/30 flex items-center justify-center text-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.2)] hover:scale-110 transition-transform duration-200">
                    <Video className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
            </div>

            {/* Headline Teks dengan Warna Sesuai Spesifikasi */}
            <h1 className="text-lg sm:text-2xl lg:text-2xl font-extrabold tracking-tight leading-snug">
                <span className="text-[#FBFBFA]">Let's connect </span>
                <span className="text-[#2ECC71]">with your friend's</span>
            </h1>
        </div>
    );
}
1