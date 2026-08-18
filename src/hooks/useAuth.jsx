import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { toast } from "sonner";
import { sendEmailWithResend } from "../lib/api/resend.functions";

const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and subscribe
  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Setup real Supabase Auth
      const getSessionAndProfile = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email,
              full_name: profile?.full_name || session.user.user_metadata?.full_name || "New User",
              phone: profile?.phone || "",
              city: profile?.city || "Bengaluru",
              role: "Household", // default role
            });
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching session/profile:", err);
        } finally {
          setLoading(false);
        }
      };

      getSessionAndProfile();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email,
            full_name: profile?.full_name || session.user.user_metadata?.full_name || "New User",
            phone: profile?.phone || "",
            city: profile?.city || "Bengaluru",
            role: "Household",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Setup Local Storage Mock Auth
      const mockSession = localStorage.getItem("reshelf_session");
      if (mockSession) {
        try {
          setUser(JSON.parse(mockSession));
        } catch (e) {
          localStorage.removeItem("reshelf_session");
        }
      }
      setLoading(false);
    }
  }, []);

  // 1. Sign In
  const signIn = async (email, password) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      // Mock Sign In
      const usersStr = localStorage.getItem("reshelf_mock_users") || "[]";
      const users = JSON.parse(usersStr);

      // Seed default user if none exist
      if (users.length === 0) {
        users.push({
          email: "aisha@example.com",
          password: "demo1234",
          full_name: "Aisha Khan",
          phone: "+91 98000 11223",
          city: "Bengaluru",
        });
        localStorage.setItem("reshelf_mock_users", JSON.stringify(users));
      }

      const match = users.find((u) => u.email === email && u.password === password);
      if (!match) {
        throw new Error("Invalid email or password. Use aisha@example.com / demo1234 or sign up.");
      }

      const userData = {
        id: "mock-user-" + email,
        email: match.email,
        full_name: match.full_name,
        phone: match.phone || "",
        city: match.city || "Bengaluru",
        role: "Household",
      };

      localStorage.setItem("reshelf_session", JSON.stringify(userData));
      setUser(userData);
      toast.success("Welcome back, " + userData.full_name);
      return { user: userData };
    }
  };

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      return data;
    } else {
      // Mock Google Sign In
      const email = "google_user@example.com";
      const usersStr = localStorage.getItem("reshelf_mock_users") || "[]";
      const users = JSON.parse(usersStr);
      
      let match = users.find((u) => u.email === email);
      if (!match) {
        match = {
          email,
          password: "oauth_mock_pass",
          full_name: "Google User",
          phone: "",
          city: "Bengaluru",
        };
        users.push(match);
        localStorage.setItem("reshelf_mock_users", JSON.stringify(users));
      }

      const userData = {
        id: "mock-user-google",
        email: match.email,
        full_name: match.full_name,
        phone: match.phone || "",
        city: match.city || "Bengaluru",
        role: "Household",
      };

      localStorage.setItem("reshelf_session", JSON.stringify(userData));
      setUser(userData);
      toast.success("Signed in with Google!");
      return { user: userData };
    }
  };

  // 2. Sign Up
  const signUp = async (email, password, metadata) => {
    const fullName = metadata?.full_name || "New User";
    const phone = metadata?.phone || "";
    const city = metadata?.city || "Bengaluru";

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            city,
          },
        },
      });
      if (error) throw error;

      // Send welcome email via Resend (server function)
      try {
        await sendEmailWithResend({
          to: email,
          subject: "Welcome to ReShelf! 🥬",
          html: `
            <h1>Welcome to ReShelf, ${fullName}!</h1>
            <p>We're thrilled to have you join our zero-waste community.</p>
            <p>Start tracking your grocery shelf dates, setting alerts, and sharing surplus before it expires!</p>
            <br/>
            <p>Warmly,</p>
            <p>The ReShelf Team</p>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }

      return data;
    } else {
      // Mock Sign Up
      const usersStr = localStorage.getItem("reshelf_mock_users") || "[]";
      const users = JSON.parse(usersStr);

      if (users.some((u) => u.email === email)) {
        throw new Error("User already exists with this email.");
      }

      const newUser = {
        email,
        password,
        full_name: fullName,
        phone,
        city,
      };

      users.push(newUser);
      localStorage.setItem("reshelf_mock_users", JSON.stringify(users));

      // Trigger mock welcome email console log
      try {
        await sendEmailWithResend({
          to: email,
          subject: "Welcome to ReShelf! 🥬",
          html: `Welcome to ReShelf, ${fullName}!`,
        });
      } catch (e) {}

      // Automatically sign in the user
      const userData = {
        id: "mock-user-" + email,
        email,
        full_name: fullName,
        phone,
        city,
        role: "Household",
      };

      localStorage.setItem("reshelf_session", JSON.stringify(userData));
      setUser(userData);
      toast.success("Account created successfully!");
      return { user: userData };
    }
  };

  // 3. Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("reshelf_session");
      setUser(null);
      toast.success("Signed out successfully.");
    }
  };

  // 4. Update Profile
  const updateProfile = async (updates) => {
    if (!user) throw new Error("No authenticated user.");

    if (isSupabaseConfigured) {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: updates.full_name,
        phone: updates.phone,
        city: updates.city,
      });
      if (error) throw error;

      setUser((prev) => ({
        ...prev,
        ...updates,
      }));
    } else {
      // Mock update
      const session = localStorage.getItem("reshelf_session");
      if (session) {
        const u = JSON.parse(session);
        const updated = { ...u, ...updates };
        localStorage.setItem("reshelf_session", JSON.stringify(updated));

        // Also update in registered list
        const usersStr = localStorage.getItem("reshelf_mock_users") || "[]";
        const users = JSON.parse(usersStr);
        const idx = users.findIndex((x) => x.email === user.email);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updates };
          localStorage.setItem("reshelf_mock_users", JSON.stringify(users));
        }

        setUser(updated);
        toast.success("Profile updated!");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
