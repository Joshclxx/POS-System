import { create } from "zustand";
import { persist } from "zustand/middleware";

// type UserStore = {
//   userId: string | null;
//   userRole: "admin" | "cashier" | "manager" | null;
//   userEmail: string | null;
//   loggedIn: boolean;
//   sessionId: number | null;

//   setUser: (
//     id: string,
//     role: UserStore["userRole"],
//     email: string,
//     sessionId: number | null
//   ) => void; //sessionId null forr default accunts
//   logout: () => void;
// };

// export const useUserStore = create<UserStore>()(
//   persist(
//     (set) => ({
//       userId: null,
//       userRole: null,
//       userEmail: null,
//       loggedIn: false,
//       sessionId: null,

//       setUser: async (id, role, email, sessionId) => {
//         set({
//           userId: id,
//           userRole: role,
//           userEmail: email,
//           loggedIn: true,
//           sessionId: sessionId,
//         });
//       },

//       logout: () => {
//         set({
//           userId: null,
//           userRole: null,
//           userEmail: null,
//           loggedIn: false,
//           sessionId: null,
//         });
//       },
//     }),
//     {
//       name: "user-storage", // key in localStorage
//       partialize: (state) => ({
//         userId: state.userId,
//         userRole: state.userRole,
//         userEmail: state.userEmail,
//         loggedIn: state.loggedIn,
//         sessionId: state.sessionId,
//       }),
//     }
//   )
// );

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

let _set: any;

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
