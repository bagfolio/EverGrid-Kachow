import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const facilities = pgTable("facilities", {
  facility_id: text("facility_id").primaryKey(),
  aspen_facid: text("aspen_facid"),
  status: text("status").notNull(),
  certification_type: text("certification_type").notNull(),
  county: text("county").notNull(),
  fips_county_code: text("fips_county_code"),
  participation_date: integer("participation_date"),
  approval_date: integer("approval_date"),
  type_of_care: text("type_of_care"),
  critical_access: text("critical_access"),
  facility_name: text("facility_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  zip: text("zip").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  contact_email: text("contact_email"),
  contact_phone: text("contact_phone"),
  num_beds: integer("num_beds").notNull(),
  in_psps_zone: boolean("in_psps_zone"),
  in_fire_zone: boolean("in_fire_zone"),
  in_earthquake_zone: boolean("in_earthquake_zone"),
  proximity_to_dispatch_center: text("proximity_to_dispatch_center"),
  outage_likelihood_score: real("outage_likelihood_score"),
  google_map_link: text("google_map_link")
});

export const insertFacilitySchema = createInsertSchema(facilities);

export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;

// Define schema for progress tracking 
export const facilityProgress = pgTable("facility_progress", {
  id: serial("id").primaryKey(),
  facility_id: text("facility_id").notNull(),
  profile_complete: boolean("profile_complete").default(false),
  assessment_complete: boolean("assessment_complete").default(false),
  compliance_complete: boolean("compliance_complete").default(false),
  financial_complete: boolean("financial_complete").default(false),
  deployment_complete: boolean("deployment_complete").default(false),
  last_updated: text("last_updated").notNull(),
});

export const insertFacilityProgressSchema = createInsertSchema(facilityProgress).omit({
  id: true
});

export type InsertFacilityProgress = z.infer<typeof insertFacilityProgressSchema>;
export type FacilityProgress = typeof facilityProgress.$inferSelect;
