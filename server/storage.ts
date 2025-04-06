import { facilities, type Facility, type InsertFacility } from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  getFacility(id: string): Promise<Facility | undefined>;
  getFacilities(): Promise<Facility[]>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: string, facilityData: Partial<Facility>): Promise<Facility | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private facilities: Map<string, Facility>;

  constructor() {
    this.facilities = new Map();
  }

  async getFacility(id: string): Promise<Facility | undefined> {
    return this.facilities.get(id);
  }

  async getFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    const facility: Facility = { ...insertFacility };
    this.facilities.set(facility.facility_id, facility);
    return facility;
  }

  async updateFacility(id: string, facilityData: Partial<Facility>): Promise<Facility | undefined> {
    const existingFacility = this.facilities.get(id);
    
    if (!existingFacility) {
      return undefined;
    }
    
    const updatedFacility = { ...existingFacility, ...facilityData };
    this.facilities.set(id, updatedFacility);
    
    return updatedFacility;
  }
}

export const storage = new MemStorage();
