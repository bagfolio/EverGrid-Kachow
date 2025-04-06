import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ROICalculator } from "@/components/financial/roi-calculator";
import { OwnershipCost } from "@/components/financial/ownership-cost";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useFacility } from "@/lib/facility-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Financial() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { selectedFacility, progress } = useFacility();

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
            {/* Page Header */}
            <div className="px-4 sm:px-6 md:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate font-display">
                    Financial Analysis
                  </h1>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <Link href="/deployment">
                    <Button className="ml-3 inline-flex items-center">
                      Next: Deployment Planning
                      <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="px-4 sm:px-6 md:px-8 mt-6 grid grid-cols-1 gap-6">
              {!selectedFacility && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No facility selected</AlertTitle>
                  <AlertDescription>
                    Please upload facility data or select a facility to view financial analysis.
                  </AlertDescription>
                </Alert>
              )}

              {!progress.assessment && selectedFacility && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Assessment not completed</AlertTitle>
                  <AlertDescription>
                    To get accurate financial calculations, please complete your facility assessment first.
                    <Link href="/assessment">
                      <Button variant="link" className="p-0 h-auto ml-2">
                        Go to Assessment
                      </Button>
                    </Link>
                  </AlertDescription>
                </Alert>
              )}

              {/* ROI Calculator */}
              <ROICalculator />

              {/* Ownership Cost Analysis */}
              <OwnershipCost />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
