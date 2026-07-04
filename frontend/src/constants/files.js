export const VIRTUAL_FILES = {
  readme: {
    name: 'README.md',
    icon: '📄',
    language: 'markdown',
    path: '/editor/readme',
    raw: `# 👨‍💻 WISNU WICAKSANA

> Senior Fullstack Developer & System Architect

---

## 🚀 About Me
Halo! Saya Wisnu Wicaksana, seorang profesional di bidang pengembangan perangkat lunak yang berfokus pada pembangunan aplikasi web berkinerja tinggi, API yang skalabel, dan arsitektur sistem yang bersih.

Saya sangat menyukai perpaduan antara seni pemrograman (coding) dan desain interaktif untuk menciptakan pengalaman pengguna yang luar biasa.

## 🛠️ Fokus Utama
- **Frontend**: Vue.js 3 (Composition API), React, Tailwind CSS
- **Backend**: Node.js, Vercel Serverless, Express, Go
- **Database**: PostgreSQL, MongoDB, Redis
- **Prinsip**: Clean Code, DRY, SOLID, Keamanan API

## 📍 Lokasi
Jakarta, Indonesia

## 🌐 Hubungi Saya
- Email: wisnu.wicaksana@example.com
- GitHub: github.com/wisnu-wicaksana

---
*Petunjuk: Klik ikon "Open Preview" (ikon mata 👁️ atau split-screen) di kanan atas editor ini untuk melihat profil dalam mode visual yang estetik!*`
  },
  
  projects: {
    name: 'projects.json',
    icon: '📦',
    language: 'json',
    path: '/editor/projects',
    raw: `{
  "featured_projects": [
    {
      "name": "porto-monorepo",
      "description": "Web portofolio interaktif dengan desain UI/UX bertema Programmer (gabungan VS Code & Terminal CLI).",
      "tech_stack": ["Vue 3", "Vite", "Tailwind v4", "Vercel Serverless"],
      "status": "In Development",
      "github_url": "https://github.com/wisnu-wicaksana/porto"
    },
    {
      "name": "secure-api-proxy",
      "description": "Fungsi serverless aman untuk menyembunyikan API token GitHub GraphQL dengan cache Edge Network terintegrasi.",
      "tech_stack": ["Node.js", "Vercel Serverless", "GraphQL"],
      "status": "Deployed",
      "github_url": "https://github.com/wisnu-wicaksana/porto"
    }
  ],
  "github_fetching": {
    "status": "Active",
    "endpoint": "/api/github",
    "description": "Mengambil repositori asli & pinned secara realtime menggunakan token terenkripsi."
  }
}`
  },

  skills: {
    name: 'skills.css',
    icon: '🎨',
    language: 'css',
    path: '/editor/skills',
    raw: `/* KATEGORI KEAHLIAN TEKNIS */

.frontend-skills {
  frameworks: Vue3, React, Next.js;
  styling: TailwindCSS_v4, PostCSS, VanillaCSS;
  languages: TypeScript, JavaScript_ES6;
  build-tools: Vite, Webpack;
}

.backend-skills {
  runtime: Node.js, Bun;
  architectures: Serverless_Functions, RESTful_API, GraphQL;
  frameworks: Express.js, Fastify;
  languages: Go, Node-ESM;
}

.databases-and-tools {
  sql: PostgreSQL, MySQL;
  nosql: MongoDB, Redis;
  devops: Docker, Git, GitHub-Actions;
  hosting: Vercel, AWS, Netlify;
}

/* SOFT SKILLS */
.architect {
  problem-solving: "High";
  system-design: "Scalable & Maintainable";
  collaboration: "Excellent";
  mentorship: "Senior Level";
}`
  },

  contact: {
    name: 'contact.sh',
    icon: '⚡',
    language: 'bash',
    path: '/editor/contact',
    raw: `#!/bin/bash

# FORMULIR KONTAK INTERAKTIF (WISNU WICAKSANA)

SENDER_NAME=""
SENDER_EMAIL=""
MESSAGE_CONTENT=""

echo "Memulai sesi kontak kirim pesan..."
echo "----------------------------------------"

function send_message() {
  # Endpoint Vercel akan menangani pengiriman data ini
  curl -X POST /api/contact \\
    -H "Content-Type: application/json" \\
    -d "{\\"name\\": \\"$SENDER_NAME\\", \\"email\\": \\"$SENDER_EMAIL\\", \\"message\\": \\"$MESSAGE_CONTENT\\"}"
}

# Jalankan skrip ini dengan mengisi formulir di samping kanan!
# Klik 'Open Preview' di kanan atas untuk memunculkan Formulir Kontak Visual.`
  }
};
