/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { callGroqAI } from "@/lib/GroqClient";
import { toast } from "react-hot-toast";
import { jsonrepair } from "jsonrepair";
import { useAppContext } from "@/context/AppContext";
import { GROQ_KEY } from "@/lib/GroqKey";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export interface DayPlan {
  day: number;
  title: string;
  reading: string;
  mcq: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface CurrentPlan {
  topic: string;
  currentDay: number;
  plan: DayPlan[];
}

interface DayOutline {
  day: number;
  title: string;
  reading: string;
}

interface DayMCQ {
  day: number;
  mcq: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

interface AIContextType {
  plan: CurrentPlan | null;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  completedMcqs: Record<number, number>;
  generatePlan: (topic: string, name: string, email: string) => Promise<void>;
  markMcqCompleted: (day: number) => void;
  canAccessDay: (day: number) => boolean;
  responseLoading?: boolean;
  setResponseLoading?: (loading: boolean) => void;
  topic: string;
  setTopic: (topic: string) => void;

  isListening: boolean;
  toggleListening: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: React.ReactNode }) => {
  const { fetchUser } = useAppContext();
  const [topic, setTopic] = useState(""); // user prompt
  const [plan, setPlan] = useState<CurrentPlan | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [responseLoading, setResponseLoading] = useState(false);
  const [completedMcqs, setCompletedMcqs] = useState<Record<number, number>>(
    {}
  );

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  };

  useEffect(() => {
    setTopic(transcript);
  }, [transcript]);

  const generatePlan = async (topic: string, name: string, email: string) => {
    console.log("Generating plan for topic:", topic, "and name:", name);
    setResponseLoading(true); // Start loading

    try {
      toast.loading("Generating outline...");

      const outlineRaw = await callGroqAI({
        apiKey: GROQ_KEY,
        mode: "learning_outline",
        question: topic,
        name,
      });

      const outlineFixed = jsonrepair(outlineRaw);
      const outlineParsed = JSON.parse(outlineFixed) as DayOutline[];
      console.log("Outline received:", outlineParsed);

      toast.loading("Generating MCQs...");

      // Step 2: MCQs
      const mcqRaw = await callGroqAI({
        apiKey: GROQ_KEY,
        mode: "learning_mcq",
        question: JSON.stringify(outlineParsed),
        name,
      });

      console.log("MCQ raw response:", mcqRaw);
      const mcqFixed = jsonrepair(mcqRaw);
      const mcqParsed = JSON.parse(mcqFixed) as DayMCQ[];
      // console.log("MCQs received:", mcqParsed);

      // Step 3: Merge
      const mergedPlan: DayPlan[] = outlineParsed.map((day) => {
        const mcqMatch = mcqParsed.find((m) => m.day === day.day);
        return {
          ...day,
          mcq: mcqMatch?.mcq || [],
        };
      });

      const finalPlan: CurrentPlan = {
        topic,
        currentDay: 1,
        plan: mergedPlan,
      };

      await axios.post("/api/plan", {
        email,
        topic,
        plan: mergedPlan,
      });

      await fetchUser(); // Refresh user data after saving plan
      setPlan(finalPlan);
      setCurrentDay(1);
      setCompletedMcqs({});

      toast.dismiss();
      toast.success("✅ Plan generated & saved!");
      setResponseLoading(false); // Stop loading
    } catch (err: any) {
      toast.dismiss();
      toast.error("❌ Failed to generate or save plan.");
      setResponseLoading(false); // Stop loading
      console.error("Generate Plan Error:", err);
    }
  };

  const markMcqCompleted = (day: number) => {
    setCompletedMcqs((prev) => ({
      ...prev,
      [day]: (prev[day] || 0) + 1,
    }));
  };

  const canAccessDay = (day: number): boolean => {
    if (day === 1) return true;
    const prevDayMcqs =
      plan?.plan.find((p) => p.day === day - 1)?.mcq.length || 5;
    return (completedMcqs[day - 1] || 0) >= prevDayMcqs;
  };

  return (
    <AIContext.Provider
      value={{
        plan,
        currentDay,
        completedMcqs,
        generatePlan,
        markMcqCompleted,
        setCurrentDay,
        canAccessDay,
        responseLoading,
        setResponseLoading,
        topic,
        setTopic,
        isListening: listening,
        toggleListening,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAIContext = () => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAIContext must be used within AIProvider");
  return ctx;
};
