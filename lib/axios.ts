import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { useAuthStore } from "@/stores/useAuthStore";

export const api = axios.create({
  baseURL: "https://localhost:7221",
  withCredentials: true,
  paramsSerializer: (params) => {
    const parts = [];
    for (const key in params) {
      const value = params[key];
      if (value === undefined)
        continue;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
          }
        });
      }
      else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
    return parts.join("&");
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().jwtToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Debounce logout so rapid concurrent 401s only redirect once ───────────────
let isLoggingOut = false;

function handleLogout() {
  if (isLoggingOut) return;
  isLoggingOut = true;

  const authStore = useAuthStore.getState();
  authStore.setJwtToken(null);
  authStore.setHasAcceptedTerms(false);
  authStore.setHasJustLoggedIn(false);

  if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }

  // Reset flag after navigation
  setTimeout(() => { isLoggingOut = false; }, 3000);
}

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = camelcaseKeys(response.data, { deep: true });
    }
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
    });

      if (error.code === "ERR_NETWORK") {
      return Promise.reject(error);
    }

    // ── 401: token expired or invalid — log out once ──────────────────────
    if (error.response?.status === 401) {
      handleLogout();
    }

    return Promise.reject(error);
  },
);