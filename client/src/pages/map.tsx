import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFacility } from "@/lib/facility-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Dynamically importing Leaflet since it requires browser-only features
const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { facilities, selectedFacility, selectFacility } = useFacility();
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    // Only run in the browser
    if (typeof window !== "undefined" && facilities.length > 0 && mapRef.current && !mapInitialized) {
      // Dynamically import Leaflet
      import("leaflet").then((L) => {
        // Also import Leaflet CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
        document.head.appendChild(link);

        // Initialize map
        const map = L.map(mapRef.current).setView([37.7749, -122.4194], 6);

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers for all facilities
        facilities.forEach(facility => {
          if (facility.latitude && facility.longitude) {
            const marker = L.marker([facility.latitude, facility.longitude])
              .addTo(map)
              .bindPopup(`
                <strong>${facility.facility_name}</strong><br>
                ${facility.address}, ${facility.city}, CA ${facility.zip}<br>
                <button id="select-${facility.facility_id}" class="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">Select Facility</button>
              `);
            
            marker.on('popupopen', () => {
              setTimeout(() => {
                const button = document.getElementById(`select-${facility.facility_id}`);
                if (button) {
                  button.addEventListener('click', () => {
                    selectFacility(facility);
                    marker.closePopup();
                  });
                }
              }, 0);
            });
            
            // Highlight selected facility
            if (selectedFacility && facility.facility_id === selectedFacility.facility_id) {
              marker.setPopupContent(`
                <strong>${facility.facility_name}</strong><br>
                ${facility.address}, ${facility.city}, CA ${facility.zip}<br>
                <span class="text-green-500 font-bold">Currently Selected</span>
              `);
              marker.openPopup();
            }
          }
        });

        // Fit map to markers
        if (facilities.length > 0) {
          const validFacilities = facilities.filter(f => f.latitude && f.longitude);
          if (validFacilities.length > 0) {
            const bounds = validFacilities.map(f => [f.latitude, f.longitude]);
            map.fitBounds(bounds as any);
          }
        }

        setMapInitialized(true);
      });
    }
  }, [facilities, selectedFacility, mapInitialized]);

  return (
    <div ref={mapRef} className="w-full h-[600px] rounded-lg"></div>
  );
};

export default function MapView() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { facilities } = useFacility();

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
                    Facility Map View
                  </h1>
                </div>
              </div>
            </div>

            {/* Map Content */}
            <div className="px-4 sm:px-6 md:px-8 mt-6">
              <Card className="bg-white rounded-lg shadow overflow-hidden">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-800">California SNF Facilities</h2>
                  <p className="text-gray-500">
                    View all facilities and their AB 2511 compliance status
                  </p>
                </CardHeader>
                <CardContent>
                  {facilities.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No facilities to display</AlertTitle>
                      <AlertDescription>
                        Please upload facility data to view on the map.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <MapComponent />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Legend */}
            {facilities.length > 0 && (
              <div className="px-4 sm:px-6 md:px-8 mt-6">
                <Card className="bg-white rounded-lg shadow overflow-hidden">
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-800">Map Legend</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm text-gray-700">Standard Facility</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm text-gray-700">In PSPS Zone</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm text-gray-700">In Fire Zone</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
