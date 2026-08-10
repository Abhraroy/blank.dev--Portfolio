import React from "react";
import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";

export const metadata = {
  title: "Admin Studio - Portfolio Data Control",
  description: "Manage portfolio modes, projects, career experience, and personal details.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans selection:bg-zinc-800 selection:text-white">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
