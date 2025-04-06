export interface Facility {
  facility_id: string;
  aspen_facid?: string;
  status: string;
  certification_type: string;
  county: string;
  fips_county_code?: string;
  participation_date?: number;
  approval_date?: number;
  type_of_care?: string;
  critical_access?: string;
  facility_name: string;
  address: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
  contact_email?: string;
  contact_phone?: string;
  num_beds: number;
  in_psps_zone?: boolean;
  in_fire_zone?: boolean;
  in_earthquake_zone?: boolean;
  proximity_to_dispatch_center?: string;
  outage_likelihood_score?: number;
  google_map_link?: string;
}
