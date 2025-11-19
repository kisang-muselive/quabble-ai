import axios, { AxiosError } from "axios";
import { API_ROUTE, STORAGE_KEY } from "./constants";

export interface CustomApiErrorType {
  message: string;
}

export type ApiError<T = unknown> = AxiosError<T>;

let accessToken = "";

// Log the API URL being used (only in development or if explicitly enabled)
if (typeof window !== "undefined" && (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEBUG_API_URL === "true")) {
  console.log("🔸 API Base URL:", process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Request interceptor
instance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    const { config, data } = response;
    console.log(`🔸 axios_response:${config.method}:${config.url}`, data);

    // Store access token from login/signup responses
    if (
      config.method === "post" &&
      config.url &&
      [
        API_ROUTE.EMAIL_AUTO_SIGNIN,
        API_ROUTE.GOOGLE_LOGIN,
        API_ROUTE.PW_REGISTER,
        API_ROUTE.PW_SIGNIN,
      ].includes(config.url)
    ) {
      accessToken = data.message?.accessToken;
    }

    // Store in localStorage if in browser
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, accessToken);
    }

    response.data = data.message;

    return response;
  },
  (error) => {
    console.error("🔸 axios_error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const expireAccessToken = () => {
  accessToken = "";
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
  }
};

export const setAccessToken = (token: string) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, token);
  }
};

export const getAccessToken = (): string => {
  if (accessToken) return accessToken;

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    if (stored) {
      accessToken = stored;
      return stored;
    }
  }

  return "";
};

export const uploadFile = async (
  url: string,
  file: File | FormData | undefined,
  contentType: string
) => {
  const response = await fetch(
    new Request(url, {
      method: "PUT",
      body: file,
      headers: new Headers({
        "Content-Type": contentType,
      }),
    })
  );
  if (response.status !== 200) {
    throw new Error("Image upload failed");
  }
};

export default instance;
