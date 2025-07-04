/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  User,
  Briefcase,
  CalendarIcon as CalendarIconLucide,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProfileData {
  name: string;
  dateOfBirth: Date | undefined;
  occupation: string;
}

const occupations = [
  "Software Engineer",
  "Designer",
  "Product Manager",
  "Data Scientist",
  "Marketing Manager",
  "Sales Representative",
  "Teacher",
  "Doctor",
  "Lawyer",
  "Consultant",
  "Entrepreneur",
  "Student",
  "Other",
];

export default function Component() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    dateOfBirth: undefined,
    occupation: "",
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const [countdown, setCountdown] = useState<number>(8);

  const handleNext = async () => {
    setIsAnimating(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const email = localStorage.getItem("sparkpath_email");
      setIsCompleted(true);
      setShowSuccess(true);

      try {
        const res = await axios.post("/api/profile-complete", {
          email,
          name: profileData.name,
          occupation: profileData.occupation,
        });

        // console.log("✅API response:", res.data);

        if (res.data.success) {
          toast.success("Profile completed successfully!");

          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                clearInterval(interval);
                router.push("/home");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          toast.error(res.data.error || "Failed to save profile");
        }
      } catch (error) {
        toast.error("Server error while saving profile");
      }
    }

    setIsAnimating(false);
  };

  const handlePrevious = async () => {
    setIsAnimating(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }

    setIsAnimating(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profileData.name.trim().length > 0;
      case 2:
        return profileData.dateOfBirth !== undefined;
      case 3:
        return profileData.occupation.length > 0;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  if (isCompleted) {
    return (
      <div className=" bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center p-4 max-[500px]:p-0">
        <div className="max-w-lg w-full  max-[500px]:w-screen max-[500px]:h-screen">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm p-0 max-[500px]:rounded-none max-[500px]:w-full max-[500px]:h-full">
            <CardHeader className="text-center  pt-8">
              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-rose-500 shadow-lg transform transition-all duration-1000 ${
                  showSuccess ? "scale-110 rotate-12" : "scale-100"
                }`}
              >
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-3xl font-semibold font-sora bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
                Profile Complete!
              </CardTitle>
              <CardDescription className="text-xl text-black font-medium font-inter mt-2">
                Welcome to Spark<span className="text-rose-500">Path</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-8">
              <Image
                src="/man.png"
                alt="SparkPath Logo"
                width={180}
                height={180}
                className="mx-auto rounded-full bg-rose-100"
              />
              <div className="space-y-4 font-inter">
                <div className="group flex items-center space-x-4 px-4 ">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rose-600 uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-xl font-medium text-gray-800">
                      {profileData.name}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center space-x-4 p-4 ">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <CalendarIconLucide className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rose-600 uppercase tracking-wide">
                      Date of Birth
                    </p>
                    <p className="text-xl font-medium text-gray-800">
                      {profileData.dateOfBirth
                        ? format(profileData.dateOfBirth, "PPP")
                        : "Not set"}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center space-x-4 p-4 ">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rose-600 uppercase tracking-wide">
                      Occupation
                    </p>
                    <p className="text-xl font-medium text-gray-800">
                      {profileData.occupation}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                // onClick={resetProfile}
                className="w-full h-12 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                size="lg"
              >
                <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                Continue
              </Button>
              <p className="text-center text-gray-600 font-light mt-3">
                Redirecting in{" "}
                <span className="font-medium text-sm text-rose-500">
                  {countdown}
                </span>{" "}
                seconds...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center p-4 max-[500px]:px-0">
      <div className="max-w-lg w-full max-[500px]:w-screen max-[500px]:h-screen h-auto">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden p-0 max-[500px]:rounded-none max-[500px]:w-full max-[500px]:h-full">
          <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white pb-6 pt-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl font-medium tracking-tight font-sora">
                Complete Profile
              </CardTitle>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm font-inter">
                <span className="text-sm font-medium">Step {currentStep}</span>
                <span className="text-sm opacity-75">of {totalSteps}</span>
              </div>
            </div>
            <div className="relative">
              <Progress
                value={progress}
                className="w-full h-3 bg-white/20 rounded-full overflow-hidden"
              />
              <div
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-white to-rose-100 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div
              className={`transition-all duration-500 ${
                isAnimating
                  ? "opacity-0 transform translate-x-4"
                  : "opacity-100 transform translate-x-0"
              }`}
            >
              {/* Step 1: Name */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-rose-500 shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium font-sora text-gray-800 mb-2">
                      {"What's your name?"}
                    </h3>
                    <p className="text-gray-600 text-lg font-inter">
                      {"Let's start with your full name"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 uppercase tracking-wide"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="h-12 text-lg border-2 border-rose-100 rounded-2xl focus:border-rose-400 focus:ring-rose-400 bg-white/50 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Date of Birth */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-rose-500 shadow-lg">
                      <CalendarIconLucide className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium font-sora text-gray-800 mb-2">
                      When were you born?
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Select your date of birth
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium font-inter text-gray-700 uppercase tracking-wide">
                      Date of Birth
                    </Label>
                    <input
                      type="date"
                      className="w-full h-12 text-lg border-2 border-rose-100 rounded-2xl focus:border-rose-400 focus:ring-rose-400 bg-white/50 backdrop-blur-sm transition-all duration-300 px-4"
                      value={
                        profileData.dateOfBirth
                          ? new Date(profileData.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          dateOfBirth: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                      min="1900-01-01"
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Occupation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-rose-500 shadow-lg">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium font-sora text-gray-800 mb-2">
                      What do you do?
                    </h3>
                    <p className="text-gray-600 text-lg font-inter">
                      Select your occupation
                    </p>
                  </div>

                  <div className="space-y-3 w-full">
                    <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                      Occupation
                    </Label>
                    <Select
                      value={profileData.occupation}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, occupation: value })
                      }
                    >
                      <SelectTrigger className="w-full h-12 text-lg border-2 border-rose-100 rounded-2xl focus:border-rose-400 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent className="w-full border-0 shadow-2xl rounded-2xl">
                        {occupations.map((occupation) => (
                          <SelectItem
                            key={occupation}
                            value={occupation}
                            className="text-lg py-3 hover:bg-rose-50 focus:bg-rose-50 rounded-xl"
                          >
                            {occupation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isAnimating}
                className="flex items-center h-10 px-8 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || isAnimating}
                className="flex items-center h-10 px-8 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
              >
                {currentStep === totalSteps ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
