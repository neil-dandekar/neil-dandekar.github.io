import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { loadAppData } from './lib/content';
import { AppDataProvider } from './lib/hooks';
import './styles.css';

async function bootstrap() {
  const data = await loadAppData();
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppDataProvider data={data}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppDataProvider>
    </React.StrictMode>
  );
}

void bootstrap();
