/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { getOccupationSuggestions } from "@/lib/Suggestions";
import Orb from "@/components/Orb";
import { useSpeech } from "@/lib/useSpeech";
import { useAppContext } from "@/context/AppContext";
import { LuBell } from "react-icons/lu";
import styled from "styled-components";
import UserProfile from "@/components/Test";
import { LuArrowUpRight } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { is } from "date-fns/locale";
import { useAIContext } from "@/context/AIcontext";
import toast from "react-hot-toast";
import { useTour } from "@reactour/tour";
export default function HomePage() {
  const { user, loading } = useAppContext();
  const { speak, isSpeaking } = useSpeech();
  const { generatePlan } = useAIContext();
  const suggestions = getOccupationSuggestions(user?.occupation || "Other");
  const [topic, setTopic] = useState("");
  const userPlan = user?.currPlan?.plan || [];

  const isPlanComplete = userPlan.every((day: any) => day?.isCompleted);

  const handleSubmit = () => {
    if (!topic.trim()) return;

    if (!isPlanComplete) {
      toast.error("Finish your current plan First!");
      return;
    }

    generatePlan(topic, user?.name || "User", user?.email || "");
    setTopic("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };
  // ---------------------------TOUR-----------------------------
  const { setIsOpen } = useTour();

  useEffect(() => {
    const isNewUser = localStorage.getItem("newuserRide");

    if (isNewUser === "true") {
      setIsOpen(true); // Start the tour
      localStorage.setItem("newuserRide", "false"); // Prevent auto-start again
    }
  }, [setIsOpen]);

  //----------------- TYPE WRITER FOR DYNAMIC HEADING -------------------------
  const greetings = [
    (name: string) => `Welcome ${name}`,
    (name: string) => `How's going ${name}?`,
    (name: string) => `Keep Learning ${name}`,
  ];

  const [text, setText] = useState<string>("");
  const [fullText, setFullText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [dayInfo, setDayInfo] = useState({ day: "", year: "" });

  useEffect(() => {
    if (!user?.name) return;

    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];
    setFullText(randomGreeting(user.name));

    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const year = now.getFullYear().toString();
    setDayInfo({ day, year });
  }, [user]);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 70);

      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  const orbResponses = [
    "Do you want to learn new topics? I'm here to help!",
    "I'm your friend, i will help you to learn new topics.",
    "Let's start working and grinding together.",
    "Did you click me by mistake? No worries, I'm here to help!",
    "Something on your mind? just ask and get things done",
  ];

  const handleOrbClick = () => {
    if (isSpeaking) return;

    const message =
      orbResponses[Math.floor(Math.random() * orbResponses.length)];

    speak(message, {
      rate: 1,
      pitch: 1.1,
      lang: "en-US",
      voiceName: "Microsoft Hazel - English (United Kingdom)",
    });
  };

  useEffect(() => {
    if (isSpeaking || !user) return;

    const orbShouldSpeak = localStorage.getItem("orbShouldSpeak");
    if (orbShouldSpeak === "true") {
      const message = `Welcome ${user.name}, I'm your personal learning assistant. I'm here to help you learn new topics and improve your skills. Just tell me what you want to learn, and I'll create a 3-day plan with the best resources.`;

      speak(message, {
        rate: 1,
        pitch: 1.1,
        lang: "en-US",
        voiceName: "Microsoft Hazel - English (United Kingdom)",
      });

      // prevent speaking again
      localStorage.setItem("orbShouldSpeak", "false");
    }
  }, [user, isSpeaking]);

  return (
    <div className="bg-gradient-to-b from-white via-rose-50 to-rose-300 min-h-screen w-full p-4 ">
      <div className="max-w-[1200px] mx-auto">
        {loading ? (
          <>
            <div className="w-1/2 h-5 rounded-xl bg-gray-400 animate-pulse duration-500 transition-all"></div>
            <div className="w-1/4 h-3 rounded-xl bg-gray-400 animate-pulse duration-500 transition-all mt-2"></div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-5">
            <div className="flex flex-col">
              <h1 className="font-sora text-left text-[22px] min-[600px]:text-[32px] min-[1000px]:text-[38px] bg-gradient-to-r from-black to-rose-600 bg-clip-text text-transparent font-medium tracking-tight capitalize text-balance">
                {text}
              </h1>
              <p className="text-black font-outfit text-[18px] font-normal">
                {dayInfo.day}, {dayInfo.year}
              </p>
            </div>
            <div className="w-11 h-11 bg-gray-400/30 rounded-lg flex items-center justify-center shrink-0">
              <LuBell size={24} className="text-white" />
            </div>
          </div>
        )}
        {/* ORB---------------- */}
        <div
          onClick={handleOrbClick}
          className="-mt-5 orb-rider w-fit mx-auto max-[500px]:scale-110 scale-125 relative  h-[370px] cursor-pointer"
        >
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={272}
            forceHoverState={false}
          />
          {isSpeaking ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <StyledWrapper>
                <div className="loading">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </StyledWrapper>
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-4xl font-semibold font-sora bg-gradient-to-r from-black to-rose-600 bg-clip-text text-transparent tracking-tight text-center">
                ASK ME{" "}
              </h2>
            </div>
          )}
        </div>
        <p className="text-black font-light font-inter text-lg mb-4">
          AI Suggestions:
        </p>
        <div className="flex gap-4 overflow-x-auto scrollbar-thin py-1 suggest-rider">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="min-w-[250px] bg-gray-200/30 rounded-2xl shadow-md px-4 py-2 border border-gray-200 font-inter  text-center"
            >
              <h3 className="text-base font-light leading-tight text-gray-800 tracking-tight">
                {s}
              </h3>
            </div>
          ))}
        </div>

        {/* INPUT----------------- */}
        <div className="bg-gray-200/80 rounded-full px-3 py-3 flex items-center justify-between mt-12 mb-10 max-w-[600px] mx-auto">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="w-full bg-transparent outline-none text-gray-800 font-inter text-base placeholder:text-gray-500 input-rider"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2">
            <IoMicOutline
              size={24}
              className="text-gray-800 cursor-pointer hover:text-gray-600 transition-colors duration-200 mic-rider"
            />
            <LuArrowUpRight
              size={24}
              className="text-gray-800 cursor-pointer hover:text-gray-600 transition-colors duration-200 ml-2"
              onClick={handleSubmit}
            />
          </div>
        </div>

        <main className="mt-20 others-rider">
          <UserProfile />
        </main>
      </div>
    </div>
  );
}
const StyledWrapper = styled.div`
  .loading {
    --speed-of-animation: 0.9s;
    --gap: 6px;
    --first-color: #7b68da;
    --second-color: #6c53e6;
    --third-color: #7f3ce2;
    --fourth-color: #35a4cc;
    --fifth-color: #fff3ff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    gap: 6px;
    height: 100px;
  }

  .loading span {
    width: 4px;
    height: 50px;
    background: var(--first-color);
    animation: scale var(--speed-of-animation) ease-in-out infinite;
  }

  .loading span:nth-child(2) {
    background: var(--second-color);
    animation-delay: -0.8s;
  }

  .loading span:nth-child(3) {
    background: var(--third-color);
    animation-delay: -0.7s;
  }

  .loading span:nth-child(4) {
    background: var(--fourth-color);
    animation-delay: -0.6s;
  }

  .loading span:nth-child(5) {
    background: var(--fifth-color);
    animation-delay: -0.5s;
  }

  @keyframes scale {
    0%,
    40%,
    100% {
      transform: scaleY(0.05);
    }

    20% {
      transform: scaleY(1);
    }
  }
`;
