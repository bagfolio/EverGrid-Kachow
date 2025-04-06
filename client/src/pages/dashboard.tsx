import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useFacility } from "@/lib/facility-context";
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
import { motion } from "framer-motion";
import { BatteryCharging, Zap } from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const { user } = useAuth();
  const { selectedFacility } = useFacility();
  
  // Auto-hide welcome message after 10 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

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
            
            {/* Welcome Banner */}
            {showWelcome && (
              <motion.div 
                className="px-4 sm:px-6 md:px-8 mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-r from-primary/90 to-purple-600 text-white p-4 rounded-lg shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <button 
                      onClick={() => setShowWelcome(false)}
                      className="text-white/80 hover:text-white"
                      aria-label="Close welcome message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 bg-white/10 p-2 rounded-full">
                      <BatteryCharging className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Welcome back, {user?.username || "Guest"}!
                      </h3>
                      <p className="text-white/90 mt-1">
                        {selectedFacility ? (
                          <>Your facility <span className="font-medium">{selectedFacility.facility_name}</span> is on track for AB 2511 compliance.</>
                        ) : (
                          <>To get started, please add your facility information and upload your utility bill.</>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 opacity-10">
                    <Zap className="h-24 w-24" />
                  </div>
                </div>
              </motion.div>
            )}

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
