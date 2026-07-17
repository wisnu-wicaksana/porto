import { createRouter, createWebHistory } from 'vue-router'

// Router-level code-splitting (Lazy loading) untuk performa optimal
const EditorLayout = () => import('@/views/EditorLayout.vue')
const TerminalView = () => import('@/views/TerminalView.vue')
const ReadmeFile = () => import('@/views/editor/ReadmeFile.vue')
const ProjectsFile = () => import('@/views/editor/ProjectsFile.vue')
const SkillsFile = () => import('@/views/editor/SkillsFile.vue')
const ContactFile = () => import('@/views/editor/ContactFile.vue')
const CatIdle = () => import('@/views/editor/CatIdle.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/editor/readme'
    },
    {
      path: '/editor',
      component: EditorLayout,
      children: [
        {
          path: '', // Default child route for /editor (ketika tidak ada tab)
          name: 'idle',
          component: CatIdle
        },
        {
          path: 'readme',
          name: 'readme',
          component: ReadmeFile
        },
        {
          path: 'projects',
          name: 'projects',
          component: ProjectsFile
        },
        {
          path: 'skills',
          name: 'skills',
          component: SkillsFile
        },
        {
          path: 'contact',
          name: 'contact',
          component: ContactFile
        }
      ]
    },
    {
      path: '/terminal',
      name: 'terminal',
      component: TerminalView
    },
    {
      // Catch-all route untuk redirect ke halaman utama jika path tidak ditemukan
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
