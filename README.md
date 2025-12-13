# <p align="center">🚀 HireByte</p>

<p align="center">
  <img src="https://img.shields.io/github/issues/Abhijxxt14/HireByte?style=flat-square" alt="issues" />
  <img src="https://img.shields.io/github/stars/Abhijxxt14/HireByte?style=flat-square" alt="stars" />
  <img src="https://img.shields.io/github/last-commit/Abhijxxt14/HireByte?style=flat-square" alt="last-commit" />
</p>

<p align="center">
  <b>A Modern AI-Powered ATS-Friendly Resume Builder with Speech-to-Text & Drag-and-Drop</b><br>
  <i>Build, optimize, and score your resume with AI assistance, voice input, and real-time ATS analysis.</i>
</p>

## ✨ Overview

HireByte is a cutting-edge resume building platform built with **Next.js 16**, **TypeScript**, and **AI-powered features**.
It helps job seekers create ATS-optimized resumes with real-time scoring, AI-powered content generation, speech-to-text input, and drag-and-drop customization.

## 🎯 Key Features

### Core Features
- ✨ **Next.js 16 with Turbopack** — Blazing fast development with latest app routing and SSR
- 🤖 **Dual AI Integration** — Groq (Llama 3.3 70B) + Google Gemini 2.0 Flash fallback
- 🎤 **Speech-to-Text Input** — Native Web Speech API for hands-free resume editing
- 🎯 **Drag-and-Drop Builder** — Reorder resume sections with smooth animations
- 📄 **Advanced PDF Export** — Two export options (jsPDF + React-PDF)
- 📊 **Real-time ATS Scoring** — Instant feedback with detailed analysis
- 🎨 **Beautiful UI** — Modern, responsive design with dark mode support
- 💾 **Auto-save** — Progress saved automatically in browser
- 📱 **Fully Responsive** — Perfect on desktop, tablet, and mobile

### Advanced Features
- 🔍 **Keyword Matching** — AI-powered keyword optimization
- 📈 **Semantic Analysis** — HuggingFace embeddings for resume-job matching
- 🎨 **Customizable Sections** — Personal info, summary, skills, experience, projects, certifications, awards, languages
- 🌙 **Dark Mode** — Beautiful theme switching
- 🚀 **PDF Text Extraction** — Upload existing resumes for analysis
- 💬 **AI Chat** — Interactive resume improvement suggestions

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
# AI Configuration - Groq (for chat & resume generation) - REQUIRED
GROQ_API_KEY=your_groq_api_key_here

# AI Configuration - Google Gemini (fallback for ATS analysis) - OPTIONAL
GOOGLE_GEMINI_API_KEY=your_gemini_key_here

# AI Configuration - HuggingFace (for embeddings & ATS scoring) - OPTIONAL
HUGGINGFACE_API_KEY=your_huggingface_key_here

# Python Backend API Configuration - OPTIONAL
NEXT_PUBLIC_PYTHON_API_URL=http://localhost:5000

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:9002
NEXT_PUBLIC_SITE_NAME=HireByte
NEXT_PUBLIC_SITE_DESCRIPTION=AI-powered resume builder and ATS compatibility checker

# Optional - Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=
GOOGLE_SITE_VERIFICATION=

# Optional - Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@hirebyte
NEXT_PUBLIC_LINKEDIN_URL=

