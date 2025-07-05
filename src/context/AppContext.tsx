/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface DayPlan {
  day: number;
  title: string;
  reading: string;
  mcq: {
    question: string;
    options: string[];
    answer: string;
  }[];
  isCompleted: boolean;
}

interface CurrentPlan {
  topic: string;
  currentDay: number;
  plan: DayPlan[];
}

interface User {
  _id: string;
  email: string;
  name?: string;
  occupation?: string;
  currPlan?: CurrentPlan;
  milestones: string[]; // Changed from [string] to string[]
  league: "Ivory" | "Silver" | "Gold" | "Platinum" | "None";
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/user/me");
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      } else {
        toast.error(res.data.error || "Failed to fetch user.");
      }
    } catch (err: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
