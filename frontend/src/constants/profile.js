const frameworkEcosystemData = [
  {
    category: 'Frontend Ecosystem',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    items: [
      { name: 'Vue.js 3 (Composition API)', level: 90 },
      { name: 'React.js & Next.js', level: 85 },
      { name: 'Tailwind CSS v4 & PostCSS', level: 95 },
      { name: 'Pinia & Redux (State Mgt)', level: 88 },
      { name: 'Vite & Webpack (Bundlers)', level: 85 }
    ]
  },
  {
    category: 'Backend Ecosystem',
    color: 'text-green-400',
    borderColor: 'border-green-500/20',
    items: [
      { name: 'Node.js (ESM)', level: 88 },
      { name: 'Express.js & REST APIs', level: 85 },
      { name: 'Vercel Serverless', level: 90 },
      { name: 'GraphQL (Apollo)', level: 75 },
      { name: 'Go (Golang) Microservices', level: 60 }
    ]
  },
  {
    category: 'Database & DevOps',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/20',
    items: [
      { name: 'PostgreSQL & MySQL', level: 82 },
      { name: 'MongoDB & Mongoose', level: 80 },
      { name: 'Redis (Caching)', level: 75 },
      { name: 'Docker & Containerization', level: 70 },
      { name: 'GitHub Actions (CI/CD)', level: 85 }
    ]
  }
]

// Sinkronisasi Core Stack secara otomatis dengan mengambil 6 skill dengan level tertinggi
const allSkills = frameworkEcosystemData.flatMap(group => group.items)
const topSkills = allSkills
  .sort((a, b) => b.level - a.level)
  .slice(0, 6)
  .map(item => item.name)

export const PROFILE = {
  name: 'Wisnu Wicaksana',
  role: 'Senior Fullstack Developer & System Architect',
  bio: 'Saya adalah seorang fullstack developer yang suka mengubah logika kompleks menjadi antarmuka pengguna yang bersih, responsif, dan menyenangkan untuk dijelajahi.',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  location: 'Jawa Tengah , Indonesia',
  
  
  mission: 'Saya percaya bahwa kode bukan sekadar barisan teks, melainkan instrumen untuk memecahkan masalah nyata. Saya membangun aplikasi dengan prinsip **SOLID**, menjaga efisiensi memori, serta memastikan performa rendering frontend selalu optimal demi kenyamanan pengguna akhir.',
  
  interests: topSkills,

  contact: {
    email: 'wisnu.wicaksana@example.com',
    github: 'https://github.com/wisnu-wicaksana',
    linkedin: 'https://linkedin.com/in/wisnu-wicaksana',
    twitter: 'https://twitter.com/wisnu_wicaksana'
  },

  frameworkEcosystem: frameworkEcosystemData
}
