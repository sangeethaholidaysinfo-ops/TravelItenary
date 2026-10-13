import { ImageSearchResult } from '../types/itinerary';

const CURATED_DESTINATION_IMAGES: Record<string, Array<{ url: string; title: string; attribution: string }>> = {
  munnar: [
    { url: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80', title: 'Munnar Tea Valley', attribution: 'Unsplash / Kerala Tourism' },
    { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', title: 'Munnar Misty Hills', attribution: 'Unsplash / Travel Kerala' },
    { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', title: 'Mattupetty Reservoir', attribution: 'Unsplash / Scenic Nature' }
  ],
  thekkady: [
    { url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80', title: 'Periyar Lake & Reserve', attribution: 'Unsplash / Wild Periyar' },
    { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', title: 'Thekkady Spice Plantations', attribution: 'Unsplash / Kerala Green' }
  ],
  cochin: [
    { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', title: 'Fort Kochi Chinese Fishing Nets', attribution: 'Unsplash / Kochi Heritage' },
    { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', title: 'Kochi Backwaters', attribution: 'Unsplash / Kerala' }
  ],
  kochi: [
    { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', title: 'Fort Kochi Chinese Fishing Nets', attribution: 'Unsplash / Kochi Heritage' },
    { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', title: 'Kochi Backwaters', attribution: 'Unsplash / Kerala' }
  ],
  kerala: [
    { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', title: 'Kerala Tropical Waters', attribution: 'Unsplash / Kerala' },
    { url: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80', title: 'Munnar Plantations', attribution: 'Unsplash / Nature' }
  ],
  vagamon: [
    { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', title: 'Vagamon Pine Forest', attribution: 'Unsplash / Vagamon Hills' }
  ],
  bangkok: [
    { url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80', title: 'Wat Arun Bangkok', attribution: 'Unsplash / Thailand Travel' },
    { url: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=80', title: 'Grand Palace Bangkok', attribution: 'Unsplash / Siam' }
  ],
  pattaya: [
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', title: 'Pattaya Coral Island Beach', attribution: 'Unsplash / Tropical' },
    { url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80', title: 'Sanctuary of Truth Pattaya', attribution: 'Unsplash / Architecture' }
  ],
  dubai: [
    { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', title: 'Burj Khalifa Skyline', attribution: 'Unsplash / Dubai UAE' },
    { url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80', title: 'Dubai Desert Safari Dunes', attribution: 'Unsplash / Arabian Sands' }
  ],
  paris: [
    { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', title: 'Eiffel Tower Paris', attribution: 'Unsplash / Paris Romance' },
    { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80', title: 'Louvre Museum', attribution: 'Unsplash / France' }
  ],
  bali: [
    { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', title: 'Bali Temple & Rice Terraces', attribution: 'Unsplash / Indonesia' }
  ],
  swiss: [
    { url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', title: 'Swiss Alps Mountain Panorama', attribution: 'Unsplash / Switzerland' }
  ]
};

const DEFAULT_GENERIC_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', title: 'Global Adventure & Exploration', attribution: 'Unsplash / Adventure' },
  { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', title: 'Scenic Road Journey', attribution: 'Unsplash / Road Trip' },
  { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', title: 'Mountain Lake View', attribution: 'Unsplash / Nature' },
  { url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', title: 'Wanderlust Voyage', attribution: 'Unsplash / Traveler' }
];

export const clientImageService = {
  searchImages(query: string): ImageSearchResult[] {
    const qLower = query.toLowerCase().trim();
    const results: ImageSearchResult[] = [];

    let matched = false;
    for (const [key, images] of Object.entries(CURATED_DESTINATION_IMAGES)) {
      if (qLower.includes(key)) {
        matched = true;
        images.forEach((img, idx) => {
          results.push({
            id: `${key}-${idx}`,
            url: img.url,
            thumb_url: img.url.replace('w=1200', 'w=400'),
            title: img.title,
            attribution: img.attribution,
            source: 'Curated Destination Library'
          });
        });
      }
    }

    if (!matched) {
      DEFAULT_GENERIC_IMAGES.forEach((img, idx) => {
        results.push({
          id: `generic-${idx}`,
          url: img.url,
          thumb_url: img.url.replace('w=1200', 'w=400'),
          title: `${query ? query.charAt(0).toUpperCase() + query.slice(1) : 'Travel'} - ${img.title}`,
          attribution: img.attribution,
          source: 'Curated Destination Library'
        });
      });
    }

    return results;
  },

  uploadImage(file: File): Promise<{ url: string; storage_key: string }> {
    return new Promise((resolve, reject) => {
      const ext = file.name.toLowerCase().split('.').pop();
      if (!ext || !['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) {
        return reject(new Error(`Invalid image format '.${ext}'. Allowed formats: .jpg, .jpeg, .png, .webp, .svg`));
      }

      if (file.size > 15 * 1024 * 1024) {
        return reject(new Error('Image file exceeds maximum allowed size of 15MB.'));
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const storageKey = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
        resolve({
          url: dataUrl,
          storage_key: storageKey
        });
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file.'));
      };
      reader.readAsDataURL(file);
    });
  },

  validateImageUrl(url: string): Promise<{ valid: boolean; url: string }> {
    return new Promise((resolve, reject) => {
      const cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:image/')) {
        return reject(new Error('Image URL must start with http://, https:// or data:image/'));
      }

      if (cleanUrl.startsWith('data:image/')) {
        return resolve({ valid: true, url: cleanUrl });
      }

      const img = new Image();
      let timer: number;

      img.onload = () => {
        window.clearTimeout(timer);
        resolve({ valid: true, url: cleanUrl });
      };

      img.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error('Failed to load image from URL. Please check the link or try another image.'));
      };

      timer = window.setTimeout(() => {
        img.src = '';
        reject(new Error('Image load timed out. Please check your internet connection or the URL.'));
      }, 7000);

      img.src = cleanUrl;
    });
  }
};
