"use client";

// import { useState } from "react";
import Homenav from "@/components/Homenav";
// import Sidebar from "@/components/Hero-sidebar";
import { AppProvider } from "@/context/AppContext";
import { AIProvider } from "@/context/AIcontext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white min-h-screen w-full relative">
      <AppProvider>
        <AIProvider>
          <Homenav />
          {/* <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          /> */}

          <main className="">{children}</main>
        </AIProvider>
      </AppProvider>
    </section>
  );
}
