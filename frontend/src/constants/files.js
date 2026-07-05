import { PROFILE } from './profile'

const generateReadmeRaw = () => {
  const ecosystemText = PROFILE.frameworkEcosystem.map(group => {
    const itemsText = group.items.map(item => item.name).join(', ')
    return `- **${group.category}**: ${itemsText}`
  }).join('\n')

  return `# 👨‍💻 ${PROFILE.name.toUpperCase()}

> ${PROFILE.role}

---

##  About Me
Halo! Saya ${PROFILE.name}, seorang profesional di bidang pengembangan perangkat lunak yang berfokus pada pembangunan aplikasi web berkinerja tinggi, API yang skalabel, dan arsitektur sistem yang bersih.

Saya sangat menyukai perpaduan antara seni pemrograman (coding) dan desain interaktif untuk menciptakan pengalaman pengguna yang luar biasa.

##  Core Stack / Fokus Utama
${ecosystemText}
- **Prinsip Utama**: Clean Code, DRY, SOLID, Scalability

##  Lokasi
${PROFILE.location}

##  Hubungi Saya
- Email: ${PROFILE.contact.email}
- GitHub: ${PROFILE.contact.github}
- LinkedIn: ${PROFILE.contact.linkedin}
- Instagram: ${PROFILE.contact.instagram}
- Threads: ${PROFILE.contact.threads}
- Facebook: ${PROFILE.contact.facebook}
- WhatsApp: ${PROFILE.contact.whatsapp}

---
*Petunjuk: Klik ikon "Open Preview" (ikon mata 👁️ atau split-screen) di kanan atas editor ini untuk melihat profil dalam mode visual yang estetik!*`
}

const generateContactRaw = () => {
  return `#!/bin/bash

# FORMULIR KONTAK INTERAKTIF (${PROFILE.name.toUpperCase()})

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

# Hubungi saya di:
# Email: ${PROFILE.contact.email}
# GitHub: ${PROFILE.contact.github}
# LinkedIn: ${PROFILE.contact.linkedin}
# Instagram: ${PROFILE.contact.instagram}
# Threads: ${PROFILE.contact.threads}
# Facebook: ${PROFILE.contact.facebook}
# WhatsApp: ${PROFILE.contact.whatsapp}

# Jalankan skrip ini dengan mengisi formulir di samping kanan!
# Klik 'Open Preview' di kanan atas untuk memunculkan Formulir Kontak Visual.`
}

const generateSkillsRaw = () => {
  return `/* KATEGORI KEAHLIAN TEKNIS */

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
}

export const VIRTUAL_FILES = {
  readme: {
    name: 'README.md',
    icon: '📄',
    language: 'markdown',
    path: '/editor/readme',
    raw: generateReadmeRaw()
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
    "description": "Mengambil repositori asli secara realtime menggunakan token terenkripsi."
  }
}`
  },

  skills: {
    name: 'skills.css',
    icon: '🎨',
    language: 'css',
    path: '/editor/skills',
    raw: generateSkillsRaw()
  },

  contact: {
    name: 'contact.sh',
    icon: '⚡',
    language: 'bash',
    path: '/editor/contact',
    raw: generateContactRaw()
  }
};
