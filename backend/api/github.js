export default async function handler(req, res) {
  // 1. Atur CORS Headers agar frontend bisa mengakses API ini
  const allowedOrigin = process.env.NODE_ENV === 'development' ? '*' : 'https://my-production-url.vercel.app';
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Tangani Preflight Request untuk CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Hanya izinkan metode GET
  if (req.method !== 'GET') {
    return res.status(451).json({ error: 'Method Not Allowed. Use GET.' });
  }

  // 2. Ambil token dari environment variable
  const token = process.env.GITHUB_PAT;
  if (!token) {
    return res.status(500).json({ error: 'GitHub Personal Access Token (GITHUB_PAT) is missing in environment variables.' });
  }

  // 3. Definisikan GraphQL Query untuk mengambil data profil & repository pinned
  const query = `
    query {
      viewer {
        name
        login
        url
        avatarUrl
        bio
        company
        location
        websiteUrl
        twitterUsername
        repositories(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  `;

  try {
    // 4. Fetch data ke GitHub GraphQL API menggunakan native fetch (Node.js 18+)
    const githubResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Vercel-Serverless-Porto-Backend'
      },
      body: JSON.stringify({ query })
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      return res.status(githubResponse.status).json({
        error: `GitHub API error: ${githubResponse.statusText}`,
        details: errorText
      });
    }

    const data = await githubResponse.json();

    // 5. Atur Cache-Control (s-maxage: cache di Vercel Edge Network selama 1 jam, stale-while-revalidate selama 10 menit)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    
    return res.status(200).json(data.data.viewer);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
