/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { LuAlignJustify, LuChevronDown } from "react-icons/lu";
import Image from "next/image";
import {
  LuLogOut,
  LuX,
  LuUser,
  LuSettings,
  LuRefreshCcw,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
interface HeroNavProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Homenav: React.FC<HeroNavProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, loading } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  return (
    <nav className="flex items-center justify-between py-4 px-6">
      <button type="button" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        <LuAlignJustify
          size={24}
          className="text-black cursor-pointer md:scale-x-125"
        />
      </button>
      <div className="">
        <p className="text-black font-semibold font-sora text-2xl">
          Spark<span className="text-rose-500">Path</span>
        </p>
      </div>
      <div className="relative">
        <div className="bg-rose-100 pr-3 py-1 max-[650px]:p-0 rounded-full flex items-center gap-3">
          <Image
            src="/man.png"
            alt="profile"
            width={55}
            height={55}
            className="rounded-full bg-rose-500"
            onClick={() => setIsOpen((prev) => !prev)}
          />
          <div className="flex items-center gap-4 max-[700px]:hidden">
            <div className="flex flex-col items-start max-[700px]:hidden">
              <p className="text-black font-medium tracking-tight font-sora text-base capitalize max-w-[140px] truncate whitespace-nowrap">
                {loading ? "Loading..." : user?.name || "User"}
              </p>
              <p className="text-gray-500 text-sm font-inter tracking-tight ">
                {user?.email}
              </p>
            </div>
            <LuChevronDown
              className="text-black text-xl "
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </div>
        </div>
        {/* DROPDOWN */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[60px] right-0 w-[220px] sm:w-[260px] bg-white rounded-2xl shadow-lg z-50 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 items-start">
                  {/* <LuUser size={20} className="mt-0.5 text-gray-600" /> */}
                  <div className="w-5 h-5 rounded-full bg-rose-500 animate-pulse transition-all duration-300"></div>
                  <div>
                    <h4 className="font-semibold text-[16px] text-black capitalize font-sora tracking-tight">
                      {user?.name || "User"}
                    </h4>
                    <p className="text-sm min-[600px]:text-base text-gray-400/80 truncate max-w-[140px] tracking-tighter italic font-outfit">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-rose-800 cursor-pointer"
                  aria-label="Close dropdown"
                >
                  <LuX size={20} />
                </button>
              </div>

              <hr className="my-2 border-rose-200" />

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => router.push("/home")}
                  className="w-full text-left text-[16px] font-sora font-medium text-gray-700 hover:text-rose-600 flex items-center gap-2"
                >
                  <LuUser size={18} />
                  Your Profile
                </button>
                <button
                  type="button"
                  className="w-full text-left text-[16px] font-sora font-medium text-gray-700 hover:text-rose-600 flex items-center gap-2"
                >
                  <LuSettings size={18} />
                  Settings
                </button>

                <button
                  type="button"
                  // onClick={handleLogout}
                  className="w-fit text-left text-[16px] font-sora font-medium text-white bg-rose-500 hover:bg-pink-600 px-3 py-2 rounded-xl flex items-center gap-2"
                >
                  <LuLogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Homenav;
