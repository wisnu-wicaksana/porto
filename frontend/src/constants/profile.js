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
  role: 'Junior Fullstack Developer | Frontend Enthusiast',
  bio: 'I am a fullstack developer who loves turning complex logic into clean, responsive, and delightful user interfaces.',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  location: 'Central Java, Indonesia',
  
  about: 'A Bachelor of Informatics graduate from Amikom University Yogyakarta with a strong interest in Web Development. Proficient in developing web applications using React.js, Vue.js, HTML, CSS, JavaScript, Express.js, and PostgreSQL.\n\nThroughout my academic journey and self-taught learning, I have actively developed various projects to enhance my skills in building responsive user interfaces, managing databases, and developing REST APIs on the backend.\n\nI have a strong eagerness to learn, solid problem-solving skills, and am accustomed to finding solutions to various technical challenges. I am currently open to opportunities as a Frontend Developer, Backend Developer, Full Stack Developer, or other roles related to web application development.',

  projects: [
    {
      name: "porto-monorepo",
      description: "Interactive web portfolio with Programmer UI/UX design (VS Code & Terminal CLI hybrid).",
      tech_stack: ["Vue 3", "Vite", "Tailwind v4", "Vercel Serverless"],
      status: "In Development",
      github_url: "https://github.com/wisnu-wicaksana/porto"
    },
    {
      name: "secure-api-proxy",
      description: "Secure serverless function to hide GitHub GraphQL API tokens with integrated Edge Network cache.",
      tech_stack: ["Node.js", "Vercel Serverless", "GraphQL"],
      status: "Deployed",
      github_url: "https://github.com/wisnu-wicaksana/porto"
    }
  ],

  contact: {
    email: 'wisnuwicaksana100@gmail.com',
    github: 'https://github.com/wisnu-wicaksana',
    linkedin: 'https://www.linkedin.com/in/wisnu-wicaksono-25a8b2348',
    instagram: 'https://www.instagram.com/wisnnnnnuuuuu/',
    threads: 'https://www.threads.com/@wisnnnnnuuuuu',
    facebook: 'https://www.facebook.com/wisnu.wicaksono.92167/',
    whatsapp: 'https://wa.me/62895364849610',

  },

  frameworkEcosystem: frameworkEcosystemData,

  softSkills: [
    { key: 'problem-solving', value: 'High' },
    { key: 'system-design', value: 'Scalable & Maintainable' },
    { key: 'collaboration', value: 'Excellent' },
    { key: 'mentorship', value: 'Junior Level' }
  ]
}
