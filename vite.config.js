import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/github': {
          target: 'https://api.github.com/graphql',
          changeOrigin: true,
          bypass: async (req, res) => {
            if (req.url === '/api/github') {
              try {
                const token = env.GITHUB_PAT;
                const query = `
                  query {
                    viewer {
                      name login url avatarUrl bio company location websiteUrl twitterUsername
                      repositories(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
                        nodes {
                          name description url stargazerCount forkCount
                          primaryLanguage { name color }
                        }
                      }
                    }
                  }
                `;
                
                // Fetch di Node.js (Vite running in Node)
                const fetch = (await import('node-fetch')).default || globalThis.fetch;
                const githubResponse = await fetch('https://api.github.com/graphql', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'User-Agent': 'Vite-Dev-Proxy'
                  },
                  body: JSON.stringify({ query })
                });
                
                const data = await githubResponse.json();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data.data.viewer));
                return false; // Tells Vite we handled the request
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
                return false;
              }
            }
          }
        }
      }
    }
  }
})

