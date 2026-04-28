# Arcadly - AI-Powered Interactive Product Demo Generator

## Overview

Arcadly is an end-to-end AI agent chat UI that generates interactive, enterprise-ready product demos inline within a conversation interface. The agent can chat normally and also create beautiful animated demo walkthroughs for any website.

## Live Deployment

**Production URL:** https://arcadly-five.vercel.app

**GitHub Repository:** https://github.com/mahdi1234-hub/Arcadly

## Architecture

### Layer 1 - Website Analysis (Cheerio)
- Scrapes and parses website structure using `cheerio`
- Extracts navigation, headings, CTAs, sections, forms, images
- API route at `/api/analyze`

### Layer 2 - Chat UI (AI Conversation)
- Custom streaming chat hook with real-time response rendering
- Cerebras LLM (Qwen 3 235B Instruct) for AI responses
- React Markdown with GFM support for rich text rendering
- Zustand for state management across chat turns

### Layer 3 - Remotion Animated Demo Video
- `@remotion/player` renders animated walkthroughs inline in chat
- `DemoComposition` with spring animations, interpolation, sequences
- Browser chrome simulation, action-specific colors and icons
- Progress bar and step indicators

### Layer 4 - Interactive Hotspots (Arcade-style)
- Clickable hotspot overlays on top of the Remotion player
- Sonar pulse animations on beacon points
- Tooltip labels with Framer Motion animations
- Step navigation via hotspot clicks

## Tech Stack

| Layer | Library |
|-------|---------|
| Website Analysis | `cheerio`, `axios` |
| AI Brain | Cerebras API (Qwen 3 235B) |
| Chat UI | Custom streaming hook, `react-markdown`, `remark-gfm` |
| Demo Video | `remotion`, `@remotion/player` |
| Interactive Hotspots | `@floating-ui/react`, `framer-motion` |
| State Management | `zustand` |
| Styling | Tailwind CSS, glassmorphism, Plus Jakarta Sans |
| Framework | Next.js 16, TypeScript |
| Deployment | Vercel |

## Design

The UI features a premium dark theme inspired by enterprise SaaS design with:
- Glassmorphism card effects with flashlight hover
- Animated gradient backgrounds
- Plus Jakarta Sans and Inter typography
- Indigo/purple accent colors
- Smooth Framer Motion transitions
- Custom scrollbars and sonar ring animations
