import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CSVUploader } from "@/components/assessment/csv-uploader";
import { LoadCalculator } from "@/components/assessment/load-calculator";
import { UsageChart } from "@/components/assessment/usage-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFacility } from "@/lib/facility-context";
import { Link } from "wouter";

export default function Assessment() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { selectedFacility, facilities } = useFacility();

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
                    Facility Assessment
                  </h1>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <Link href="/compliance">
                    <Button className="ml-3 inline-flex items-center">
                      Next: Compliance
                      <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="px-4 sm:px-6 md:px-8 mt-6 grid grid-cols-1 gap-6">
              {/* If no facility data is uploaded yet, show CSV uploader */}
              {facilities.length === 0 ? (
                <CSVUploader />
              ) : (
                <>
                  {/* Facility Selector (if we have facilities) */}
                  {facilities.length > 0 && (
                    <Card className="bg-white rounded-lg shadow overflow-hidden">
                      <CardHeader>
                        <h2 className="text-xl font-semibold text-gray-800">Selected Facility</h2>
                        <p className="text-gray-500">
                          {selectedFacility ? (
                            <>
                              {selectedFacility.facility_name} - {selectedFacility.address}, {selectedFacility.city}, CA {selectedFacility.zip}
                            </>
                          ) : (
                            "No facility selected. Please select a facility from your uploaded data."
                          )}
                        </p>
                      </CardHeader>
                      {facilities.length > 1 && (
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {facilities.slice(0, 6).map((facility) => (
                              <Button
                                key={facility.facility_id}
                                variant="outline"
                                className={`justify-start h-auto py-3 ${
                                  selectedFacility?.facility_id === facility.facility_id
                                    ? "border-primary-500 bg-primary-50"
                                    : ""
                                }`}
                                onClick={() => useFacility().selectFacility(facility)}
                              >
                                <div className="text-left">
                                  <div className="font-medium">{facility.facility_name}</div>
                                  <div className="text-xs text-gray-500">{facility.city}, CA</div>
                                </div>
                              </Button>
                            ))}
                          </div>
                          {facilities.length > 6 && (
                            <div className="mt-3 text-sm text-gray-500">
                              Showing 6 of {facilities.length} facilities
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  )}

                  {/* Load Calculator */}
                  <LoadCalculator />

                  {/* Usage Chart */}
                  <UsageChart />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
