#  Devix – AI-Powered Web IDE

**Devix** is a blazing-fast, AI-integrated web IDE built entirely in the browser using **Next.js App Router**, **WebContainers**, **Monaco Editor**, and **Google's Gemini 2.5 Flash Lite API**. It offers real-time code execution, an AI-powered chat assistant, support for multiple tech stacks, and direct GitHub repository imports — all wrapped in a stunning developer-first UI.

---

## 🚀 Features

-  **OAuth Login with NextAuth** – Supports Google & GitHub login via Prisma & MongoDB.
-  **Modern UI** – Built with Tailwind CSS & Shadcn UI.
-  **Dark/Light Mode** – Seamlessly toggle between themes across the editor, terminal, and UI.
-  **Project Templates** – Start fresh with React, Next.js, Express, Hono, Vue, or Angular templates.
-  **GitHub Repository Import** – Instantly clone and mount public GitHub repositories directly into your browser. 
-  **Custom File Explorer** – Create, rename, delete, manage files/folders, with IDE-standard sorting (folders first).
-  **Enhanced Monaco Editor** – Syntax highlighting, formatting, custom keybindings, and inline AI autocomplete.
-  **AI Autocomplete suggestions** – Powered by Google Gemini. Context-aware code completion triggered via `Ctrl + Space` or typing context. Accept with `Tab`.
-  **WebContainers Integration** – Instantly run frontend & backend node apps right inside the browser – no VMs or remote servers required.
-  **Terminal with xterm.js** – Fully interactive embedded terminal experience.
-  **AI Chat Assistant** – Share your current files with the AI as context, get explanations, debug issues, or ask for refactors.

---

##  Tech Stack

| Layer         | Technology                                   |
|---------------|----------------------------------------------|
| Framework     | Next.js 15 (App Router)                      |
| Styling       | Tailwind CSS v4, Shadcn UI                   |
| Language      | TypeScript                                   |
| Auth          | NextAuth.js (Google + GitHub OAuth)          |
| Editor        | Monaco Editor (`@monaco-editor/react`)       |
| AI Backend    | Google Gemini API (`@google/genai`)          |
| Runtime       | WebContainers API                            |
| Terminal      | xterm.js                                     |
| Database      | MongoDB with Prisma ORM                      |
| State Mgmt    | Zustand                                      |

---

##  Getting Started

### 1. Clone the Repo

```bash
git clone [https://github.com/mukulgupta11/devix.git](https://github.com/mukulgupta11/Devix)
cd devix
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file referencing `.env.example`:

```bash
cp .env.example .env
```

Fill in your required credentials:

```env
AUTH_SECRET=your_nextauth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

# MongoDB Database URL
DATABASE_URL=mongodb+srv://<user>:<password>@cluster...

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

NEXTAUTH_URL=http://localhost:3000
```

### 4. Setup Database

Push the Prisma schema to your MongoDB cluster to configure your collections:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

##  Project Structure

```
.
├── app/                     # Next.js App Router (pages, api routes)
│   ├── api/                 # API Routes (chat, code-suggestion, github import)
│   ├── dashboard/           # User dashboard (projects, templates, github import)
│   └── playground/          # The main IDE workspace
├── components/              # Global UI components (Shadcn UI, Modals, Providers)
├── features/                # Feature-driven architecture modules
│   ├── ai-chat/             # AI side-panel & chat logic
│   ├── auth/                # Sign-in forms & logic
│   ├── dashboard/           # Dashboard UI components
│   ├── playground/          # Editor, file tree, WebContainer hooks
│   └── webcontainers/       # WebContainer mounting & preview window
├── lib/                     # Global utility functions & Prisma client
├── prisma/                  # Database schema models (User, Playground, ChatMessage)
├── public/                  # Static assets & icons
└── README.md
```

---

##  Keyboard Shortcuts (Editor)

* `Ctrl + Space` : Trigger AI code completion / inline suggestions manually.
* `Tab` : Accept AI suggestion.
* `Esc` : Reject AI suggestion.
* `Ctrl + S`: Save active file to the database & sync to WebContainer disk.
* `Ctrl + Shift + S`: Save all unsaved files.

---

##  Completed Roadmap

* [x] Google & GitHub Auth via NextAuth
* [x] Multiple stack templates internally configured
* [x] Monaco Editor + AI Inline auto-completes
* [x] WebContainers + fully-fledged interactive terminal
* [x] AI chat sidepanel for context-aware code assistance
* [x] GitHub repo import tool (clones public repositories straight into workspaces)
* [x] Save & Load playground state from Database

##  Future Roadmap

* [ ] Real-time multiplayer collaboration
* [ ] Plugin system for templates/tools
* [ ] One-click deploy to Vercel/Netlify
* [ ] Persistent Chat History for individual projects

---

##  License

This project is licensed under the [MIT License](LICENSE).

---

##  Acknowledgements

* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [Google Gemini GenAI SDK](https://ai.google.dev/)
* [WebContainers](https://webcontainers.io/)
* [xterm.js](https://xtermjs.org/)
* [NextAuth.js](https://next-auth.js.org/)
