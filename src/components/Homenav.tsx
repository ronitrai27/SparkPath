"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { LuAlignJustify, LuChevronDown } from "react-icons/lu";
import Image from "next/image";
const Homenav = () => {
  const { user, loading } = useAppContext();
  return (
    <nav className="flex items-center justify-between py-4 px-6">
      <button className="">
        <LuAlignJustify className="text-2xl text-black" />
      </button>
      <div className="">
        <p className="text-black font-semibold font-sora text-2xl">
          Spark<span className="text-rose-500">Path</span>
        </p>
      </div>
      <div className="bg-rose-100 pr-3 py-1 max-[650px]:p-0 rounded-full flex items-center gap-3">
        <Image
          src="/man.png"
          alt="profile"
          width={55}
          height={55}
          className="rounded-full bg-rose-500"
        />
        <div className="flex items-center gap-4 max-[700px]:hidden">
          <div className="flex flex-col items-start max-[700px]:hidden">
            <p className="text-black font-medium tracking-tight font-sora text-base capitalize max-w-[200px] truncate whitespace-nowrap">
              {loading ? "Loading..." : user?.name || "User"}
            </p>
            <p className="text-gray-500 text-sm font-inter tracking-tight ">
              {user?.email}
            </p>
          </div>
          <LuChevronDown className="text-black text-xl " />
        </div>
      </div>
    </nav>
  );
};

export default Homenav;
