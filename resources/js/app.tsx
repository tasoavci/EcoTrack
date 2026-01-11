import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob('./Pages/**/*.{jsx,tsx}');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name: string) => {
        // Try .tsx first, then .jsx
        const paths = [`./Pages/${name}.tsx`, `./Pages/${name}.jsx`];
        
        for (const path of paths) {
            if (path in pages) {
                return pages[path]();
            }
        }
        
        // Search in subdirectories - normalize name and find matching key
        const normalizedName = name.replace(/\//g, '/');
        for (const [path, resolver] of Object.entries(pages)) {
            // Extract component name from path: ./Pages/Auth/Login.jsx -> Auth/Login
            const componentPath = path
                .replace('./Pages/', '')
                .replace(/\.(jsx|tsx)$/, '');
            
            if (componentPath === normalizedName) {
                return resolver();
            }
        }
        
        throw new Error(`Page not found: ./Pages/${name}`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

