/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/me");
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          toast.error(res.data.error || "Could not fetch user");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Occupation: {user.occupation}</p>
      <p>League: {user.league}</p>
      <p>Milestones: {user.milestones}</p>
    </div>
  );
}
