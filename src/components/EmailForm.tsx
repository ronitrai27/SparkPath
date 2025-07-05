/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import AnimatedGradientBackground from "@/components/AnimatedBack";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type FormData = {
  email: string;
};

export default function EmailForm() {
  const [isShowOTP, setIsShowOTP] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");

  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const onSubmit = async (data: FormData) => {
    localStorage.setItem("sparkpath_email", data.email);
    setEmail(data.email);

    const loading = toast.loading("Sending OTP...");
    setIsSendingOtp(true);

    try {
      const res = await axios.post("/api/send-otp", { email: data.email });
      localStorage.setItem("otpToken", res.data.otpToken);

      if (res.data.success) {
        toast.success("OTP sent to your email!", { id: loading });
        setIsShowOTP(true);
      } else {
        toast.error(res.data.error || "Failed to send OTP", { id: loading });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loading });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerify = async () => {
    const loading = toast.loading("Verifying OTP...");
    setIsVerifyingOtp(true);

    try {
      const otpToken = localStorage.getItem("otpToken");
      const res = await axios.post("/api/verify-otp", {
        email,
        otp,
        otpToken,
      });

      if (res.data.success) {
        toast.success("OTP verified!", { id: loading });

        if (res.data.status === "new") {
          router.push("/profile-complete");
        } else {
          router.push("/home");
        }
      } else {
        toast.error(res.data.error || "Invalid OTP", { id: loading });
      }
    } catch (err) {
      toast.error("Error verifying OTP", { id: loading });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  //   With useEffect: email auto-fills from localStorage even on reloads !
  useEffect(() => {
    const saved = localStorage.getItem("sparkpath_email");
    if (saved) {
      setValue("email", saved);
    }
  }, [setValue]);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <AnimatedGradientBackground
        startingGap={120}
        breathing={true}
        gradientColors={[
          "#ffffff", // pure white
          "#FFE1F1", // rose-50 (very soft pink-white) FFE1F1
          "#FFDADC", // rose-100 (light rose)FFDADC
          "#fbcfe8", // pink-200 (gentle pink tone)FBCFE8
          "#fda4af", // rose-300 (medium soft rose)
          "#E680B8", // pink-300 (for accents)
          "#F56293", // pink-400
        ]}
        gradientStops={[30, 50, 60, 70, 80, 90, 100]}
        animationSpeed={0.04}
        breathingRange={7}
      />
      <h3 className="z-10 relative font-sora text-black font-semibold text-xl text-left py-3 px-8">
        Spark<span className="text-rose-500">Path</span>
      </h3>
      <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4">
        <h1 className="z-10 relative font-sora text-black font-semibold text-5xl max-[500px]:text-4xl mb-3">
          SPARK<span className="text-rose-500">PATH</span>
        </h1>
        <p className="z-10 relative font-inter text-gray-400 font-medium text-2xl max-[500px]:text-xl  text-center mb-10 max-w-[500px] mx-auto">
          AI powered learning platform to ignite your idea, Passion into 7 day
          skill adventure.
        </p>

        {!isShowOTP && (
          <>
            <p className="my-5 font-inter text-gray-800 text-xl font-light">
              Enter your email to continue
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                autoFocus
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
                className="py-3 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full"
              />
              <Button
                type="submit"
                disabled={isSendingOtp}
                className="w-full text-lg py-3 font-inter mt-5 flex items-center justify-center"
              >
                {isSendingOtp ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </>
        )}

        {isShowOTP && (
          <div className="space-y-4 flex flex-col items-center justify-center">
            <p className="my-5 font-inter text-gray-800 text-xl font-light">
              Enter the OTP sent to your email
            </p>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-12 text-2xl  border-gray-600"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button
              onClick={handleOtpVerify}
              disabled={isVerifyingOtp}
              className="w-full text-lg py-3 font-inter mt-5 flex items-center justify-center"
            >
              {isVerifyingOtp ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
