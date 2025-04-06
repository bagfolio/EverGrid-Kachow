import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FAQ } from "@/components/resources/faq";
import { ReportGenerator } from "@/components/resources/report-generator";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

export default function Resources() {
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
            {/* Page Header */}
            <div className="px-4 sm:px-6 md:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate font-display">
                    Resources & Documentation
                  </h1>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <Link href="/map">
                    <Button className="ml-3 inline-flex items-center">
                      View Map
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
              {/* Documentation */}
              <Card className="bg-white rounded-lg shadow overflow-hidden">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-800">AB 2511 Documentation</h2>
                  <p className="text-gray-500">
                    Important documentation and reference materials for compliance
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                      <FileText className="h-8 w-8 text-primary-500 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-800">AB 2511 Full Text</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Complete text of the Assembly Bill 2511 legislation regarding skilled nursing facility backup power requirements.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                      <FileText className="h-8 w-8 text-primary-500 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-800">Compliance Checklist</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Detailed checklist of all requirements for AB 2511 compliance.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                      <FileText className="h-8 w-8 text-primary-500 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-800">Technical Specifications</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Technical guidelines for battery backup systems that meet compliance requirements.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                      <FileText className="h-8 w-8 text-primary-500 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-800">Implementation Guide</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Step-by-step guide for implementing backup power solutions in SNFs.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Generator */}
              <ReportGenerator />

              {/* FAQ */}
              <FAQ />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
