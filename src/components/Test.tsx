/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppContext } from "@/context/AppContext";
import { fetchYoutubeVideos } from "@/lib/FetchYt";
import { getSuggestedTopics } from "@/lib/SuggestedToics";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { LuArrowRightToLine } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAIContext } from "@/context/AIcontext";
import styled from "styled-components";
import { useFireworks } from "@/lib/Fireworks";

const UserProfile = () => {
  const { user, setUser, loading } = useAppContext();
  const { triggerFireworks } = useFireworks();
  const { responseLoading } = useAIContext();
  const currentDayPlan = user?.currPlan?.plan.find(
    (dayPlan) => dayPlan.day === user?.currPlan?.currentDay
  );
  const [ytResults, setYtResults] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [results, setResults] = useState<Record<number, boolean> | null>(null);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newMilestone, setNewMilestone] = useState<string | null>(null);

  // ---------------------WIKIPEDIA---------------------
  const [wikiSummary, setWikiSummary] = useState<string | null>(null);
  const [loadingWiki, setLoadingWiki] = useState(false);
  const [wikiError, setWikiError] = useState<string | null>(null);

  const fetchWikiSummary = async () => {
    setLoadingWiki(true);
    setWikiError(null);

    const originalTitle = currentDayPlan?.title ?? "";
    if (!originalTitle.trim()) {
      setWikiSummary("No topic title provided.");
      setLoadingWiki(false);
      return;
    }

    const fallbackTitle = originalTitle.split(" ").slice(-2).join(" ");
    console.log(
      "Fetching Wikipedia summary for:",
      originalTitle,
      fallbackTitle
    );

    try {
      const tryFetch = async (title: string) => {
        const res = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            title
          )}`
        );
        return res.data.extract;
      };

      let summary: string | null = null;

      try {
        summary = await tryFetch(originalTitle);
      } catch {
        try {
          summary = await tryFetch(fallbackTitle);
        } catch {
          summary = null;
        }
      }

      if (summary) {
        setWikiSummary(summary);
      } else {
        setWikiSummary("No Wikipedia page found for this topic. ");
      }
    } catch (error) {
      console.error("Wikipedia fetch failed", error);
      setWikiError("Couldn't fetch Wikipedia summary.");
    } finally {
      setLoadingWiki(false);
    }
  };

  // ------------------Fetch YouTube videos-------------------------
  useEffect(() => {
    const getVideos = async () => {
      if (currentDayPlan?.title) {
        const results = await fetchYoutubeVideos(currentDayPlan.title);
        setYtResults(results);
      }
    };
    getVideos();
  }, [currentDayPlan]);

  // Fetch suggested topics and handle popup when milestones change
  useEffect(() => {
    const getSuggestions = async () => {
      if (
        user?.milestones &&
        user.milestones.length > 0 &&
        user.currPlan &&
        user.currPlan.plan &&
        user.currPlan.plan.every((dayPlan) => dayPlan.isCompleted)
      ) {
        setIsLoadingSuggestions(true);
        const topics = await getSuggestedTopics(user.occupation || "Other");
        setSuggestedTopics(topics);
        setIsLoadingSuggestions(false);
      } else {
        setSuggestedTopics([]);
        setShowPopup(false); // Hide popup if plan is not completed or no milestones
      }
    };
    getSuggestions();

    // Show popup for new milestone
    if (user?.milestones && user.milestones.length > 0) {
      const latestMilestone = user.milestones[user.milestones.length - 1];
      if (latestMilestone !== newMilestone) {
        setNewMilestone(latestMilestone);
        setShowPopup(true);
      }
    }
  }, [user?.milestones, user?.currPlan?.plan, user?.occupation]);

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

    // Update plan
    const updatedPlan = user!.currPlan!.plan.map((dayPlan) =>
      dayPlan.day === currentDayPlan.day
        ? { ...dayPlan, isCompleted: true }
        : dayPlan
    );
    const isLastDay = currentDayPlan.day === user!.currPlan!.plan.length;
    const nextDay = currentDayPlan.day + 1;

    // Prepare update data
    const updateData: { userId: string; currPlan: any; milestones?: string[] } =
      {
        userId: user!._id,
        currPlan: {
          ...user!.currPlan!,
          plan: updatedPlan,
          currentDay: isLastDay ? user!.currPlan!.currentDay : nextDay,
        },
      };

    // If last day, append topic to milestones
    if (isLastDay) {
      updateData.milestones = [
        ...(user!.milestones || []),
        user!.currPlan!.topic,
      ];
    }

    try {
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
              milestones: isLastDay
                ? [...(prev.milestones || []), prev.currPlan!.topic]
                : prev.milestones,
            }
          : prev
      );
      setSelectedAnswers({});
      setResults(null);
      toast.success(
        isLastDay ? "Plan completed!" : "Day completed! Moving to next day."
      );
    } catch (err) {
      toast.error("Failed to update progress.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  // Show suggested topics if plan is completed and milestones not empty
  if (
    user.currPlan &&
    user.currPlan.plan &&
    user.currPlan.plan.length > 0 &&
    user.currPlan.plan.every((dayPlan) => dayPlan.isCompleted) &&
    user.milestones &&
    user.milestones.length > 0
  ) {
    return (
      <div className="max-w-[800px] mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold mb-4 text-center font-sora tracking-tight"
        >
          Congratulations, {user.name}! You&apos;ve completed your plan!
        </motion.h2>
        <AnimatePresence>
          {isLoadingSuggestions ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center font-inter text-base text-gray-600"
            >
              Generating suggestions...
            </motion.div>
          ) : (
            suggestedTopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <h3 className="text-lg font-medium font-inter text-center mb-5 ">
                  Suggested Topics to Learn Next
                </h3>
                <ul className="space-y-3">
                  {suggestedTopics.map((topic, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="p-4 bg-white/30 rounded-lg shadow font-inter text-base text-center"
                    >
                      {topic}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* -------Popup for new milestone ------------------*/}
        <AnimatePresence>
          {showPopup && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <div className="bg-gradient-to-b from-white to-rose-500 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                  <Image
                    src="/first.png"
                    alt="congratulations"
                    width={100}
                    height={100}
                    className="mb-4 mx-auto"
                  />
                  <h3 className="text-2xl font-semibold font-sora text-white mb-4 text-center capitalize">
                    Congratulations, {user.name}!
                  </h3>
                  <p className="font-inter text-base text-gray-200 mb-6">
                    You just completed your Milestone! You can view yourself in
                    leaderboard.
                  </p>
                  {/* <button
                    onClick={() => setShowPopup(false)}
                    className="px-6 py-2 bg-white text-rose-500 rounded-full font-inter text-base hover:bg-rose-800"
                  >
                    OK
                  </button> */}
                  <button
                    onClick={() => {
                      triggerFireworks();
                      setShowPopup(false);
                    }}
                    className="px-6 py-2 bg-white text-rose-500 rounded-full font-inter text-base hover:bg-rose-800"
                  >
                    OK
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (responseLoading) {
    return (
      <div className="flex items-center justify-center my-10">
        <StyledWrapper>
          <svg className="pl" width={240} height={240} viewBox="0 0 240 240">
            <circle
              className="pl__ring pl__ring--a"
              cx={120}
              cy={120}
              r={105}
              fill="none"
              stroke="#000"
              strokeWidth={20}
              strokeDasharray="0 660"
              strokeDashoffset={-330}
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--b"
              cx={120}
              cy={120}
              r={35}
              fill="none"
              stroke="#000"
              strokeWidth={20}
              strokeDasharray="0 220"
              strokeDashoffset={-110}
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--c"
              cx={85}
              cy={120}
              r={70}
              fill="none"
              stroke="#000"
              strokeWidth={20}
              strokeDasharray="0 440"
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--d"
              cx={155}
              cy={120}
              r={70}
              fill="none"
              stroke="#000"
              strokeWidth={20}
              strokeDasharray="0 440"
              strokeLinecap="round"
            />
          </svg>
        </StyledWrapper>
      </div>
    );
  }

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
          {/*----- WIKIPEDIA--------- */}
          <div className="text-center my-4">
            <button
              onClick={fetchWikiSummary}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-full transition"
              disabled={loadingWiki}
            >
              {loadingWiki ? "Fetching..." : "Learn More"}
            </button>

            {loadingWiki && (
              <div className="flex items-center justify-center my-4">
                <StyledWrapper>
                  <svg
                    className="pl"
                    width={240}
                    height={240}
                    viewBox="0 0 240 240"
                  >
                    <circle
                      className="pl__ring pl__ring--a"
                      cx={120}
                      cy={120}
                      r={105}
                      fill="none"
                      stroke="#000"
                      strokeWidth={20}
                      strokeDasharray="0 660"
                      strokeDashoffset={-330}
                      strokeLinecap="round"
                    />
                    <circle
                      className="pl__ring pl__ring--b"
                      cx={120}
                      cy={120}
                      r={35}
                      fill="none"
                      stroke="#000"
                      strokeWidth={20}
                      strokeDasharray="0 220"
                      strokeDashoffset={-110}
                      strokeLinecap="round"
                    />
                    <circle
                      className="pl__ring pl__ring--c"
                      cx={85}
                      cy={120}
                      r={70}
                      fill="none"
                      stroke="#000"
                      strokeWidth={20}
                      strokeDasharray="0 440"
                      strokeLinecap="round"
                    />
                    <circle
                      className="pl__ring pl__ring--d"
                      cx={155}
                      cy={120}
                      r={70}
                      fill="none"
                      stroke="#000"
                      strokeWidth={20}
                      strokeDasharray="0 440"
                      strokeLinecap="round"
                    />
                  </svg>
                </StyledWrapper>
              </div>
            )}

            {wikiError && (
              <p className="text-red-500 mt-2 text-base font-inter">
                {wikiError}
              </p>
            )}

            {wikiSummary && (
              <p className="mt-4 text-gray-800 text-base font-inter max-w-[800px] mx-auto">
                {wikiSummary}
              </p>
            )}
          </div>

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
const StyledWrapper = styled.div`
  .pl {
    width: 6em;
    height: 6em;
  }

  .pl__ring {
    animation: ringA 2s linear infinite;
  }

  .pl__ring--a {
    stroke: #f42f25;
  }

  .pl__ring--b {
    animation-name: ringB;
    stroke: #f49725;
  }

  .pl__ring--c {
    animation-name: ringC;
    stroke: #255ff4;
  }

  .pl__ring--d {
    animation-name: ringD;
    stroke: #f42582;
  }

  /* Animations */
  @keyframes ringA {
    from,
    4% {
      stroke-dasharray: 0 660;
      stroke-width: 20;
      stroke-dashoffset: -330;
    }

    12% {
      stroke-dasharray: 60 600;
      stroke-width: 30;
      stroke-dashoffset: -335;
    }

    32% {
      stroke-dasharray: 60 600;
      stroke-width: 30;
      stroke-dashoffset: -595;
    }

    40%,
    54% {
      stroke-dasharray: 0 660;
      stroke-width: 20;
      stroke-dashoffset: -660;
    }

    62% {
      stroke-dasharray: 60 600;
      stroke-width: 30;
      stroke-dashoffset: -665;
    }

    82% {
      stroke-dasharray: 60 600;
      stroke-width: 30;
      stroke-dashoffset: -925;
    }

    90%,
    to {
      stroke-dasharray: 0 660;
      stroke-width: 20;
      stroke-dashoffset: -990;
    }
  }

  @keyframes ringB {
    from,
    12% {
      stroke-dasharray: 0 220;
      stroke-width: 20;
      stroke-dashoffset: -110;
    }

    20% {
      stroke-dasharray: 20 200;
      stroke-width: 30;
      stroke-dashoffset: -115;
    }

    40% {
      stroke-dasharray: 20 200;
      stroke-width: 30;
      stroke-dashoffset: -195;
    }

    48%,
    62% {
      stroke-dasharray: 0 220;
      stroke-width: 20;
      stroke-dashoffset: -220;
    }

    70% {
      stroke-dasharray: 20 200;
      stroke-width: 30;
      stroke-dashoffset: -225;
    }

    90% {
      stroke-dasharray: 20 200;
      stroke-width: 30;
      stroke-dashoffset: -305;
    }

    98%,
    to {
      stroke-dasharray: 0 220;
      stroke-width: 20;
      stroke-dashoffset: -330;
    }
  }

  @keyframes ringC {
    from {
      stroke-dasharray: 0 440;
      stroke-width: 20;
      stroke-dashoffset: 0;
    }

    8% {
      stroke-dasharray: 40 400;
      stroke-width: 30;
      stroke-dashoffset: -5;
    }

    28% {
      stroke-dasharray: 40 400;
      stroke-width: 30;
      stroke-dashoffset: -175;
    }

    36%,
    58% {
      stroke-dasharray: 0 440;
      stroke-width: 20;
      stroke-dashoffset: -220;
    }

    66% {
      stroke-dasharray: 40 400;
      stroke-width: 30;
      stroke-dashoffset: -225;
    }

    86% {
      stroke-dasharray: 40 400;
      stroke-width: 30;
      stroke-dashoffset: -395;
    }

    94%,
    to {
      stroke-dasharray: 0 440;
      stroke-width: 20;
      stroke-dashoffset: -440;
    }
  }

  @keyframes ringD {
    from,
    8% {
      stroke-dasharray: 0 440;
      stroke-width: 20;
      stroke-dashoffset: 0;
    }

    16% {
      stroke-dasharray: 40 400;
      stroke-width: 30;
      stroke-dashoffset: -5;
    }

    36% {
      stroke-dasharray: 40 400;
      stroke-width: 30;
      stroke-dashoffset: -175;
    }

    44%,
    50% {
      stroke-dasharray: 0 440;
      stroke-width: 20;
      stroke-dashoffset: -220;
    }

    58% {
      stroke-dasharray: 40 400;
      stroke-width: 30;
      stroke-dashoffset: -225;
    }

    78% {
      stroke-dasharray: 40 400;
      stroke-width: 30;
      stroke-dashoffset: -395;
    }

    86%,
    to {
      stroke-dasharray: 0 440;
      stroke-width: 20;
      stroke-dashoffset: -440;
    }
  }
`;

export default UserProfile;
