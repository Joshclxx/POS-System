import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type UserStore = {
  userId: string | null;
  userRole: 'admin' | 'cashier' | 'manager' | null;
  userEmail: string | null;
  loggedIn: boolean;
  sessionId: number | null;

  setUser: (id: string, role: UserStore['userRole'], email: string, sessionId: number | null) => void; //sessionId null forr default accunts
  logout: () => void;
};


export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      userRole: null,
      userEmail: null,  
      loggedIn: false,
      sessionId: null,

      setUser: async (id, role, email, sessionId) => {
        set({ userId: id, userRole: role, userEmail: email, loggedIn: true, sessionId: sessionId}); 
      },

      logout: () => {
        set({ userId: null, userRole: null, userEmail: null, loggedIn: false, sessionId: null });
      },
    }),
    {
      name: 'user-storage', // key in localStorage
      partialize: (state) => ({
        userId: state.userId,
        userRole: state.userRole,
        userEmail: state.userEmail,
        loggedIn: state.loggedIn,
        sessionId: state.sessionId,
      }),
    }
  )
);
