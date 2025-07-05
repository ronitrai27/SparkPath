"use client";
import { useAIContext } from "@/context/AIcontext";

import { useAppContext } from "@/context/AppContext";
export default function LearningPage() {
  const { user } = useAppContext();
  const { generatePlan } = useAIContext();

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() =>
          generatePlan(
            "Full-stack SaaS with Next.js and NestJS",
            user?.name || "User",
            user?.email || ""
          )
        }
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Plan
      </button>
    </div>
  );
}
