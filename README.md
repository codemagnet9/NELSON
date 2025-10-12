Here's an improved version of your README.md with better structure, visual elements, and organization:

```markdown
<div align="center">
  <a href="https://nelsonlai.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="apps/web/public/images/dark-header.png">
      <img alt="Project Cover" src="apps/web/public/images/light-header.png" width="600">
    </picture>
  </a>

  <h1 align="center">
    nelsonlai.dev
  </h1>

  <p align="center">
    Personal blog and portfolio built with modern web technologies
  </p>

  <div align="center">
    <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&labelColor=000000" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
  </div>

  <br/>

  <div align="center">
    <a href="https://nelsonlai.dev">🌐 Live Demo</a>
    •
    <a href="#getting-started">🚀 Get Started</a>
    •
    <a href="#features">✨ Features</a>
    •
    <a href="#development">💻 Development</a>
  </div>
</div>

## ✨ Features

### 🚀 Core Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with dark/light mode
- **Content**: MDX with enhanced components
- **Database**: Drizzle ORM with PostgreSQL
- **Internationalization**: I18n support

### 🎨 User Experience
- **UI Components**: Radix UI for accessibility
- **Animations**: Framer Motion for smooth interactions
- **Syntax Highlighting**: Shiki for code blocks
- **Blog Features**: Table of contents, image zoom, search
- **Comments**: Full-featured comment system with likes
- **Analytics**: Umami integration

### ⚡ Performance & SEO
- **Lighthouse Score**: Nearly 100 across all metrics
- **SEO Optimized**: Meta tags, JSON-LD, sitemap
- **Dynamic OG**: Open Graph images with `next/og`
- **RSS Feed**: Automatic feed generation

### 🔧 Developer Experience
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Code Quality**: ESLint, Prettier, CSpell
- **Git Hooks**: Lefthook with conventional commits
- **Environment**: t3-env for type-safe env variables

### 🔐 Authentication & Data
- **Auth**: Better Auth for secure authentication
- **Caching**: Redis with Upstash
- **Rate Limiting**: API protection with Upstash
- **Real-time**: Live updates and interactions

## 🚀 Getting Started

### Prerequisites

- **Runtime**: Node.js 18+ 
- **Package Manager**: [Bun](https://bun.sh)
- **Containerization**: Docker & Docker Compose
- **Editor**: [VS Code](https://code.visualstudio.com/) with [recommended extensions](.vscode/extensions.json)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nelsonlaidev/nelsonlai.dev
   cd nelsonlai.dev
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Update environment variables in .env.local
   ```

4. **Start services**
   ```bash
   docker compose up -d
   ```

5. **Run database setup**
   ```bash
   bun db:migrate
   bun db:seed
   ```

6. **Start development server**
   ```bash
   bun dev
   ```

### 🎯 Development URLs

| Service | URL | Description |
|---------|-----|-------------|
| Main App | `localhost:3000` | Primary application |
| Documentation | `localhost:3002` | Docs site |
| PostgreSQL | `localhost:5432` | Database |
| Redis | `localhost:6379` | Cache |
| Redis HTTP | `localhost:8079` | Serverless Redis |

### Available Scripts

```bash
bun dev          # Run all services
bun dev:web      # Run only web app
bun dev:docs     # Run only documentation
bun build        # Build for production
bun test         # Run tests
bun lint         # Run linting
bun type-check   # TypeScript check
```

## 🏗️ Project Structure

```
nelsonlai.dev/
├── apps/
│   ├── web/                 # Next.js main application
│   └── docs/               # Documentation site
├── packages/
│   ├── db/                 # Database schema and migrations
│   ├── ui/                 # Shared UI components
│   ├── i18n/              # Internationalization
│   └── ...                # Other shared packages
├── docker-compose.yml     # Development services
└── package.json          # Monorepo configuration
```

## 🙏 Credits

This project stands on the shoulders of giants in the open-source community:

### 🎨 Design & Inspiration
- **[Timothy](https://www.timlrx.com/)** - [Tailwind Next.js Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog)
- **[Eihab](https://www.eihabkhan.com/)** - UI design inspiration ([Figma](https://www.figma.com/community/file/1266863403759514317/))

### 🔧 Direct Dependencies
- **Comment System** - [fuma-comment](https://github.com/fuma-nama/fuma-comment)
- **MDX Plugins** - [fumadocs](https://github.com/fuma-nama/fumadocs)
- **UI Components** - [shadcn/ui](https://ui.shadcn.com)
- **ESLint Config** - [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- **Admin UI** - [shadcn-admin](https://github.com/satnaing/shadcn-admin)

### 💡 Inspiration Sources
- [leerob.io](https://leerob.io/) • [delba.dev](https://delba.dev/) • [ped.ro](https://ped.ro/)
- [theodorusclarence.com](https://theodorusclarence.com/) • [joshwcomeau.com](https://www.joshwcomeau.com/)
- [blog.maximeheckel.com](https://blog.maximeheckel.com/) • [zenorocha.com](https://zenorocha.com/)
- [nikolovlazar.com](https://nikolovlazar.com/) • [samuelkraft.com](https://samuelkraft.com/)

## 👨‍💻 Author

**Nelson Lai** 
- 🌐 [Portfolio](https://nelsonlai.dev)
- 🐙 [GitHub](https://github.com/nelsonlaidev)
- 💼 [LinkedIn](https://linkedin.com/in/nelsonlaidev)

## 💝 Support

If this project helps you, consider supporting its development:

- ⭐ **Star** the repository
- 🐛 **Report** issues and bugs  
- 🔧 **Submit** pull requests
- 💖 **[Sponsor](https://github.com/sponsors/nelsonlaidev)** the project

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ in Hong Kong</sub>
</div>
```
