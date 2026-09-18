import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { loginApi } from '../services/authService';

export default function LoginForm({ onSwitchToRegister, onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const data = await loginApi(email, password);
            setSuccessMsg(data.message || 'Login berhasil! Selamat datang.');
            if (data.token) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
            }
            if (onSuccess) {
                onSuccess(data);
            }
        } catch (err) {
            if (err.error) {
                if (typeof err.error === 'string') {
                    setErrorMsg(err.error);
                } else if (typeof err.error === 'object') {
                    const firstKey = Object.keys(err.error)[0];
                    setErrorMsg(err.error[firstKey][0]);
                }
            } else {
                setErrorMsg('Gagal melakukan login. Periksa koneksi atau data Anda.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm sm:max-w-md bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] my-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FBFBFA] mb-1">
                Masuk ke Akun
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-5">
                Masukkan email dan password untuk melanjutkan
            </p>

            {/* Alert Error */}
            {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs sm:text-sm flex items-center justify-between">
                    <span>{errorMsg}</span>
                    <button 
                        type="button" 
                        onClick={() => setErrorMsg('')} 
                        className="text-red-400 hover:text-red-200 text-xs font-bold px-1"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Alert Sukses */}
            {successMsg && (
                <div className="mb-4 p-3 bg-[#2ECC71]/10 border border-[#2ECC71]/40 rounded-xl text-[#2ECC71] text-xs sm:text-sm text-center font-medium">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input Email */}
                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Input Password */}
                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Tombol Submit Login */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-4 bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(46,204,113,0.3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2ECC71]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Memproses Login...</span>
                        </>
                    ) : (
                        <>
                            <span>Masuk Sekarang</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Footer Form Switch to Register */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                <p className="text-slate-400 text-xs sm:text-sm">
                    Belum memiliki akun?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-[#2ECC71] font-semibold hover:underline cursor-pointer transition-colors"
                    >
                        Daftar akun baru
                    </button>
                </p>
            </div>
        </div>
    );
}