# Optional - Contact
NEXT_PUBLIC_CONTACT_EMAIL=contact@hirebyte.com
```

### Get API Keys

**Groq (Primary - Free):**
- Visit: https://console.groq.com
- Create account and generate API key
- Free tier available with generous limits

**Google Gemini (Fallback - Free):**
- Visit: https://makersuite.google.com/app/apikey  
- Create API key
- Free tier: 1500 requests/day

**HuggingFace (Optional - Free):**
- Visit: https://huggingface.co/settings/tokens
- Create read token
- Used for embeddings

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

### Resume Building
1. Navigate to the resume builder
2. Fill in your personal information, work experience, skills, and more
3. Use microphone icons for voice input on any field
4. Watch live preview update in real-time

### Speech-to-Text
1. Click microphone icon next to any text field
2. Allow microphone permissions if prompted
3. Speak clearly - text appears in real-time
4. Click again to stop recording
- **Browser Support**: Chrome, Edge, Safari (Firefox limited)
- **Requirements**: HTTPS or localhost

### PDF Export
1. Complete your resume
2. Scroll to bottom of preview
3. Choose export option:
   - **Download PDF** (React-PDF) - Modern, ATS-friendly
   - **Legacy PDF** (jsPDF) - Alternative format

### ATS Testing
1. Upload resume PDF or paste content  
2. Add job description
3. Click "Analyze Resume"
4. Get instant score and detailed feedback with:
   - Overall ATS compatibility score (0-100)
   - Strengths with examples
   - Weaknesses and gaps
   - Actionable improvement suggestions

## 🤖 AI Features

### Dual AI System
- **Primary**: Groq (Llama 3.3 70B)
  - Ultra-fast inference (< 1 second)
  - High quality analysis
  - Free tier available
  
- **Fallback**: Google Gemini 2.0 Flash
  - Activates if Groq unavailable
  - 1500 free requests/day
  - Detailed feedback

### AI Capabilities
- ✅ Resume content generation
- ✅ ATS compatibility scoring
- ✅ Keyword optimization
- ✅ Semantic analysis via HuggingFace embeddings
- ✅ Smart suggestions for improvement
- ✅ Real-time chat assistance

### How AI Analysis Works
1. **Semantic Similarity** (40%) - HuggingFace embeddings compare resume to job
2. **Keyword Match** (35%) - Analyzes presence of key terms
3. **Skill Match** (25%) - Technical skills alignment
4. **AI Feedback** - Groq/Gemini generates detailed insights

## 🎨 Advanced Features

### Voice Input Integration

Already integrated in resume builder! Use the microphone icon on any field.

**Custom Implementation Example:**
```tsx
import { VoiceInputButton } from '@/components/ui/voice-input-button';

<div className="flex gap-2">
  <Input value={text} onChange={(e) => setText(e.target.value)} />
  <VoiceInputButton 
    onTranscriptChange={(transcript) => setText(text + ' ' + transcript)}
  />
</div>
```

### Drag-and-Drop Resume Sections

**Components Ready:**
- `draggable-resume-builder.tsx` - Main wrapper
- Smooth animations
- Touch-screen compatible
- Keyboard navigation support

**Usage Example:**
```tsx
import { DraggableResumeBuilder } from '@/components/draggable-resume-builder';

const [sections, setSections] = useState([
  { id: 'experience', type: 'experience', content: <ExperienceSection /> },
  { id: 'education', type: 'education', content: <EducationSection /> },
  { id: 'skills', type: 'skills', content: <SkillsSection /> },
]);

<DraggableResumeBuilder
  sections={sections}
  onSectionsReorder={setSections}
/>
```

### Custom PDF Generation

**React-PDF Implementation:**
```tsx
import { ResumePDF } from '@/components/resume-pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';

<PDFDownloadLink
  document={<ResumePDF resume={resumeData} sectionOrder={customOrder} />}
  fileName="resume.pdf"
>
  {({ loading }) => loading ? 'Generating...' : 'Download PDF'}
