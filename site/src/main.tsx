import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
const root = document.getElementById('root')!;
const path = window.location.pathname.replace(/\/$/, '') || '/';
const app = <React.StrictMode><App path={path} /></React.StrictMode>;
// The HTML is intentionally prerendered for search engines and no-JS visitors.
// Re-rendering the small interactive shell avoids hydration drift on static
// GitHub Pages routes while preserving the rendered document as a fallback.
createRoot(root).render(app);
