export const API_ROUTE = {
  // Authentication v3
  EMAIL_REGISTER_V2: "/api/auth/v3/signup",
  EMAIL_SIGNUP_VERIFY: "/api/auth/v3/verify-email",
  EMAIL_PASSWORD_RESET_CONFIRM: "/api/auth/v3/password/reset/confirm",
  EMAIL_SIGNUP_CONFIG: "/api/auth/v3/signup/configs",

  // Legacy auth endpoints
  EMAIL_SIGNIN: "/wapi/auth/email/signin",
  EMAIL_AUTO_SIGNIN: "/wapi/auth/email/v2/auto/signin",
  EMAIL_CHECK: "/wapi/auth/email/v2/check",
  EMAIL_SEND: "/wapi/auth/email/send",
  EMAIL_SEND_PW: "/wapi/auth/email/send/password",
  EMAIL_REGISTER_TYPE: "/wapi/auth/email/register-type",

  PW_REGISTER: "/wapi/auth/register",
  PW_SIGNIN: "/wapi/auth/signin",
  UPDATE_PW: "/wapi/auth/password",

  NUMBER_CHECK: "/wapi/auth/number/check",
  NUMBER_SEND: "/wapi/auth/number/send",
  NUMBER_VERIFY: "/wapi/auth/number/verify",
  NUMBER_SAVE: "/wapi/auth/number",

  USERNAME_CHECK: "/wapi/auth/username/check",
  GOOGLE_LOGIN: "/wapi/auth/google/signin",

  USER_PROFILE: "/wapi/users/profile-info",
};

export const STORAGE_KEY = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  EMAIL: "email",
};

export const PLATFORM = "web";

export enum LoginErrorMessage {
  NOT_FOUND = "Email not found.",
  INVALID_EMAIL = "Please enter a valid email.",
  SOCIAL_LOGIN_EXIST = "This email is previously logged in with Google.",
  ALREADY_MEMBER = "You are already a member.",
  PASSWORD_SHORT = "Passwords must be at least 8 characters long.",
  WRONG_PW = "Wrong password.",
  PW_NOT_MATCH = "Passwords do not match.",
  INVALID_PW = "Use at least 8 characters with letters, numbers, and special characters.",
  SYSTEM_ERROR = "System error.",
  INTERNAL_ERROR = "Please try again in a minute.",
  EMPTY = "",
  NOT_VERIFIED_YET = "You haven't been verified yet.",
  ALREADY_EMAIL = "Email already registered.",
}

export const PASSWORD_POLICY_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL || "http://localhost:3000";
export const CALLBACK_URL = process.env.NEXT_PUBLIC_CALLBACK_URL || "http://localhost:3000/congrats";
