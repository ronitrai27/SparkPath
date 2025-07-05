/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { getOccupationSuggestions } from "@/lib/Suggestions";

import Orb from "@/components/Orb";
import { useAppContext } from "@/context/AppContext";
import { LuBell } from "react-icons/lu";
// import HomePage2 from "@/components/Test";
import LearningPage from "@/components/LearningPage";
import UserProfile from "@/components/Test";
import { LuArrowUpRight } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
export default function HomePage() {
  const { user, loading } = useAppContext();
  const suggestions = getOccupationSuggestions(user?.occupation || "Other");

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
          style={{ width: "100%", height: "370px", position: "relative" }}
          className="-mt-5"
        >
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={272}
            forceHoverState={false}
          />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-4xl font-semibold font-sora bg-gradient-to-r from-black to-rose-600 bg-clip-text text-transparent tracking-tight text-center">
              ASK ME{" "}
            </h2>
          </div>
        </div>
        <p className="text-black font-light font-inter text-lg mb-4">
          AI Suggestions:
        </p>
        <div className="flex gap-4 overflow-x-auto scrollbar-thin py-1">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="min-w-[250px] bg-white/30 rounded-2xl shadow-md px-4 py-2 border border-gray-200 font-inter  text-center"
            >
              <h3 className="text-base font-light leading-tight text-gray-800 tracking-tight">
                {s}
              </h3>
            </div>
          ))}
        </div>

        {/* INPUT----------------- */}
        <div className="bg-gray-200/80 rounded-full px-3 py-3 flex items-center justify-between my-10 max-w-[600px] mx-auto">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="w-full bg-transparent outline-none text-gray-800 font-inter text-base placeholder:text-gray-500"
          />
          <div className="flex items-center gap-2">
            <IoMicOutline
              size={24}
              className="text-gray-800 cursor-pointer hover:text-gray-600 transition-colors duration-200"
            />
            <LuArrowUpRight
              size={24}
              className="text-gray-800 cursor-pointer hover:text-gray-600 transition-colors duration-200 ml-2"
            />
          </div>
        </div>

        <main className="mt-20">
          <LearningPage />
          <UserProfile />
        </main>
      </div>
    </div>
  );
}

{
  /* <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Occupation: {user.occupation}</p>
      <p>League: {user.league}</p>
      <p>Milestones: {user.milestones}</p> */
}
