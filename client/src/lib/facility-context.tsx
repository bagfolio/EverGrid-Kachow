import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Facility } from "../types/facility";

interface FacilityContextType {
  facilities: Facility[];
  selectedFacility: Facility | null;
  selectFacility: (facility: Facility) => void;
  addFacilities: (facilities: Facility[]) => void;
  saveFacilityData: () => void;
  loadFacilityData: () => void;
  progress: {
    profile: boolean;
    assessment: boolean;
    financial: boolean;
    deployment: boolean;
  };
  updateProgress: (stage: keyof FacilityContextType['progress'], value: boolean) => void;
}

const defaultProgress = {
  profile: false,
  assessment: false,
  financial: false,
  deployment: false,
};

const FacilityContext = createContext<FacilityContextType | null>(null);

export const useFacility = () => {
  const context = useContext(FacilityContext);
  if (!context) {
    throw new Error("useFacility must be used within a FacilityProvider");
  }
  return context;
};

export const FacilityProvider = ({ children }: { children: ReactNode }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [progress, setProgress] = useState(defaultProgress);

  // Load data from localStorage on initial render
  useEffect(() => {
    loadFacilityData();
  }, []);

  const selectFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    // Update localStorage
    localStorage.setItem('selectedFacility', JSON.stringify(facility));
  };

  const addFacilities = (newFacilities: Facility[]) => {
    // Merge with existing facilities, avoiding duplicates
    const mergedFacilities = [...facilities];
    
    newFacilities.forEach(newFacility => {
      const existingIndex = mergedFacilities.findIndex(
        f => f.facility_id === newFacility.facility_id
      );
      
      if (existingIndex >= 0) {
        mergedFacilities[existingIndex] = newFacility;
      } else {
        mergedFacilities.push(newFacility);
      }
    });
    
    setFacilities(mergedFacilities);
    
    // If no facility is selected yet, select the first one
    if (!selectedFacility && mergedFacilities.length > 0) {
      selectFacility(mergedFacilities[0]);
    }

    // Save to localStorage
    localStorage.setItem('facilities', JSON.stringify(mergedFacilities));
  };

  const saveFacilityData = () => {
    localStorage.setItem('facilities', JSON.stringify(facilities));
    localStorage.setItem('selectedFacility', JSON.stringify(selectedFacility));
    localStorage.setItem('progress', JSON.stringify(progress));
  };

  const loadFacilityData = () => {
    try {
      const savedFacilities = localStorage.getItem('facilities');
      const savedSelectedFacility = localStorage.getItem('selectedFacility');
      const savedProgress = localStorage.getItem('progress');
      
      if (savedFacilities) {
        setFacilities(JSON.parse(savedFacilities));
      }
      
      if (savedSelectedFacility) {
        setSelectedFacility(JSON.parse(savedSelectedFacility));
      }
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  };

  const updateProgress = (stage: keyof typeof progress, value: boolean) => {
    setProgress(prev => {
      const updated = { ...prev, [stage]: value };
      localStorage.setItem('progress', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <FacilityContext.Provider
      value={{
        facilities,
        selectedFacility,
        selectFacility,
        addFacilities,
        saveFacilityData,
        loadFacilityData,
        progress,
        updateProgress
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
};
