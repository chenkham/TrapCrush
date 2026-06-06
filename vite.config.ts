import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, 'db.json');

function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ pages: [] }));
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    return { pages: [] };
  }
}

function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const apiPlugin = () => ({
  name: 'api-plugin',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url && req.url.startsWith('/api/pages')) {
        res.setHeader('Content-Type', 'application/json');
        
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const db = getDb();
              const newPage = JSON.parse(body);
              db.pages = db.pages.filter((p: any) => p.slug !== newPage.slug);
              db.pages.push(newPage);
              saveDb(db);
              res.statusCode = 200;
              res.end(JSON.stringify(newPage));
            } catch (err: any) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        
        if (req.method === 'GET') {
          const db = getDb();
          const urlParts = req.url.split('/');
          
          if (urlParts.includes('user')) {
            const userId = urlParts[urlParts.length - 1];
            const userPages = db.pages.filter((p: any) => p.user_id === userId);
            res.end(JSON.stringify(userPages));
            return;
          }
          
          const slug = urlParts[urlParts.length - 1];
          const page = db.pages.find((p: any) => p.slug === slug);
          if (page) {
            res.end(JSON.stringify(page));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Page not found' }));
          }
          return;
        }

        if (req.method === 'DELETE') {
          const urlParts = req.url.split('/');
          const id = urlParts[urlParts.length - 1];
          const db = getDb();
          db.pages = db.pages.filter((p: any) => p.id !== id);
          saveDb(db);
          res.end(JSON.stringify({ success: true }));
          return;
        }
      }
      next();
    });
  }
});

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    apiPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['logo.png'],
      manifest: {
        name: 'TrapCrush',
        short_name: 'TrapCrush',
        description: 'Create interactive romantic pages for your crush.',
        theme_color: '#0a0a1a',
        background_color: '#0a0a1a',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192 512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
  },
  define: {
    'process.env': {}
  }
})
