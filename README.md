# CineVault — YouTube-Inspired Video Editing Portfolio & Platform

> A production-ready, responsive video editing portfolio website designed with the authentic interface of **YouTube** (`youtube.com`), complete with vertical **Shorts**, landscape cinema watch pages, channel profile, and a private **YouTube Studio** administration panel.

---

## 🚀 Live Demo & Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + YouTube Dark Theme Design Tokens
- **Icons**: Lucide React
- **Deployment**: Vercel (Optimized SPA routing via `vercel.json`)
- **Backend / Storage**: Zero-config persistent browser storage + Optional Supabase PostgreSQL schema (`supabase/schema.sql`)

---

## 📦 How to Deploy from GitHub to Vercel

Follow these steps to deploy your video editing portfolio to your custom Vercel domain.

### Step 1: Initialize Git and Push to GitHub

1. Open your terminal in this project root:
   ```bash
   git init
   git add .
   git commit -m "feat: complete YouTube-style video editing portfolio with studio admin"
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g., `video-editing-portfolio`).

3. Link your local repository to GitHub and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```

---

### Step 2: Connect and Deploy on Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New…** → **Project**.
3. Select your newly created GitHub repository (`video-editing-portfolio`) and click **Import**.
4. Vercel automatically detects the Vite framework settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**! Vercel will build and launch your live portfolio in under 60 seconds.

---

### Step 3: Configure Environment Variables on Vercel

In your Vercel Project Settings → **Environment Variables**, configure the following variables:

| Variable Name | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `VITE_APP_URL` | Your live Vercel production domain | `https://your-portfolio.vercel.app` |
| `VITE_ADMIN_EMAIL` | Master Administrator Email | `ompatel787877@gmail.com` |
| `VITE_SITE_NAME` | Website Branding Title | `YouTube - Video Editing Portfolio` |
| `VITE_SUPABASE_URL` | *(Optional)* Supabase Project URL | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(Optional)* Supabase Anon Public Key | `eyJhbGciOi...` |

*(Note: If you do not configure Supabase, the application automatically uses high-speed persistent browser storage with zero external dependencies).*

---

## 🔒 Accessing the YouTube Studio Admin Dashboard

To manage your portfolio without touching any code:

1. Navigate to:
   ```text
   https://your-portfolio.vercel.app/?admin=true
   ```
   *(or click the **Studio** icon in the top header).*

2. Sign in with your master administrator credentials:
   - **Email**: `ompatel787877@gmail.com`
   - **Default Initial Password**: `admin123456`

3. Once signed in to **YouTube Studio**, you can:
   - **Dashboard**: View lifetime views, total likes, subscriber counts, and recent performance.
   - **Content Manager**: Upload and publish new videos, Shorts, and commercial case studies.
   - **Client Inquiries**: Review incoming briefs submitted through the public *"Hire Editor"* flow, with budget breakdowns.
   - **Channel Customization**: Change your channel name, banner, handle, bio, and software mastery list.
   - **Admin Settings**: Securely update your administrator password at any time.

---

## 🎨 Features Overview

### 1. Public YouTube Experience
- **Authentic YouTube UI**: Red play button logo, dark `#0f0f0f` background, Roboto font stack, and responsive card grid.
- **Top Category Chips**: Horizontally scrollable filter pills ("All", "Shorts", "Video Editing", "DaVinci Resolve", "Cinematic Films", "Automotive", etc.).
- **YouTube Shorts Shelf**: 9:16 vertical cards with play overlays and view counts.
- **Cinema Watch Page**:
  - Full-screen & Theater mode toggle (`21:9` expanded player).
  - Segmented Thumbs Up / Down with live counter.
  - Interactive **Before & After Color Grade Slider** (Flat Raw Log vs Final 35mm Master).
  - Working **Comments Section** where viewers can type and submit comments.
  - Share dialog supporting WhatsApp, Twitter/X, and embed `<iframe>` code.
- **Creator Channel Page**:
  - Panoramic banner, avatar, verified badge, subscriber count.
  - Video tabs: *Home*, *Videos*, *Shorts*, *About & Rig*.
- **Client Inquiry Modal**:
  - Validated brief submission form with project type, budget tier, reference URL, and turnaround specifications.

### 2. Mobile Responsive Design
- Mobile top header with search overlay and notification drawer.
- Fixed bottom navigation bar with:
  - **Home**
  - **Shorts**
  - **(+) Create / Inquire**
  - **Subscriptions**
  - **You** (Channel Profile)
- Safe-area spacing adhering to mobile guidelines.

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start local dev server (port 3000)
npm run dev

# Run type check and linter
npm run lint

# Build production bundle
npm run build
```

---

## 📄 License

Apache-2.0 License.
Built for professional video editors, colorists, and commercial creators.
