export type ItemType =
  | 'accommodation'
  | 'transfer'
  | 'sightseeing'
  | 'meal'
  | 'free_time'
  | 'arrival'
  | 'departure'
  | 'custom_note';

export type SectionType =
  | 'inclusions'
  | 'exclusions'
  | 'important_notes'
  | 'terms_and_conditions'
  | 'general_overview'
  | 'cancellation_policy';

export type ThemeType = 'editorial' | 'classic';

export interface DayItem {
  id: string;
  day_id?: string;
  position: number;
  item_type: ItemType;
  title: string;
  description: string;
  time_text?: string | null;
  location?: string | null;
  image_url?: string | null;
  internal_note?: string | null;
}

export interface ItineraryDay {
  id: string;
  itinerary_id?: string;
  position: number;
  day_number: number;
  date?: string | null;
  title: string;
  destination: string;
  hero_image_url?: string | null;
  hero_image_caption?: string | null;
  hero_image_attribution?: string | null;
  hero_image_focal_x?: number;
  hero_image_focal_y?: number;
  hero_image_fit?: 'cover' | 'contain';
  description: string;
  items: DayItem[];
}

export interface ItinerarySection {
  id: string;
  itinerary_id?: string;
  position: number;
  section_type: SectionType;
  title: string;
  content: string;
  visible_in_pdf: boolean;
}

export interface Itinerary {
  id: string;
  agency_id: string;
  created_by: string;
  title: string;
  subtitle?: string | null;
  customer_name?: string | null;
  show_customer_name_in_pdf: boolean;
  notes?: string | null;
  internal_notes?: string | null;
  show_internal_notes_in_pdf: boolean;
  days_count: number;
  nights_count: number;
  start_date?: string | null;
  passenger_count?: string | null;
  destination_summary?: string | null;
  status: 'draft' | 'exported' | 'archived';
  theme: ThemeType;
  cover_image_url?: string | null;
  source_text?: string | null;
  days: ItineraryDay[];
  sections: ItinerarySection[];
  created_at: string;
  updated_at: string;
}

export interface Agency {
  id: string;
  owner_user_id: string;
  name: string;
  logo_url?: string | null;
  brand_colour: string;
  phone: string;
  phones?: string[];
  email: string;
  website: string;
  footer_disclaimer: string;
  default_theme: ThemeType;
  created_at: string;
}

export interface ParseWarning {
  code: string;
  message: string;
  line_number?: number | null;
  raw_text?: string | null;
}

export interface ParseResponse {
  itinerary: Itinerary;
  warnings: ParseWarning[];
  unassigned_text?: string | null;
}

export interface ImageSearchResult {
  id: string;
  url: string;
  thumb_url: string;
  title: string;
  attribution: string;
  source: string;
}

export interface GoogleSheetsConfig {
  enabled: boolean;
  sheet_id: string;
  service_account_json?: string | null;
  last_synced?: string | null;
}
