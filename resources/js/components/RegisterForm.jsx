import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { registerApi } from '../services/authService';

export default function RegisterForm({ onSwitchToLogin, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setErrors({});
        setSuccessMsg('');
        setLoading(true);

        try {
            const data = await registerApi(formData);
            setSuccessMsg(data.message || 'Pendaftaran berhasil! Mengalihkan ke halaman login...');

            // Kosongkan Form Register secara langsung
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                password_confirmation: '',
            });

            if (onSuccess) {
                onSuccess(data);
            }

            // Otomatis berpindah / redirect ke halaman Login
            setTimeout(() => {
                onSwitchToLogin();
            }, 1200);
        } catch (err) {
            if (err.error) {
                if (typeof err.error === 'object') {
                    setErrors(err.error);
                } else if (typeof err.error === 'string') {
                    setErrorMsg(err.error);
                }
            } else {
                setErrorMsg('Terjadi kesalahan saat pendaftaran.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm sm:max-w-md bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] my-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FBFBFA] mb-1">
                Buat Akun Baru
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-4">
                Lengkapi data Anda untuk bergabung ke Connect
            </p>

            {/* Alert Error Umum */}
            {errorMsg && (
                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs flex items-center justify-between">
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
                <div className="mb-3 p-3 bg-[#2ECC71]/10 border border-[#2ECC71]/40 rounded-xl text-[#2ECC71] text-xs text-center font-medium">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                {/* Input Nama Lengkap */}
                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Nama Lengkap
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                        />
                    </div>
                    {errors.name && <p className="text-red-400 text-[10px] mt-0.5">{errors.name[0]}</p>}
                </div>

                {/* Input Email */}
                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="nama@email.com"
                            className="w-full pl-10 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                        />
                    </div>
                    {errors.email && <p className="text-red-400 text-[10px] mt-0.5">{errors.email[0]}</p>}
                </div>

                {/* Input Nomor Telepon */}
                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Nomor Telepon
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="081234567890"
                            className="w-full pl-10 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                        />
                    </div>
                    {errors.phone && <p className="text-red-400 text-[10px] mt-0.5">{errors.phone[0]}</p>}
                </div>

                {/* Input Password */}
                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimal 8 karakter"
                            className="w-full pl-10 pr-10 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-[10px] mt-0.5">{errors.password[0]}</p>}
                </div>

                {/* Input Konfirmasi Password */}
                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Konfirmasi Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            required
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Ulangi password Anda"
                            className="w-full pl-10 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Tombol Submit Register */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 px-4 bg-[#2ECC71] hover:bg-[#27ae60] text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_15px_rgba(46,204,113,0.3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2ECC71]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mendaftarkan...</span>
                        </>
                    ) : (
                        <>
                            <span>Daftar Sekarang</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Footer Form Switch to Login */}
            <div className="mt-4 pt-3.5 border-t border-slate-800 text-center">
                <p className="text-slate-400 text-xs sm:text-sm">
                    Sudah memiliki akun?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-[#2ECC71] font-semibold hover:underline cursor-pointer transition-colors"
                    >
                        Masuk ke akun
                    </button>
                </p>
            </div>
        </div>
    );
}
