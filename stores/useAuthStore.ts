import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
  jwtToken: string | null;
  setJwtToken: (jwtToken: string | null) => void;
  hasAcceptedTerms: boolean;
  setHasAcceptedTerms: (hasAccepted: boolean) => void;
  hasJustLoggedIn: boolean;
  setHasJustLoggedIn: (hasJustLoggedIn: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      jwtToken: null,
      hasAcceptedTerms: false,
      hasJustLoggedIn: false,
      setJwtToken: jwtToken => set({ jwtToken }),
      setHasAcceptedTerms: hasAccepted => set({ hasAcceptedTerms: hasAccepted }),
      setHasJustLoggedIn: hasJustLoggedIn => set({ hasJustLoggedIn }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
