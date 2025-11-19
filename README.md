This is the [assistant-ui](https://github.com/Yonom/assistant-ui) starter project for Quabble AI.

## Getting Started

### 1. Install Dependencies

First, install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenAI API Key (required for AI features)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Quabble Backend API (required for authentication)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Email Verification Callback URL (required for signup)
NEXT_PUBLIC_CALLBACK_URL=http://localhost:3000/congrats

# Optional: Redirect URL
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000

# Optional: Google OAuth (if using Google login)
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: Amplitude Analytics
NEXT_PUBLIC_AMPLITUDE_KEY=your_amplitude_key
```

See `.env.example` for a complete reference.

### 3. Run the Development Server

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Authentication Flow

This application implements a complete email verification authentication flow:

### Signup Flow
1. User enters email and password on `/signup`
2. System sends verification email via backend API
3. User receives email with verification link
4. User clicks link → redirected to `/congrats?token=xxx`
5. Token is verified automatically
6. User can now log in

### Login Flow
1. User enters email and password on `/login`
2. System validates credentials with backend API
3. On success, user is redirected to main page
4. Auth tokens are stored in localStorage

### API Endpoints Used
- `POST /api/auth/v3/signup` - Create new account and send verification email
- `POST /api/auth/v3/verify-email` - Verify email token
- `POST /wapi/auth/signin` - Login with email/password

## Project Structure

```
quabble-ai/
├── app/
│   ├── signup/         # Signup page with email verification
│   ├── login/          # Login page
│   ├── congrats/       # Email verification success page
│   └── page.tsx        # Main page
├── lib/
│   ├── api.ts          # Axios instance and API utilities
│   ├── constants.ts    # API routes and constants
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── store/          # Zustand state management
└── components/         # Reusable components
```

## Notes

Watermelon Tai-chi video source: https://quabble-cdn.clubmuse.live/workouts/videos/watermelontaichi/taichi-duck-video-720.mp4