</PDFDownloadLink>
```

**Features:**
- Exact layout matching
- Respects section order
- ATS-friendly formatting
- Professional styling

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
| **Framework** | Next.js 16 with Turbopack |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI + shadcn/ui |
| **AI - Primary** | Groq SDK (Llama 3.3 70B) |
| **AI - Fallback** | Google Generative AI (Gemini 2.0 Flash) |
| **AI - Embeddings** | HuggingFace Inference API |
| **PDF - Modern** | @react-pdf/renderer |
| **PDF - Legacy** | jsPDF with html2canvas |
| **Drag-and-Drop** | @dnd-kit |
| **Speech** | Web Speech API (native) |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Hosting** | Vercel / Netlify |

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "16.0.10",
    "react": "^18.3.1",
    "typescript": "^5",
    "groq-sdk": "^0.37.0",
    "@google/generative-ai": "^0.x.x",
    "@react-pdf/renderer": "^x.x.x",
    "@dnd-kit/core": "^x.x.x",
    "@dnd-kit/sortable": "^x.x.x",
    "react-hook-form": "^7.54.2",
    "zod": "^3.24.2",
    "pdf2json": "^x.x.x"
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Environment Variables for Production
Make sure to add all environment variables to your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

## 🧪 Testing Features

### Voice Input
1. ✅ Click mic icon on any field
2. ✅ Allow browser permissions
3. ✅ Speak clearly
4. ✅ See text appear in real-time

### PDF Download
1. ✅ Fill resume sections
2. ✅ Click "Download PDF"
3. ✅ Verify formatting matches preview

### AI Analysis
1. ✅ Upload resume or paste text
2. ✅ Add job description
3. ✅ Click "Analyze Resume"
4. ✅ Check score and feedback

### Drag-and-Drop (When Integrated)
1. ✅ Hover over sections
2. ✅ Drag grip handle
3. ✅ Reorder sections
4. ✅ PDF respects new order

## 📁 Component Structure

```
src/components/
├── resume-builder.tsx              # Main builder with voice input
├── resume-preview.tsx              # Live preview with PDF download
├── resume-pdf.tsx                  # React-PDF renderer
├── resume-download-button.tsx      # PDF download component
├── draggable-resume-builder.tsx    # Drag-and-drop wrapper
├── ats-testing-section.tsx         # ATS analysis UI
├── ui/
│   ├── voice-input-button.tsx     # Voice input component
│   └── [other-ui-components]
└── [other-components]

src/hooks/
├── use-voice-input.ts              # Voice input hook
└── [other-hooks]

src/lib/
├── ai-service.ts                   # AI integration (Groq + Gemini)
├── ai-utils.ts                     # AI helper functions
├── api-config.ts                   # API configuration
├── resume-text-extractor.ts        # PDF text extraction
└── types.ts                        # TypeScript definitions
```

## � Troubleshooting

### Voice Input Not Working
- **Browser compatibility**: Chrome, Edge, Safari (iOS 14+) - Firefox not fully supported
- **Permissions**: Allow microphone access when prompted
- **HTTPS**: Speech API requires secure context (localhost or HTTPS)
- **Fix**: Check browser console for permission errors

### PDF Download Issues
- **Large resumes**: May timeout if >10 pages, optimize content
- **Fonts**: Custom fonts may not render in PDF, stick to system fonts
- **Fix**: Check browser console, ensure all data fields are valid

### AI Analysis Errors
- **Groq rate limits**: 30 requests/min on free tier
- **Fallback to Gemini**: Automatic when Groq fails
- **API keys**: Verify all keys in `.env.local`
- **Fix**: Check terminal logs for specific API errors

### PDF Text Extraction Fails
- **Unsupported PDFs**: Some encrypted/scanned PDFs may not extract
- **Empty text**: PDF might be image-based (OCR not supported)
- **Fix**: Try re-saving PDF or using text-based PDF

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Environment Variables Not Loading
```bash
# Restart dev server after changing .env.local
# Verify NEXT_PUBLIC_ prefix for client-side variables
npm run dev
```

## 🔧 Advanced Integration

### Custom Voice Input

```typescript
import { useVoiceInput } from '@/hooks/use-voice-input';

export function CustomField() {
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useVoiceInput();
  
  const handleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };
  
  return (
    <div>
      <input value={transcript} readOnly />
      <button onClick={handleVoice}>
        {isListening ? 'Stop' : 'Start'} Recording
      </button>
    </div>
  );
}
```

### AI Service API

```typescript
import { analyzeResumeWithAI } from '@/lib/ai-service';

async function analyzeResume(text: string, jobDesc: string) {
  try {
    const result = await analyzeResumeWithAI(text, jobDesc);
    console.log('Score:', result.score);
    console.log('Feedback:', result.feedback);
    console.log('AI Provider:', result.provider); // 'groq' or 'gemini'
  } catch (error) {
    console.error('AI analysis failed:', error);
  }
}
```

## 🎯 Feature Checklist

Before deployment:

- [ ] All API keys configured in production environment
- [ ] Voice input tested across target browsers
- [ ] PDF download generates correct formatting
- [ ] ATS analysis returns valid scores (0-100)
- [ ] Drag-and-drop (if integrated) preserves section order
- [ ] Mobile responsive design tested
- [ ] Error handling displays user-friendly messages
- [ ] SEO metadata configured
- [ ] Analytics tracking setup (if using)
- [ ] Contact form submissions working

## �📝 Contributing

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