import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useAuthStore = create((set, get) => ({
  // Initial states
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,
  authMessage: null,

  // Sign up with email and password
  signup: async (username, email, password) => {
    set({ isLoading: true, error: null, authMessage: "Creating account..." });

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // Store username in user metadata
          },
        },
      });

      if (error) throw error;

      // Format user object to match previous structure
      const user = data.user ? {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || username,
      } : null;

      set({
        user,
        isLoading: false,
        error: null,
        authMessage: null,
      });

      return { user, message: "Account created successfully!" };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Error signing up",
        authMessage: null,
      });
      throw error;
    }
  },

  // Login with email and password
  login: async (email, password) => {
    set({ isLoading: true, error: null, authMessage: "Logging in..." });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user ? {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
      } : null;

      set({
        user,
        isLoading: false,
        error: null,
        authMessage: null,
      });

      return { user, message: "Logged in successfully!" };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Error logging in",
        authMessage: null,
      });
      throw error;
    }
  },

  // Fetch current user session
  fetchUser: async () => {
    set({ fetchingUser: true, error: null, authMessage: "Loading..." });

    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
        };

        set({ user, fetchingUser: false, authMessage: null });
      } else {
        set({ user: null, fetchingUser: false, authMessage: null });
      }
    } catch (error) {
      set({
        fetchingUser: false,
        error: null,
        user: null,
        authMessage: null,
      });
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true, error: null, authMessage: "Logging out..." });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      set({
        user: null,
        isLoading: false,
        error: null,
        message: "Logged out successfully",
        authMessage: null,
      });

      return { message: "Logged out successfully" };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Error logging out",
        authMessage: null,
      });
      throw error;
    }
  },
}));