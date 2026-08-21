import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage } from 'node:http';

const DB_PATH = path.resolve(__dirname, 'src/dashboard/data/db.json');

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

/**
 * Dev-only JSON "database" for the Jukuto dashboard demo. GET /api/db
 * bootstraps db.json from the TS generator the first time it's requested
 * (via Vite's own SSR module loader, so the seed logic lives in one place);
 * POST /api/db overwrites it. This is what makes trainee CRUD in the app
 * persist to a real file in the repo instead of resetting on reload.
 */
function jsonDbPlugin(): Plugin {
  return {
    name: 'jukuto-json-db',
    configureServer(server) {
      server.middlewares.use('/api/db', async (req, res) => {
        if (req.method === 'GET') {
          try {
            if (!fs.existsSync(DB_PATH)) {
              const mod = await server.ssrLoadModule('/src/dashboard/data/generator.ts');
              const seed = {
                trainees: mod.DATA.trainees,
                sessions: mod.DATA.sessions,
                assessments: mod.DATA.assessments,
                certifications: mod.DATA.certifications,
                auditLog: mod.DATA.auditLog,
              };
              fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
              fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(fs.readFileSync(DB_PATH, 'utf-8'));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
          return;
        }
        if (req.method === 'POST') {
          try {
            const body = await readBody(req);
            JSON.parse(body); // validate before writing
            fs.writeFileSync(DB_PATH, body);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: String(err) }));
          }
          return;
        }
        res.statusCode = 405;
        res.end();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), jsonDbPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
