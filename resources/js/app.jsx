import './echo';
import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp.jsx';

const rootElement = document.getElementById('app');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <MainApp />
        </React.StrictMode>
    );
}
