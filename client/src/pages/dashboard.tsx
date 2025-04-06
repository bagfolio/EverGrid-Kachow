import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CountdownTimer } from "@/components/dashboard/countdown-timer";
import { ProgressTracker } from "@/components/dashboard/progress-tracker";
import { FacilitySnapshot } from "@/components/dashboard/facility-snapshot";
import { RiskIndicator } from "@/components/dashboard/risk-indicator";
import { ROITeaser } from "@/components/dashboard/roi-teaser";
import { AssessmentOverview } from "@/components/dashboard/assessment-overview";
import { UploadPrompt } from "@/components/dashboard/upload-prompt";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0" style={{ display: sidebarOpen ? "" : "none" }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden" style={{ display: !sidebarOpen ? "" : "none" }}>
        <button
          onClick={toggleSidebar}
          className="fixed z-20 bottom-4 right-4 p-2 rounded-full bg-primary-500 text-white shadow-lg"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <Breadcrumbs />

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {/* Dashboard Header */}
            <div className="px-4 sm:px-6 md:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate font-display">
                    Dashboard
                  </h1>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="px-4 sm:px-6 md:px-8 mt-6">
              <CountdownTimer />
            </div>

            {/* Progress Tracker */}
            <div className="px-4 sm:px-6 md:px-8 mt-6">
              <ProgressTracker />
            </div>

            {/* Dashboard Cards Grid */}
            <div className="px-4 sm:px-6 md:px-8 mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <FacilitySnapshot />
              <RiskIndicator />
              <ROITeaser />
            </div>

            {/* Assessment Overview */}
            <div className="px-4 sm:px-6 md:px-8 mt-6">
              <AssessmentOverview />
            </div>

            {/* Upload Prompt */}
            <div className="px-4 sm:px-6 md:px-8 mt-6 mb-8">
              <UploadPrompt />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
