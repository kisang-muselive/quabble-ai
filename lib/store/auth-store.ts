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
        const email = window.localStorage.getItem(STORAGE_KEY.EMAIL);

        if (accessToken && email) {
          set({
            authInfo: {
              id: 0, // Will be populated from API
              email: email,
              accessToken: accessToken,
              refreshToken: window.localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN) || "",
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
