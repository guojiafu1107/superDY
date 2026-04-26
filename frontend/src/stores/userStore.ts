import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserAccount } from '@/types';

interface UserState {
  user: User | null;
  accounts: UserAccount[];
  currentAccount: UserAccount | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAccounts: (accounts: UserAccount[]) => void;
  setCurrentAccount: (account: UserAccount) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accounts: [],
      currentAccount: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setAccounts: (accounts) => set({ accounts }),
      setCurrentAccount: (account) => set({ currentAccount: account }),
      logout: () => set({ user: null, accounts: [], currentAccount: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
