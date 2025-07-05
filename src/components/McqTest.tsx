/* eslint-disable @typescript-eslint/no-unused-vars */
// app/mcq-test/page.tsx (or pages/mcq-test.tsx if not using App Router)
"use client";

import { useAIContext } from "@/context/AIcontext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function MCQTestPage() {
  const { plan, currentDay, markMcqCompleted } = useAIContext();
  const router = useRouter();
  const today = plan?.plan.find((p) => p.day === currentDay);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!today) return <div>No MCQ found for today.</div>;

  const handleSelect = (option: string) => {
    const updated = [...answers];
    updated[currentQ] = option;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    markMcqCompleted(currentDay);
  };

  const currentMCQ = today.mcq[currentQ];
  const isCorrect = currentMCQ.answer === answers[currentQ];

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Day {today.day} - MCQ Test</h1>

      <Progress value={(answers.length / today.mcq.length) * 100} />

      <div className="border p-4 rounded shadow">
        <p className="font-medium">{currentMCQ.question}</p>
        <div className="mt-2 space-y-2">
          {currentMCQ.options.map((opt, idx) => {
            const selected = answers[currentQ] === opt;
            const isWrong = submitted && selected && opt !== currentMCQ.answer;
            const isRight = submitted && selected && opt === currentMCQ.answer;

            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => handleSelect(opt)}
                className={`block w-full px-3 py-2 border rounded text-left ${
                  isRight
                    ? "bg-green-100 border-green-500"
                    : isWrong
                    ? "bg-red-100 border-red-500"
                    : selected
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between pt-4">
        <button
          disabled={currentQ === 0}
          onClick={() => setCurrentQ((q) => q - 1)}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        {currentQ < today.mcq.length - 1 ? (
          <button
            disabled={!answers[currentQ]}
            onClick={() => setCurrentQ((q) => q + 1)}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            Next
          </button>
        ) : submitted ? (
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            Go to Home
          </button>
        ) : (
          <button
            disabled={answers.length !== today.mcq.length}
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}
