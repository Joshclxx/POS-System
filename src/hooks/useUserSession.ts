import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StateCreator } from "zustand";

type UserStore = {
  userId: string | null;
  userRole: "admin" | "cashier" | "manager" | null;
  userEmail: string | null;
  loggedIn: boolean;
  sessionId: number | null;
  hasHydrated: boolean;
  setUser: (
    id: string,
    role: UserStore["userRole"],
    email: string,
    sessionId: number | null
  ) => void;
  logout: () => void;
};

let _set: Parameters<StateCreator<UserStore>>[0];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => {
      _set = set;

      return {
        userId: null,
        userRole: null,
        userEmail: null,
        loggedIn: false,
        sessionId: null,
        hasHydrated: false,

        setUser: (id, role, email, sessionId) => {
          set({
            userId: id,
            userRole: role,
            userEmail: email,
            loggedIn: true,
            sessionId,
          });
        },

        logout: () => {
          set({
            userId: null,
            userRole: null,
            userEmail: null,
            loggedIn: false,
            sessionId: null,
          });
        },
      };
    },
    {
      name: "user-storage",
      partialize: (state) => ({
        userId: state.userId,
        userRole: state.userRole,
        userEmail: state.userEmail,
        loggedIn: state.loggedIn,
        sessionId: state.sessionId,
      }),
      onRehydrateStorage: () => () => {
        _set?.({ hasHydrated: true });
      },
    }
  )
);
