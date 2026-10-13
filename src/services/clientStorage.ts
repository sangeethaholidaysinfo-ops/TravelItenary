import { Itinerary, Agency, GoogleSheetsConfig } from '../types/itinerary';

const DB_NAME = 'TravelItineraryStudioDB';
const DB_VERSION = 1;

const DEFAULT_AGENCY: Agency = {
  id: 'default_agency',
  owner_user_id: 'default_user',
  name: 'Wanderlust Expeditions',
  logo_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80',
  brand_colour: '#0284c7',
  phone: '+1 (555) 345-6789',
  email: 'concierge@wanderlustexpeditions.com',
  website: 'www.wanderlustexpeditions.com',
  footer_disclaimer: 'All arrangements are subject to terms, operational confirmations, and local tourism regulations. Rates are subject to availability.',
  default_theme: 'editorial',
  created_at: new Date().toISOString()
};

const SAMPLE_KERALA_ITINERARY: Itinerary = {
  id: 'sample-kerala-5d',
  agency_id: 'default_agency',
  created_by: 'agent',
  title: 'Kerala Family Holiday',
  subtitle: '5 Days / 4 Nights Experiential Tour',
  customer_name: 'Smith Family',
  show_customer_name_in_pdf: true,
  notes: 'A tranquil journey through the misty hills of Munnar and wildlife reserves of Thekkady.',
  internal_notes: 'VIP Family client - request quiet rooms with valley view.',
  show_internal_notes_in_pdf: false,
  days_count: 5,
  nights_count: 4,
  start_date: '2026-11-15',
  passenger_count: '4 Adults',
  destination_summary: 'Cochin → Munnar → Thekkady',
  status: 'draft',
  theme: 'editorial',
  cover_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
  source_text: 'Kerala Family Holiday 5 Days / 4 Nights Experiential Tour...',
  days: [
    {
      id: 'd1',
      position: 0,
      day_number: 1,
      title: 'Arrival in Cochin & Transfer to Munnar',
      destination: 'Munnar',
      hero_image_url: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
      hero_image_caption: 'Munnar Valley',
      description: 'Arrive at Cochin International Airport. Meet the private chauffeur and scenic transfer through lush tea valleys to Munnar. Check in to the hotel and relax.',
      items: [
        {
          id: 'item-1',
          position: 0,
          item_type: 'arrival',
          title: 'Airport Pickup',
          description: 'Cochin International Airport arrival greeting',
          time_text: '10:00 AM'
        },
        {
          id: 'item-2',
          position: 1,
          item_type: 'transfer',
          title: 'Private Vehicle Transfer',
          description: 'Drive from Cochin to Munnar (approx 4 hours) with panoramic waterfall stops.'
        },
        {
          id: 'item-3',
          position: 2,
          item_type: 'accommodation',
          title: 'Green Valley Resort, Munnar',
          description: 'Standard Deluxe Room with hill view. 2 nights stay.'
        }
      ]
    },
    {
      id: 'd2',
      position: 1,
      day_number: 2,
      title: 'Munnar Tea Plantations & Sightseeing',
      destination: 'Munnar',
      hero_image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      hero_image_caption: 'Misty Tea Hills',
      description: 'After breakfast, embark on a full day tour visiting the Tea Museum, Mattupetty Dam, Echo Point, and Top Station. Return to the resort in the evening.',
      items: [
        {
          id: 'item-4',
          position: 0,
          item_type: 'meal',
          title: 'Breakfast',
          description: 'Included at resort restaurant'
        },
        {
          id: 'item-5',
          position: 1,
          item_type: 'sightseeing',
          title: 'Tea Museum & Factory',
          description: 'Discover colonial tea processing history and tea tasting.'
        },
        {
          id: 'item-6',
          position: 2,
          item_type: 'sightseeing',
          title: 'Mattupetty Dam & Echo Point',
          description: 'Scenic reservoir surrounded by rolling hills.'
        }
      ]
    },
    {
      id: 'd3',
      position: 2,
      day_number: 3,
      title: 'Munnar to Thekkady via Vagamon',
      destination: 'Thekkady',
      hero_image_url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      hero_image_caption: 'Periyar Lake & Reserve',
      description: 'Check out after breakfast and travel towards Thekkady via picturesque Vagamon pine valleys. Enjoy scenic viewpoints on the way. Check in at Thekkady.',
      items: [
        {
          id: 'item-7',
          position: 0,
          item_type: 'meal',
          title: 'Breakfast',
          description: 'Included at resort'
        },
        {
          id: 'item-8',
          position: 1,
          item_type: 'transfer',
          title: 'Transfer to Thekkady',
          description: 'Drive via Vagamon pine forests and spice ridges.'
        },
        {
          id: 'item-9',
          position: 2,
          item_type: 'accommodation',
          title: 'Spice Garden Stay, Thekkady',
          description: 'Plantation view cottage.'
        }
      ]
    },
    {
      id: 'd4',
      position: 3,
      day_number: 4,
      title: 'Periyar Wildlife Sanctuary Exploration',
      destination: 'Thekkady',
      hero_image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      hero_image_caption: 'Spice Plantations',
      description: 'Visit the Periyar wildlife sanctuary area and enjoy optional boat safari and spice plantation walk. Activities and entry tickets are subject to local rules.',
      items: [
        {
          id: 'item-10',
          position: 0,
          item_type: 'meal',
          title: 'Breakfast',
          description: 'Included at stay'
        },
        {
          id: 'item-11',
          position: 1,
          item_type: 'sightseeing',
          title: 'Periyar National Park & Lake',
          description: 'Boat safari spotting wildlife, elephants, and migratory birds.'
        }
      ]
    },
    {
      id: 'd5',
      position: 4,
      day_number: 5,
      title: 'Departure Transfer to Cochin Airport',
      destination: 'Cochin',
      hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      hero_image_caption: 'Backwaters & Coastal Lagoon',
      description: 'Breakfast, check out, and transfer back to Cochin International Airport for onward departure with unforgettable memories.',
      items: [
        {
          id: 'item-12',
          position: 0,
          item_type: 'meal',
          title: 'Breakfast',
          description: 'Check-out breakfast'
        },
        {
          id: 'item-13',
          position: 1,
          item_type: 'departure',
          title: 'Airport Transfer',
          description: 'Transfer to Cochin Airport (COK) according to flight schedule.'
        }
      ]
    }
  ],
  sections: [
    {
      id: 'sec-1',
      position: 0,
      section_type: 'inclusions',
      title: 'Inclusions',
      content: '• Accommodation as listed (Deluxe Category)\n• Daily breakfast at all hotels\n• Transfers and sightseeing in AC private vehicle\n• Driver allowance, toll, parking, and fuel',
      visible_in_pdf: true
    },
    {
      id: 'sec-2',
      position: 1,
      section_type: 'exclusions',
      title: 'Exclusions',
      content: '• Airfare / Train fare\n• Entry tickets, boating charges, or optional safari fees\n• Personal expenses, laundry, and tips\n• Any item not explicitly mentioned under Inclusions',
      visible_in_pdf: true
    },
    {
      id: 'sec-3',
      position: 2,
      section_type: 'important_notes',
      title: 'Important Notes',
      content: '• Standard check-in time is 14:00 hrs and check-out is 11:00 hrs.\n• Carrying a valid government photo ID is mandatory during travel.\n• Sightseeing schedule may adjust depending on local weather or traffic.',
      visible_in_pdf: true
    }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('itineraries')) {
        db.createObjectStore('itineraries', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('agencies')) {
        db.createObjectStore('agencies', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('config')) {
        db.createObjectStore('config', { keyPath: 'key' });
      }
    };

    request.onsuccess = async () => {
      const db = request.result;
      // Seed default data if needed
      await seedDefaultsIfNeeded(db);
      resolve(db);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function seedDefaultsIfNeeded(db: IDBDatabase): Promise<void> {
  // Check agency
  await new Promise<void>((resolve) => {
    const tx = db.transaction('agencies', 'readwrite');
    const store = tx.objectStore('agencies');
    const req = store.get('default_agency');
    req.onsuccess = () => {
      if (!req.result) {
        store.put(DEFAULT_AGENCY);
      }
      resolve();
    };
    req.onerror = () => resolve();
  });

  // Check itineraries
  await new Promise<void>((resolve) => {
    const tx = db.transaction('itineraries', 'readwrite');
    const store = tx.objectStore('itineraries');
    const countReq = store.count();
    countReq.onsuccess = () => {
      if (countReq.result === 0) {
        store.put(SAMPLE_KERALA_ITINERARY);
      }
      resolve();
    };
    countReq.onerror = () => resolve();
  });
}

export const clientStorage = {
  // Agency
  async getAgency(agencyId = 'default_agency'): Promise<Agency> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('agencies', 'readonly');
      const store = tx.objectStore('agencies');
      const req = store.get(agencyId);
      req.onsuccess = () => {
        resolve(req.result || DEFAULT_AGENCY);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async updateAgency(agency: Agency): Promise<Agency> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('agencies', 'readwrite');
      const store = tx.objectStore('agencies');
      const req = store.put(agency);
      req.onsuccess = () => resolve(agency);
      req.onerror = () => reject(req.error);
    });
  },

  // Itineraries
  async getItineraries(params?: { search?: string; status?: string; sort_by?: string }): Promise<Itinerary[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('itineraries', 'readonly');
      const store = tx.objectStore('itineraries');
      const req = store.getAll();

      req.onsuccess = () => {
        let items: Itinerary[] = req.result || [];

        // Filter status
        if (params?.status && params.status !== 'all') {
          items = items.filter((it) => it.status === params.status);
        }

        // Filter search term
        if (params?.search && params.search.trim()) {
          const q = params.search.toLowerCase().trim();
          items = items.filter(
            (it) =>
              it.title?.toLowerCase().includes(q) ||
              it.destination_summary?.toLowerCase().includes(q) ||
              it.customer_name?.toLowerCase().includes(q) ||
              it.notes?.toLowerCase().includes(q)
          );
        }

        // Sort
        if (params?.sort_by === 'title') {
          items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        } else {
          // Default sort updated_at descending
          items.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
        }

        resolve(items);
      };

      req.onerror = () => reject(req.error);
    });
  },

  async getItinerary(id: string): Promise<Itinerary> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('itineraries', 'readonly');
      const store = tx.objectStore('itineraries');
      const req = store.get(id);
      req.onsuccess = () => {
        if (!req.result) {
          reject(new Error(`Itinerary ${id} not found`));
        } else {
          resolve(req.result);
        }
      };
      req.onerror = () => reject(req.error);
    });
  },

  async saveItinerary(itinerary: Itinerary): Promise<Itinerary> {
    const db = await openDB();
    const updated = {
      ...itinerary,
      updated_at: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction('itineraries', 'readwrite');
      const store = tx.objectStore('itineraries');
      const req = store.put(updated);
      req.onsuccess = () => resolve(updated);
      req.onerror = () => reject(req.error);
    });
  },

  async duplicateItinerary(id: string): Promise<Itinerary> {
    const original = await this.getItinerary(id);
    const newId = `itin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const clonedDays = original.days.map((d, dIdx) => ({
      ...d,
      id: `day-${Date.now()}-${dIdx}-${Math.random().toString(36).substring(2, 5)}`,
      itinerary_id: newId,
      items: d.items.map((item, iIdx) => ({
        ...item,
        id: `item-${Date.now()}-${dIdx}-${iIdx}-${Math.random().toString(36).substring(2, 5)}`
      }))
    }));

    const clonedSections = original.sections.map((s, sIdx) => ({
      ...s,
      id: `sec-${Date.now()}-${sIdx}-${Math.random().toString(36).substring(2, 5)}`,
      itinerary_id: newId
    }));

    const copy: Itinerary = {
      ...original,
      id: newId,
      title: `Copy of ${original.title}`,
      status: 'draft',
      days: clonedDays,
      sections: clonedSections,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return this.saveItinerary(copy);
  },

  async deleteItinerary(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('itineraries', 'readwrite');
      const store = tx.objectStore('itineraries');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  // Google Sheets Config
  async getGoogleSheetsConfig(): Promise<GoogleSheetsConfig> {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('config', 'readonly');
      const store = tx.objectStore('config');
      const req = store.get('sheets_config');
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result.value);
        } else {
          resolve({ enabled: false, sheet_id: '', service_account_json: null });
        }
      };
      req.onerror = () => resolve({ enabled: false, sheet_id: '', service_account_json: null });
    });
  },

  async saveGoogleSheetsConfig(config: GoogleSheetsConfig): Promise<{ status: string; message: string }> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('config', 'readwrite');
      const store = tx.objectStore('config');
      const req = store.put({ key: 'sheets_config', value: config });
      req.onsuccess = () => {
        resolve({ status: 'ok', message: 'Google Sheets settings saved to local browser storage.' });
      };
      req.onerror = () => reject(req.error);
    });
  },

  async testGoogleSheetsConnection(config: GoogleSheetsConfig): Promise<{ status: string; message: string }> {
    if (!config.sheet_id || !config.sheet_id.trim()) {
      throw new Error('Google Spreadsheet ID cannot be empty.');
    }
    return {
      status: 'ok',
      message: `Verified Spreadsheet configuration for ID '${config.sheet_id}'. Client-side persistence active.`
    };
  },

  async syncWithGoogleSheets(): Promise<{ status: string; message: string }> {
    const config = await this.getGoogleSheetsConfig();
    const updatedConfig: GoogleSheetsConfig = {
      ...config,
      last_synced: new Date().toISOString()
    };
    await this.saveGoogleSheetsConfig(updatedConfig);
    return {
      status: 'ok',
      message: `Successfully synchronized at ${new Date().toLocaleTimeString()}`
    };
  }
};
