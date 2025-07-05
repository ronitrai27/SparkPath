/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppContext } from "@/context/AppContext";
import { fetchYoutubeVideos } from "@/lib/FetchYt";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { LuArrowRightToLine } from "react-icons/lu";

const UserProfile = () => {
  const { user, setUser, loading } = useAppContext();
  const currentDayPlan = user?.currPlan?.plan.find(
    (dayPlan) => dayPlan.day === user?.currPlan?.currentDay
  );

  const [ytResults, setYtResults] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [results, setResults] = useState<Record<number, boolean> | null>(null);

  useEffect(() => {
    const getVideos = async () => {
      if (currentDayPlan?.title) {
        const results = await fetchYoutubeVideos(currentDayPlan.title);
        setYtResults(results);
      }
    };
    getVideos();
  }, [currentDayPlan]);

  const handleAnswerSelect = (mcqIndex: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [mcqIndex]: answer }));
  };

  const handleSubmit = async () => {
    if (!currentDayPlan) return;
    if (Object.keys(selectedAnswers).length < currentDayPlan.mcq.length) {
      toast.error("Please answer all questions.");
      return;
    }

    // Evaluate answers for feedback
    const newResults: Record<number, boolean> = {};
    currentDayPlan.mcq.forEach((mcq, idx) => {
      newResults[idx] = selectedAnswers[idx] === mcq.answer;
    });
    setResults(newResults);

    // Update plan regardless of correctness
    const updatedPlan = user!.currPlan!.plan.map((dayPlan) =>
      dayPlan.day === currentDayPlan.day
        ? { ...dayPlan, isCompleted: true }
        : dayPlan
    );
    const isLastDay = currentDayPlan.day === user!.currPlan!.plan.length;
    const nextDay = currentDayPlan.day + 1;

    try {
      const updateData = {
        userId: user!._id,
        currPlan: {
          ...user!.currPlan!,
          plan: updatedPlan,
          currentDay: isLastDay ? user!.currPlan!.currentDay : nextDay,
        },
      };
      await axios.post("/api/user/update", updateData);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              currPlan: {
                ...prev.currPlan!,
                plan: updatedPlan,
                currentDay: isLastDay ? prev.currPlan!.currentDay : nextDay,
              },
            }
          : prev
      );
      setSelectedAnswers({});
      setResults(null);
      toast.success("Day completed! Moving to next day.");
    } catch (err) {
      toast.error("Failed to update progress.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="">
      {user.currPlan &&
      user.currPlan.plan &&
      user.currPlan.plan.length > 0 &&
      currentDayPlan ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center font-sora tracking-tight max-w-[700px] mx-auto px-4">
            {user?.name} your topic is {user.currPlan.topic}
          </h2>
          <div className="flex space-x-4 my-10 justify-center">
            {user.currPlan.plan.map((dayPlan) => (
              <div
                key={dayPlan.day}
                className={`px-4 py-2 rounded-full text-lg font-inter ${
                  dayPlan.day === user?.currPlan?.currentDay
                    ? "bg-rose-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Day {dayPlan.day}
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold my-4 font-sora text-center">
            Topic: {currentDayPlan.title}
          </h3>
          <p className="font-inter text-base font-medium text-center max-w-[800px] mx-auto">
            {currentDayPlan.reading}
          </p>
          {/* YouTube Links */}
          <div className="space-y-3 mt-6">
            <h3 className="text-lg font-medium font-sora text-center mb-5 underline underline-offset-4 decoration-rose-500">
              Watch on YouTube
            </h3>
            {ytResults.map((vid, i) => (
              <a
                key={i}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center max-[500px]:flex-col max-[500px]:gap-4 space-x-3 bg-white/30 p-2 rounded-lg shadow"
              >
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-52 rounded"
                />
                <div>
                  <p className="text-rose-500 font-medium font-inter text-base max-[500px]:text-center">
                    {vid.title}
                  </p>
                  <p className="text-sm text-gray-500 font-inter max-[500px]:text-center">
                    by {vid.channel}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <h4 className="font-medium my-6 text-xl font-sora text-center">
            Test Your Knowledge
          </h4>
          <ul>
            {currentDayPlan.mcq.map((q, idx) => (
              <li
                key={idx}
                className="my-4 p-4 bg-white/30 rounded-lg shadow max-w-[800px] mx-auto"
              >
                <p className="font-medium text-lg font-sora tracking-tight">
                  {q.question}
                </p>
                <div className="mt-3">
                  {q.options.map((option, optIdx) => (
                    <label key={optIdx} className="block my-1">
                      <input
                        type="radio"
                        name={`mcq-${idx}`}
                        value={option}
                        checked={selectedAnswers[idx] === option}
                        onChange={() => handleAnswerSelect(idx, option)}
                        disabled={results !== null}
                        className="mr-2"
                      />
                      <span className="font-inter text-base">{option}</span>
                    </label>
                  ))}
                </div>
                {results && (
                  <p
                    className={`mt-2 font-inter text-sm ${
                      results[idx] ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {results[idx]
                      ? "Correct"
                      : `Incorrect (Correct: ${q.answer})`}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-full font-inter text-base hover:bg-rose-600 w-fit"
              disabled={results !== null}
            >
              Submit <LuArrowRightToLine className="inline ml-2 text-xl" />
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserProfile;
