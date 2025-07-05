"use client";

import Homenav from "@/components/Homenav";
import Sidebar from "@/components/Hero-Sidebar";
import { AppProvider } from "@/context/AppContext";
import { AIProvider } from "@/context/AIcontext";
import { useState } from "react";
import { TourProvider } from "@reactour/tour";

const tourSteps = [
  {
    selector: ".orb-rider",
    content:
      "MEET SPARKPATH, YOUR LEARNING COMPANION! SPARKPATH IS HERE TO GUIDE YOU THROUGH YOUR LEARNING JOURNEY.",
  },
  {
    selector: ".suggest-rider",
    content:
      "AI suggests topics based on your interests and occupation that you can explore.",
  },
  {
    selector: ".input-rider",
    content: "enter your topic here to get a personalized learning plan.",
  },
  {
    selector: ".min-rider",
    content:
      "tired of typing ? click the mic icon to speak your topic. and let SparkPath do the rest.",
  },
];

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="bg-white min-h-screen w-full relative">
      <AppProvider>
        <AIProvider>
          <TourProvider steps={tourSteps} disableInteraction>
            <Homenav
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />

            <main className="">{children}</main>
          </TourProvider>
        </AIProvider>
      </AppProvider>
    </section>
  );
}
