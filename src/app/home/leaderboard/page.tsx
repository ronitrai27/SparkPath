/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LeaderboardUser {
  _id: string;
  name?: string;
  occupation: string;
  milestones: string[];
}

const Leaderboard = () => {
  const { user, loading: contextLoading } = useAppContext();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user?._id) return;

      try {
        // Add timestamp to prevent caching
        const res = await axios.get(
          `/api/leaderboard?userId=${user._id}&t=${Date.now()}`
        );
        if (res.data.success) {
          setLeaderboard(res.data.data);
        } else {
          toast.error(res.data.error || "Failed to fetch leaderboard.");
        }
      } catch (err) {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  if (contextLoading || loading) {
    return (
      <div className="max-w-[800px] mx-auto px-4 text-center font-inter text-base text-gray-600">
        Loading leaderboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-[800px] mx-auto px-4 text-center font-inter text-base text-gray-600">
        No user data
      </div>
    );
  }

  if (!user.occupation) {
    return (
      <div className="max-w-[800px] mx-auto px-4 text-center font-inter text-base text-gray-600">
        Please set your occupation to view the leaderboard.
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl min-[800px]:text-4xl font-semibold mb-6 text-center font-sora tracking-tight"
      >
        Leaderboard
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center font-inter text-lg min-[800px]:text-2xl font-[500] text-gray-600 mb-10 tracking-tight px-2"
      >
        Here&apos;s the leaderboard for your occupation:{" "}
        <span className="font-semibold">{user.occupation}</span>
      </motion.p>
      {leaderboard.length === 0 ? (
        <div className="text-center font-inter text-base text-black">
          No users found with occupation {`"${user.occupation}"`}.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className=""
        >
          <ul className="space-y-4 min-[600px]:space-y-6">
            <AnimatePresence>
              {leaderboard.map((leaderboardUser, index) => (
                <motion.li
                  key={leaderboardUser._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg shadow max-w-[800px] mx-auto"
                >
                  <div className="flex items-center space-x-4">
                    {index === 0 && (
                      <Image
                        src="/first.png"
                        alt="First Place"
                        width={40}
                        height={40}
                        className="w-12 h-12"
                      />
                    )}
                    {index === 1 && (
                      <Image
                        src="/second.png"
                        alt="Second Place"
                        width={32}
                        height={32}
                        className="w-12 h-12"
                      />
                    )}
                    {index === 2 && (
                      <Image
                        src="/third.png"
                        alt="Third Place"
                        width={32}
                        height={32}
                        className="w-12 h-12"
                      />
                    )}
                    {index > 2 && (
                      <span className="w-8 text-center font-inter text-base text-gray-600">
                        #{index + 1}
                      </span>
                    )}
                    <span className="font-inter text-base min-[600px]:text-lg font-medium">
                      {leaderboardUser.name || "Anonymous"}
                    </span>
                  </div>
                  <span className="font-inter text-base text-rose-500">
                    Score: {leaderboardUser.milestones?.length || 0}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;
