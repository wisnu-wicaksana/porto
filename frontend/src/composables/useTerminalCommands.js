import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGithubStore } from '@/stores/github'
import { PROFILE } from '@/constants/profile'

export function useTerminalCommands(scrollToBottom, clearInput) {
  const router = useRouter()
  const githubStore = useGithubStore()
  
  const commandHistory = ref([])

  const executeCommand = async (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase()
    
    // Check if we need to clear input
    clearInput(cmd)

    switch (cmd) {
      case 'help':
        commandHistory.value.push({ 
          type: 'output', 
          text: `Available commands:
  help      - Show this help message
  about     - Show brief information about me
  projects  - List my top GitHub repositories (Live Data)
  skills    - Display my technical skills
  contact   - Show contact information
  clear     - Clear the terminal screen
  editor    - Switch back to the VS Code GUI mode
  gui       - Alias for 'editor'
  snake     -  Play the classic Snake game!`
        })
        break

      case 'about':
        commandHistory.value.push({ 
          type: 'output', 
          text: `Hi! I'm ${PROFILE.name}.\n${PROFILE.bio}` 
        })
        break

      case 'projects':
        commandHistory.value.push({ type: 'output', text: 'Fetching repositories from GitHub API...' })
        scrollToBottom()
        
        if (githubStore.loading) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

        if (githubStore.profileData && githubStore.profileData.repositories?.nodes?.length) {
          let projText = `\n[ MY REPOSITORIES - @${githubStore.profileData.login} ]\n\n`
          
          githubStore.profileData.repositories.nodes.forEach(repo => {
            const lang = repo.primaryLanguage ? repo.primaryLanguage.name : 'Unknown'
            projText += `* ${repo.name}\n`
            projText += `  Desc: ${repo.description || 'No description'}\n`
            projText += `  Tech: ${lang} | Stars: ${repo.stargazerCount} | Forks: ${repo.forkCount}\n`
            projText += `  Link: ${repo.url}\n\n`
          })

          commandHistory.value.push({ type: 'output', text: projText })
        } else {
          // Fallback jika API gagal
          let fallbackText = `[ OFFLINE MODE ]\nFailed to fetch live data from GitHub. Showing local fallback:\n\n`
          PROFILE.projects.forEach(p => {
            fallbackText += `* ${p.name}\n  Desc: ${p.description}\n  Tech: ${p.tech_stack.join(', ')}\n\n`
          })

          commandHistory.value.push({ 
            type: 'output', 
            text: fallbackText.trim()
          })
        }
        break

      case 'skills':
        if (githubStore.profileData?.repositories?.nodes) {
          let skillsText = `[ GITHUB LANGUAGES DISTRIBUTION ]\n\n`
          
          const langs = {}
          let totalRepos = 0
          
          githubStore.profileData.repositories.nodes.forEach(repo => {
            if (repo.primaryLanguage) {
              const name = repo.primaryLanguage.name
              if (!langs[name]) langs[name] = 0
              langs[name]++
              totalRepos++
            }
          })
          
          const skillsArray = Object.keys(langs).map(key => ({
            name: key,
            level: Math.round((langs[key] / totalRepos) * 100)
          })).sort((a, b) => b.level - a.level)
          
          skillsArray.forEach(skill => {
            const filled = Math.round(skill.level / 10)
            const empty = 10 - filled
            const bar = '█'.repeat(filled) + '░'.repeat(empty)
            skillsText += `${skill.name.padEnd(16)} [${bar}] ${skill.level}%\n`
          })

          // Menambahkan Detail Framework & Library
          const detailedEcosystem = PROFILE.frameworkEcosystem

          skillsText += `\n[ FRAMEWORKS & LIBRARIES ECOSYSTEM ]\n\n`
          detailedEcosystem.forEach(group => {
            skillsText += `${group.category}:\n`
            group.items.forEach(item => {
              const filled = Math.round(item.level / 10)
              const empty = 10 - filled
              const bar = '█'.repeat(filled) + '░'.repeat(empty)
              skillsText += `${item.name.padEnd(30)} [${bar}] ${item.level}%\n`
            })
            skillsText += '\n'
          })
          
          skillsText += `\n[ SOFT SKILLS ]\n\n`
          PROFILE.softSkills.forEach(skill => {
            skillsText += `${skill.key.padEnd(20)} : ${skill.value}\n`
          })
          
          commandHistory.value.push({ type: 'output', text: skillsText })
        } else {
          commandHistory.value.push({ type: 'output', text: 'Still loading data from GitHub. Please try again in a moment.' })
        }
        break

      case 'contact':
        commandHistory.value.push({ 
          type: 'output', 
          text: `[ CONTACT INFO ]
Email     : ${PROFILE.contact.email}
GitHub    : ${PROFILE.contact.github}
LinkedIn  : ${PROFILE.contact.linkedin}
Instagram : ${PROFILE.contact.instagram}
Threads   : ${PROFILE.contact.threads}
Facebook  : ${PROFILE.contact.facebook}
WhatsApp  : ${PROFILE.contact.whatsapp}

Type 'editor' and go to contact.sh to send a direct message!` 
        })
        break

      case 'snake':
        commandHistory.value.push({
          type: 'component',
          component: 'snake'
        })
        break

      case 'clear':
        commandHistory.value = []
        break

      case 'editor':
      case 'gui':
        commandHistory.value.push({ type: 'output', text: 'Initializing graphical user interface (GUI)...' })
        setTimeout(() => {
          router.push('/editor')
        }, 500)
        break

      default:
        commandHistory.value.push({ 
          type: 'output', 
          text: `bash: ${cmd}: command not found. Type 'help' for a list of commands.` 
        })
    }
    
    scrollToBottom()
  }

  return {
    commandHistory,
    executeCommand
  }
}
