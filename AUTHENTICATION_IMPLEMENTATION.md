# Authentication Implementation Summary

This document summarizes the complete authentication flow implementation for quabble-ai, matching the functionality of web-sign-up-quabble.

## What Was Implemented

### 1. Core Infrastructure

#### Files Created:
- **`lib/api.ts`** - Axios instance with request/response interceptors for API calls
- **`lib/constants.ts`** - API routes, error messages, and configuration constants
- **`lib/types/auth.ts`** - TypeScript interfaces for authentication data
- **`lib/utils/timezone.ts`** - Utility functions for timezone handling
- **`lib/store/auth-store.ts`** - Zustand store for authentication state management

### 2. Authentication Pages

#### Updated Pages:
1. **`app/signup/page.tsx`** - Complete signup flow with:
   - Email and password validation
   - Password strength requirements (8+ chars, letters, numbers, special chars)
   - Email verification flow
   - Rate limiting (5 attempts per minute)
   - Two-phase UI (signup form → email sent confirmation)
   - Resend verification email functionality

2. **`app/login/page.tsx`** - Complete login flow with:
   - Email/password authentication
   - API integration with backend
   - Token storage in localStorage
   - Error handling for various scenarios
   - Forgot password placeholder

3. **`app/congrats/page.tsx`** (NEW) - Email verification page:
   - Token verification via URL parameter
   - Success/failure states
   - Deep linking to mobile app (iOS/Android)
   - Redirect to login after verification

### 3. Documentation

#### Files Created/Updated:
- **`.env.example`** - Complete environment variables reference
- **`README.md`** - Updated with:
  - Setup instructions
  - Environment variables documentation
  - Authentication flow explanation
  - Project structure overview

## Authentication Flow

### Signup Process

```
User → /signup
  ↓
Enter email & password
  ↓
POST /api/auth/v3/signup
  ↓
Backend sends verification email
  ↓
Email sent confirmation screen
  ↓
User clicks link in email
  ↓
/congrats?token=xxx
  ↓
POST /api/auth/v3/verify-email
  ↓
Success → Redirect to login
```

### Login Process

```
User → /login
  ↓
Enter email & password
  ↓
POST /wapi/auth/signin
  ↓
Receive access & refresh tokens
  ↓
Store in localStorage
  ↓
Redirect to main page
```

## API Endpoints

### Signup & Verification
- `POST /api/auth/v3/signup` - Register new user and send verification email
  - Request: `{ identifier, email, password, callback, timezone, configId }`
  - Response: Success message (email sent)

- `POST /api/auth/v3/verify-email` - Verify email token
  - Request: `{ token }`
  - Response: Verification success/failure

### Login
- `POST /wapi/auth/signin` - Authenticate user
  - Request: `{ email, password }`
  - Response: `{ id, email, username, accessToken, refreshToken }`

## Environment Variables Required

```bash
# Required for authentication
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_CALLBACK_URL=http://localhost:3000/congrats

# Optional
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=xxx
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=xxx
NEXT_PUBLIC_AMPLITUDE_KEY=xxx
```

## Security Features

1. **Password Policy**
   - Minimum 8 characters
   - Must contain letters, numbers, and special characters
   - Regex: `/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/`

2. **Rate Limiting**
   - Maximum 5 signup/resend attempts per minute
   - 60-second cooldown after exceeding limit

3. **Email Validation**
   - Format validation using regex
   - Backend verification of email uniqueness

4. **Token Security**
   - JWT tokens for authentication
   - Tokens stored in localStorage
   - Automatic token inclusion in API requests via interceptors

## Error Handling

### Signup Errors
- `400` - Email already registered
- `500` - System error

### Login Errors
- `400/401` - Invalid credentials
- `404` - Email not found
- `403` - Email not verified yet
- `500` - System error

### Verification Errors
- `400` - Invalid/expired token
- `500` - System error

## State Management

Using Zustand for authentication state:

```typescript
interface AuthState {
  authInfo: AuthInfo | null;
  isAuthenticated: boolean;
  setAuthInfo: (info: AuthInfo) => void;
  clearAuthInfo: () => void;
  loadAuthFromStorage: () => void;
}
```

## Mobile App Integration

The congrats page includes deep linking support:

- **iOS**: `quabbleapp://` scheme with App Store fallback
- **Android**: Intent URL with Play Store fallback
- **Desktop**: Redirect to https://quabble.app/

## Differences from web-sign-up-quabble

### Same Features:
- ✅ Email verification flow
- ✅ Password validation
- ✅ Rate limiting
- ✅ API endpoints
- ✅ Error handling
- ✅ Token management

### Implementation Differences:
- Uses Zustand instead of Redux for state management
- Modern Next.js App Router (instead of Pages Router)
- Simplified UI using shadcn/ui components
- TypeScript throughout
- No i18n (web-sign-up-quabble has multi-language support)
- No Amplitude analytics integration (placeholder added)
- No Google OAuth (infrastructure added, not implemented)

## Next Steps (Optional Enhancements)

1. **Forgot Password Flow** - Currently shows placeholder alert
2. **Google OAuth** - Infrastructure exists, needs implementation
3. **Amplitude Analytics** - Add event tracking
4. **Internationalization** - Add multi-language support
5. **Session Management** - Add token refresh logic
6. **Protected Routes** - Add middleware to protect authenticated pages

## Testing the Implementation

1. Start the development server:
   ```bash
   cd quabble-ai
   npm run dev
   ```

2. Configure environment variables in `.env.local`

3. Test signup flow:
   - Go to http://localhost:3000/signup
   - Enter email and password
   - Check that API call is made
   - Verify email sent screen appears

4. Test verification (with backend):
   - Click verification link in email
   - Should redirect to /congrats with token
   - Token should be verified automatically

5. Test login:
   - Go to http://localhost:3000/login
   - Enter credentials
   - Should redirect on success

## Support

For issues or questions:
- Email: quabble@muse.live
- Check console logs for API errors
- Verify environment variables are set correctly
- Ensure backend API is running and accessible
