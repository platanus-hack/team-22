import { create } from 'zustand';
import { User } from 'common/src/types';
import { fetchUserProfile } from '@common/api/users';

type UserProfile = {
  userProfile: null | User;
  setUserProfile: (userProfile: User) => void;
  clearUserProfile: () => void;
  refreshUserProfile: () => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

const useUserStore = create<UserProfile>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile: User) => set({ userProfile }),
  clearUserProfile: () => set({ userProfile: null }),
  refreshUserProfile: async () => {
    try {
      const userData = await fetchUserProfile(
        useUserStore.getState().userProfile?.auth_id as string
      );
      if (userData) {
        useUserStore.getState().setUserProfile(userData);
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  },
  darkMode: false,
  setDarkMode: (darkMode: boolean) => set({ darkMode }),
}));

export default useUserStore;
