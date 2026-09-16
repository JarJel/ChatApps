import React from 'react';

export default function MainApp() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md text-center shadow-xl">
                <h1 className="text-3xl font-bold text-indigo-400 mb-3">
                    React App Ready 🚀
                </h1>
                <p className="text-gray-300 mb-4">
                    Setup React + Vite berhasil terpasang.
                </p>
                <p className="text-sm text-gray-400">
                    Folder <code className="text-indigo-300">pages/</code> dan <code className="text-indigo-300">components/</code> telah dibersihkan agar siap diisi oleh tim Frontend Anda.
                </p>
            </div>
        </div>
    );
}
