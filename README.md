# Terminus Industrials

A modern Next.js application for Terminus Industrials - Defense-Grade Advanced Manufacturing.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Language**: TypeScript (strict mode)
- **React**: React 19
- **Styling**: CSS Modules + Global CSS
- **Linting**: ESLint with TypeScript, React, and Next.js plugins
- **Email**: Cloudflare Workers (Mailgun integration)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Yarn

### Installation

```bash
yarn install
```

### Development

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
yarn build
```

### Type Checking

```bash
yarn type-check
```

### Linting

```bash
yarn lint
yarn lint:fix  # Auto-fix issues
```

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── contact-us/              # Contact page
│   │   ├── page.tsx
│   │   ├── ContactForm.tsx
│   │   └── ContactForm.module.css
│   └── request-advance-purchase-indication/
│       ├── page.tsx             # API form page
│       ├── APIForm.tsx
│       ├── APIForm.module.css
│       └── review/              # Review & submit page
│           ├── page.tsx
│           ├── ReviewContent.tsx
│           └── ReviewContent.module.css
├── components/                   # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Modal.tsx
│   ├── form/                    # Form components
│   │   ├── FormGroup.tsx
│   │   ├── FormFieldset.tsx
│   │   ├── RadioGroup.tsx
│   │   ├── SubmitButton.tsx
│   │   └── Form.module.css
│   └── index.ts                 # Component exports
├── actions/                     # Server Actions
│   └── email.ts                 # Email sending functionality
├── types/                       # TypeScript types
│   └── forms.ts                 # Form types and constants
public/                          # Static assets
├── logo.svg
├── wordmark.svg
├── background.svg
└── ...
email-worker/                    # Cloudflare Worker for email
├── src/index.js
├── wrangler.toml
└── package.json
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_WORKER_URL` | Cloudflare Worker URL for email | Production URL |
| `NEXT_PUBLIC_BASE_URL` | Base URL for metadata | https://terminusindustrials.com |

## Features

### Pages

- **Homepage** (`/`): Hero section with company branding
- **Contact Us** (`/contact-us`): Contact form with email notifications
- **Request API** (`/request-advance-purchase-indication`): Detailed technical requirements form
- **Review** (`/request-advance-purchase-indication/review`): Review and submit API form

### Key Functionality

- **Server Actions**: Email sending is handled server-side for security
- **TypeScript**: Full type coverage with strict mode enabled
- **Responsive Design**: Mobile-first responsive layout
- **Form Persistence**: Draft forms saved to localStorage for editing

## Email Worker

The email worker is a separate Cloudflare Workers project located in `email-worker/`. It handles sending emails via Mailgun.

### Deploy Email Worker

```bash
cd email-worker
yarn install
yarn wrangler deploy
```

## Deployment

### Vercel (Recommended)

```bash
yarn build
vercel deploy
```

### Static Export

For static hosting (GitHub Pages, etc.):

1. Uncomment `output: 'export'` in `next.config.js`
2. Run `yarn build`
3. Deploy the `out/` directory

## License

Proprietary - Terminus Industrials, Inc.
