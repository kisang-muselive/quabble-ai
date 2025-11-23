import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthInfo } from "@/lib/types/auth";
import { STORAGE_KEY } from "@/lib/constants";
import { getAccessToken, setAccessToken, expireAccessToken } from "@/lib/api";

interface AuthState {
  authInfo: AuthInfo | null;
  isAuthenticated: boolean;
  setAuthInfo: (info: AuthInfo) => void;
  clearAuthInfo: () => void;
  loadAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authInfo: null,
      isAuthenticated: false,

      setAuthInfo: (info: AuthInfo) => {
        setAccessToken(info.accessToken);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, info.accessToken);
          window.localStorage.setItem(STORAGE_KEY.REFRESH_TOKEN, info.refreshToken);
          window.localStorage.setItem(STORAGE_KEY.EMAIL, info.email);
        }
        set({
          authInfo: info,
          isAuthenticated: true,
        });
      },

      clearAuthInfo: () => {
        expireAccessToken();
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
          window.localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
          window.localStorage.removeItem(STORAGE_KEY.EMAIL);
        }
        set({
          authInfo: null,
          isAuthenticated: false,
        });
      },

      loadAuthFromStorage: () => {
        if (typeof window === "undefined") return;

        const accessToken = getAccessToken();
        const refreshToken = window.localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN);
        const email = window.localStorage.getItem(STORAGE_KEY.EMAIL);

        if (accessToken && refreshToken && email) {
          // Try to load full auth info from persisted state
          const persistedState = window.localStorage.getItem("auth-storage");
          if (persistedState) {
            try {
              const parsed = JSON.parse(persistedState);
              if (parsed.state?.authInfo) {
                set({
                  authInfo: parsed.state.authInfo,
                  isAuthenticated: true,
                });
                return;
              }
            } catch (e) {
              console.error("Failed to parse persisted auth state", e);
            }
          }
          
          // Fallback to minimal auth info
          set({
            authInfo: {
              id: 0,
              username: "",
              avatarType: 0,
              timezone: "",
              heart: 0,
              totalHeart: 0,
              closeness: "",
              isSubscribe: false,
              userType: "",
              uuid: "",
              createdAt: "",
              email: email,
              number: "",
              accessToken: accessToken,
              refreshToken: refreshToken,
              sendbirdToken: "",
              isExist: false,
            },
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authInfo: state.authInfo,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
