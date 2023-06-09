import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HomeApp } from '../app';
import '../i18n';

const root = document.getElementById('root');

createRoot(root).render(
  <HomeApp />
);
