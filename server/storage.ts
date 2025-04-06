import { facilities, type Facility, type InsertFacility,
         users, type User, type InsertUser,
         facilityProgress, type FacilityProgress, type InsertFacilityProgress } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { Store } from "express-session";

const MemoryStore = createMemoryStore(session);

// Interface for all storage operations
export interface IStorage {
  // Facility operations
  getFacility(id: string): Promise<Facility | undefined>;
  getFacilities(): Promise<Facility[]>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: string, facilityData: Partial<Facility>): Promise<Facility | undefined>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Progress operations
  getFacilityProgress(facilityId: string): Promise<FacilityProgress | undefined>;
  createFacilityProgress(progress: InsertFacilityProgress): Promise<FacilityProgress>;
  updateFacilityProgress(id: number, progressData: Partial<FacilityProgress>): Promise<FacilityProgress | undefined>;
  
  // Public access to collections for admin routes
  users: Map<number, User>;
  progress: Map<number, FacilityProgress>;
  
  // Session store
  sessionStore: Store;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  public facilities: Map<string, Facility>;
  public users: Map<number, User>;
  public progress: Map<number, FacilityProgress>;
  private nextUserId: number;
  private nextProgressId: number;
  public sessionStore: Store;

  constructor() {
    this.facilities = new Map();
    this.users = new Map();
    this.progress = new Map();
    this.nextUserId = 1;
    this.nextProgressId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "password123", // This would be hashed in a real application
      role: "admin",
      name: "Admin User",
      email: "admin@evergrid.com",
      created_at: new Date().toISOString()
    });
  }

  // Facility methods
  async getFacility(id: string): Promise<Facility | undefined> {
    return this.facilities.get(id);
  }

  async getFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    // Make sure all nullable fields are explicitly set to null if undefined
    const facility: Facility = {
      facility_id: insertFacility.facility_id,
      status: insertFacility.status,
      certification_type: insertFacility.certification_type,
      county: insertFacility.county,
      facility_name: insertFacility.facility_name,
      address: insertFacility.address,
      city: insertFacility.city,
      zip: insertFacility.zip,
      latitude: insertFacility.latitude,
      longitude: insertFacility.longitude,
      num_beds: insertFacility.num_beds,
      
      // Nullable fields
      aspen_facid: insertFacility.aspen_facid ?? null,
      fips_county_code: insertFacility.fips_county_code ?? null,
      participation_date: insertFacility.participation_date ?? null,
      approval_date: insertFacility.approval_date ?? null,
      type_of_care: insertFacility.type_of_care ?? null,
      critical_access: insertFacility.critical_access ?? null,
      contact_email: insertFacility.contact_email ?? null,
      contact_phone: insertFacility.contact_phone ?? null,
      in_psps_zone: insertFacility.in_psps_zone ?? null,
      in_fire_zone: insertFacility.in_fire_zone ?? null,
      in_earthquake_zone: insertFacility.in_earthquake_zone ?? null,
      proximity_to_dispatch_center: insertFacility.proximity_to_dispatch_center ?? null,
      outage_likelihood_score: insertFacility.outage_likelihood_score ?? null,
      google_map_link: insertFacility.google_map_link ?? null
    };
    
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
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    // Convert users.values() to array to avoid iterator issues
    const userArray = Array.from(this.users.values());
    return userArray.find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    
    // Make sure all nullable fields are explicitly set to null if undefined
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role ?? "client", // Default role to client
      created_at: insertUser.created_at,
      name: insertUser.name ?? null,
      email: insertUser.email ?? null
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  // Progress methods
  async getFacilityProgress(facilityId: string): Promise<FacilityProgress | undefined> {
    // Convert progress.values() to array to avoid iterator issues
    const progressArray = Array.from(this.progress.values());
    return progressArray.find(progress => progress.facility_id === facilityId);
  }
  
  async createFacilityProgress(insertProgress: InsertFacilityProgress): Promise<FacilityProgress> {
    const id = this.nextProgressId++;
    
    // Make sure all nullable fields are explicitly set to null if undefined
    const progress: FacilityProgress = {
      id,
      facility_id: insertProgress.facility_id,
      last_updated: insertProgress.last_updated,
      profile_complete: insertProgress.profile_complete ?? null,
      assessment_complete: insertProgress.assessment_complete ?? null,
      compliance_complete: insertProgress.compliance_complete ?? null,
      financial_complete: insertProgress.financial_complete ?? null,
      deployment_complete: insertProgress.deployment_complete ?? null,
      user_id: insertProgress.user_id ?? null
    };
    
    this.progress.set(id, progress);
    return progress;
  }
  
  async updateFacilityProgress(id: number, progressData: Partial<FacilityProgress>): Promise<FacilityProgress | undefined> {
    const existingProgress = this.progress.get(id);
    
    if (!existingProgress) {
      return undefined;
    }
    
    const updatedProgress = { ...existingProgress, ...progressData };
    this.progress.set(id, updatedProgress);
    
    return updatedProgress;
  }
}

export const storage = new MemStorage();
