import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStore = {
  userId: string | null;
  userRole: 'admin' | 'cashier' | 'manager' | null;
  userEmail: string | null;
  loggedIn: boolean;

  setUser: (id: string, role: UserStore['userRole'], email: string) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      userRole: null,
      userEmail: null,  
      loggedIn: false,

      setUser: (id, role, email) => {
        set({ userId: id, userRole: role, userEmail: email, loggedIn: true });
      },

      logout: () => {
        set({ userId: null, userRole: null, userEmail: null, loggedIn: false });
      },
    }),
    {
      name: 'user-storage', // key in localStorage
      partialize: (state) => ({
        userId: state.userId,
        userRole: state.userRole,
        userEmail: state.userEmail,
        loggedIn: state.loggedIn,
      }),
    }
  )
);
