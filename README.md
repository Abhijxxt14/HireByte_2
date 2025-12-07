# <p align="center">🚀 HireByte</p>

<p align="center">
  <img src="https://img.shields.io/github/issues/Abhijxxt14/HireByte?style=flat-square" alt="issues" />
  <img src="https://img.shields.io/github/stars/Abhijxxt14/HireByte?style=flat-square" alt="stars" />
  <img src="https://img.shields.io/github/last-commit/Abhijxxt14/HireByte?style=flat-square" alt="last-commit" />
</p>

<p align="center">
  <b>A Modern AI-Powered ATS-Friendly Resume Builder with Speech-to-Text</b><br>
  <i>Build, optimize, and score your resume with AI assistance and real-time ATS analysis.</i>
</p>

## ✨ Overview

HireByte is a cutting-edge resume building platform developed with **Next.js 15**, **TypeScript**, and **AI-powered features**.
It helps job seekers create ATS-optimized resumes with real-time scoring, AI-powered content generation, and speech-to-text input.
Built with modern web technologies and a beautiful, responsive design.

<!-- 📸 Screenshots
Landing Page	Job Listings	Candidate Dashboard
Tip: Add your own screenshots in the assets/screenshots directory for greater impact! -->

## 🛠 Features

✨ **Next.js 15 with Turbopack** — Blazing fast development with latest app routing and SSR

🤖 **AI-Powered Resume Generation** — Generate professional resume content using Groq/Hugging Face AI

🎤 **Speech-to-Text Input** — Native Web Speech API integration for hands-free resume editing

📊 **Real-time ATS Scoring** — Instant feedback on resume optimization with detailed analysis

🎨 **Beautiful UI with Tailwind CSS** — Modern, responsive design with dark mode support

📄 **PDF Export** — Download your resume as a professionally formatted PDF

🔍 **ATS Testing** — Test your resume against job descriptions for keyword matching

🎯 **Multiple Resume Sections** — Personal info, summary, skills, experience, projects, certifications, and more

💾 **Local Storage** — Auto-save your progress in the browser

🛠 **TypeScript** — Type-safe, maintainable codebase

📱 **Fully Responsive** — Perfect experience on desktop, tablet, and mobile devices

## 📂 Directory Structure

```
HireByte/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage with hero section
│   │   ├── layout.tsx                  # Root layout with metadata
│   │   ├── resume-page.tsx             # Resume builder page
│   │   ├── contact/                    # Contact page
│   │   └── api/
│   │       └── ai/                     # AI API routes
│   │           ├── analyze-ats/        # ATS scoring endpoint
│   │           ├── chat/               # AI chat endpoint
│   │           ├── extract-text/       # PDF text extraction
│   │           └── generate-resume/    # Resume generation
│   ├── components/
│   │   ├── resume-builder.tsx          # Main resume editor with speech-to-text
│   │   ├── resume-preview.tsx          # Live resume preview
│   │   ├── ats-testing-section.tsx     # ATS testing interface
│   │   ├── ai-resume-dialog.tsx        # AI generation dialog
│   │   ├── hero-section.tsx            # Landing page hero
│   │   ├── footer.tsx                  # Site footer
│   │   └── ui/                         # Reusable UI components
│   ├── lib/
│   │   ├── ai-utils.ts                 # AI integration utilities
│   │   ├── api-config.ts               # API configuration
│   │   ├── resume-template.ts          # Resume templates
│   │   ├── file-utils.ts               # File handling utilities
│   │   └── types.ts                    # TypeScript type definitions
│   └── hooks/                          # Custom React hooks
├── public/
│   ├── favicon.png                     # Site favicon
│   ├── manifest.json                   # PWA manifest
│   └── robots.txt                      # SEO robots file
├── docs/                               # Documentation
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- AI API Key (Groq or Hugging Face) for AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhijxxt14/HireByte.git
cd HireByte

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# AI Configuration (choose one)
GROQ_API_KEY=your_groq_api_key_here
# OR
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Optional: Other API keys
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Usage

1. **Create Your Resume**: Fill in your personal information, work experience, skills, and more
2. **Use Speech-to-Text**: Click the microphone icon on any text field to dictate content
3. **AI Generation**: Use the AI dialog to generate professional resume content
4. **ATS Testing**: Test your resume against job descriptions to optimize for ATS systems
5. **Download PDF**: Export your resume as a professionally formatted PDF

## 🤖 AI Features

- **Resume Generation**: Generate complete resume sections using AI
- **ATS Analysis**: Real-time scoring and optimization suggestions
- **Smart Suggestions**: AI-powered content recommendations
- **Keyword Optimization**: Automatically optimize for job descriptions

## 🎤 Speech-to-Text

The speech-to-text feature uses the Web Speech API:
- Click any microphone icon to start dictation
- Supports continuous speech recognition
- Works on Chrome, Edge, and Safari
- Requires HTTPS or localhost for security

## 📦 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
netlify deploy
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 with Turbopack |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI primitives |
| **AI** | Groq SDK / Hugging Face Inference |
| **PDF Generation** | jsPDF with html2canvas |
| **Icons** | Lucide React |
| **Speech** | Web Speech API (native) |
| **Hosting** | Vercel / Netlify |

## 📝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature-name"`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## 👥 Authors

- **Abhijeet** - [@Abhijxxt14](https://github.com/Abhijxxt14)
- **Jeeban** - [@Jeeban-2006](https://github.com/Jeeban-2006)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Groq](https://groq.com/) - AI inference
- [Lucide](https://lucide.dev/) - Icons

## 💬 Support

- 🐛 Found a bug? [Open an issue](https://github.com/Abhijxxt14/HireByte/issues)
- 💡 Have a feature request? [Start a discussion](https://github.com/Abhijxxt14/HireByte/discussions)
- ⭐ Like the project? Give it a star!

---

<p align="center">Built with ❤️ by the HireByte team</p>