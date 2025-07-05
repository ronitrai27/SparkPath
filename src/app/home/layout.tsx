"use client";

// import { useState } from "react";
import Homenav from "@/components/Homenav";
import Sidebar from "@/components/Hero-Sidebar";
import { AppProvider } from "@/context/AppContext";
import { AIProvider } from "@/context/AIcontext";
import { useState } from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    // console.log("Toggling sidebar...");
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <section className="bg-white min-h-screen w-full relative">
      <AppProvider>
        <AIProvider>
          <Homenav
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <main className="">{children}</main>
        </AIProvider>
      </AppProvider>
    </section>
  );
}
