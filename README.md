# Wisnu Wicaksana - Developer Portfolio

A sleek, interactive, and modern web developer portfolio designed with an IDE/Terminal theme. Built to showcase projects, skills, and real-time GitHub statistics directly within a code-editor-like interface.

## Features

- **IDE-Themed UI**: An immersive experience that mimics a modern code editor (like VS Code) with activity bars, sidebars, and tabbed file navigation.
- **Real-time GitHub Integration**: Uses GitHub's GraphQL API to dynamically fetch and display live repository data, pinned projects, and profile statistics.
- **Interactive Terminal**: A fully functional-looking terminal view at the bottom of the editor.
- **Working Contact Form**: Integrated with Web3Forms to receive messages directly to email without a backend.
- **Responsive & Scalable**: Carefully crafted with Tailwind CSS for perfect rendering on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend/API**: Vercel Serverless Functions (`api/` directory) & Vite Proxy for local development.
- **Deployment**: [Vercel](https://vercel.com/)

## Local Development Setup

To run this project locally, you will need a GitHub Personal Access Token (PAT) and a Web3Forms Access Key.

1. **Clone the repository**
   ```bash
   git clone https://github.com/wisnu-wicaksana/porto.git
   cd porto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root of the project and add your tokens:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key_here
   GITHUB_PAT=ghp_your_github_personal_access_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   *Note: The Vite proxy is pre-configured to securely handle the GitHub API requests locally using your PAT without exposing it to the browser.*

5. **Open in Browser**
   Navigate to `http://localhost:5173`

## Deployment

This project is optimized for deployment on **Vercel**. 
Simply link your GitHub repository to a new Vercel project and ensure you add the `VITE_WEB3FORMS_ACCESS_KEY` and `GITHUB_PAT` to the Vercel Environment Variables settings before deploying.

---
*Designed & Built by Wisnu Wicaksana.*
