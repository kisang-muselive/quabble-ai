# Quabble AI Authentication Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        NEW USER SIGNUP FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

    USER                    FRONTEND                 BACKEND               EMAIL
     │                         │                        │                    │
     │  Navigate to /signup    │                        │                    │
     ├────────────────────────>│                        │                    │
     │                         │                        │                    │
     │  Enter credentials      │                        │                    │
     │  (email + password)     │                        │                    │
     ├────────────────────────>│                        │                    │
     │                         │                        │                    │
     │  Click "Sign up"        │                        │                    │
     ├────────────────────────>│  POST /api/auth/v3/signup                  │
     │                         ├───────────────────────>│                    │
     │                         │  {                     │                    │
     │                         │    email,              │  Validate email    │
     │                         │    password,           │  Create account    │
     │                         │    callback,           │  Generate token    │
     │                         │    timezone            │                    │
     │                         │  }                     ├───────────────────>│
     │                         │                        │  Send verification │
     │                         │                        │  email with link   │
     │                         │<───────────────────────┤                    │
     │                         │  200 OK                │                    │
     │<────────────────────────┤                        │                    │
     │  Show "Check email"     │                        │                    │
     │  confirmation screen    │                        │                    │
     │                         │                        │                    │
     │  Receive email          │                        │                    │
     │<────────────────────────┼────────────────────────┼────────────────────┤
     │                         │                        │                    │
     │  Click verification link│                        │                    │
     │  (contains token)       │                        │                    │
     ├────────────────────────>│                        │                    │
     │                         │                        │                    │
     │  Navigate to            │                        │                    │
     │  /congrats?token=xxx    │                        │                    │
     ├────────────────────────>│  POST /api/auth/v3/verify-email            │
     │                         ├───────────────────────>│                    │
     │                         │  { token }             │                    │
     │                         │                        │  Verify token      │
     │                         │                        │  Activate account  │
     │                         │<───────────────────────┤                    │
     │                         │  200 OK                │                    │
     │<────────────────────────┤  { success: true }     │                    │
     │  Show success screen    │                        │                    │
     │  "Welcome to Quabble!"  │                        │                    │
     │                         │                        │                    │
     │  Click "Continue to     │                        │                    │
     │  login"                 │                        │                    │
     ├────────────────────────>│                        │                    │
     │                         │                        │                    │

┌─────────────────────────────────────────────────────────────────────────┐
│                         USER LOGIN FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

    USER                    FRONTEND                 BACKEND
     │                         │                        │
     │  Navigate to /login     │                        │
     ├────────────────────────>│                        │
     │                         │                        │
     │  Enter credentials      │                        │
     │  (email + password)     │                        │
     ├────────────────────────>│                        │
     │                         │                        │
     │  Click "Log in"         │                        │
     ├────────────────────────>│  POST /wapi/auth/signin│
     │                         ├───────────────────────>│
     │                         │  {                     │
     │                         │    email,              │  Validate credentials
     │                         │    password            │  Check verification
     │                         │  }                     │  Generate tokens
     │                         │<───────────────────────┤
     │                         │  200 OK                │
     │                         │  {                     │
     │                         │    id,                 │
     │                         │    email,              │
     │                         │    accessToken,        │
     │                         │    refreshToken        │
     │                         │  }                     │
     │                         │                        │
     │                         │  Store in localStorage:│
     │                         │  - accessToken         │
     │                         │  - refreshToken        │
     │                         │  - email               │
     │                         │                        │
     │<────────────────────────┤                        │
     │  Redirect to main page  │                        │
     │  (authenticated)        │                        │
     │                         │                        │

┌─────────────────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                                       │
└─────────────────────────────────────────────────────────────────────────┘

SIGNUP ERRORS:
─────────────
400 Bad Request       → "Email already registered"
500 Server Error      → "System error. Please try again."
Rate Limit Exceeded   → "Too many attempts. Please wait 60 seconds."

LOGIN ERRORS:
────────────
400/401 Unauthorized  → "Invalid email or password"
404 Not Found         → "Email not found. Please sign up first."
403 Forbidden         → "You haven't been verified yet. Check your email."
500 Server Error      → "System error. Please try again."

VERIFICATION ERRORS:
───────────────────
400 Bad Request       → "Invalid verification token"
Token Expired         → "Invalid or expired verification link"
500 Server Error      → "System error. Please try again."

┌─────────────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                                      │
└─────────────────────────────────────────────────────────────────────────┘

ZUSTAND STORE (lib/store/auth-store.ts):
────────────────────────────────────────

State:
  authInfo: {
    id: number
    email: string
    accessToken: string
    refreshToken: string
  } | null
  isAuthenticated: boolean

Actions:
  setAuthInfo(info)     → Store user info + set authenticated
  clearAuthInfo()       → Clear tokens + logout
  loadAuthFromStorage() → Restore auth from localStorage

LOCALSTORAGE:
────────────
Keys stored:
  - "accessToken"   → JWT access token
  - "refreshToken"  → JWT refresh token
  - "email"         → User's email

┌─────────────────────────────────────────────────────────────────────────┐
│                    API REQUEST FLOW                                      │
└─────────────────────────────────────────────────────────────────────────┘

REQUEST INTERCEPTOR (lib/api.ts):
─────────────────────────────────

Every API Request:
  1. Get accessToken from memory/localStorage
  2. Add to headers: Authorization: Bearer {accessToken}
  3. Send request

RESPONSE INTERCEPTOR (lib/api.ts):
──────────────────────────────────

Every API Response:
  1. Log response for debugging
  2. If response contains accessToken:
     - Store in memory
     - Store in localStorage
  3. Extract data.message as response.data
  4. Return processed response

Error Handling:
  - Log error details
  - Reject promise with error for component handling

┌─────────────────────────────────────────────────────────────────────────┐
│                    SECURITY FEATURES                                     │
└─────────────────────────────────────────────────────────────────────────┘

PASSWORD POLICY:
───────────────
Regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/

Requirements:
  ✓ Minimum 8 characters
  ✓ At least one letter (A-Z or a-z)
  ✓ At least one number (0-9)
  ✓ At least one special character (!@#$%^&*, etc.)

RATE LIMITING:
─────────────
  Max attempts: 5 per 60 seconds
  Cooldown: 60 seconds after exceeding limit
  Applies to: Signup, Resend email

EMAIL VALIDATION:
────────────────
  Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  Checks: Basic email format
  Backend: Additional validation + uniqueness check

TOKEN SECURITY:
──────────────
  Type: JWT (JSON Web Tokens)
  Storage: localStorage (browser)
  Transmission: HTTPS only (production)
  Expiration: Set by backend
  Auto-include: Via Axios interceptors
