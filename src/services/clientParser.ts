import { Itinerary, ItineraryDay, DayItem, ItinerarySection, ParseWarning, ParseResponse } from '../types/itinerary';

// Day header detection patterns
const DAY_HEADER_PATTERNS = [
  /^(?:day|day\s*[-–—:]\s*|\bday\b)\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|twenty-one)(?:\s*[-–—:]|\s+)(.*)$/i,
  /^day\s*(\d+)\s*$/i,
  /^(?:day\s*)?(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\s+\d{2,4})?)\s*[-–—:]\s*(.*)$/i,
];

const WORD_TO_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, 'twenty-one': 21
};

export function parseDayNumber(raw: string): number {
  const clean = raw.trim().toLowerCase();
  if (/^\d+$/.test(clean)) {
    return parseInt(clean, 10);
  }
  return WORD_TO_NUM[clean] || 1;
}

export function isDayHeader(line: string): [boolean, number, string] {
  const lineClean = line.trim();
  if (!lineClean) return [false, 0, ''];

  for (const pattern of DAY_HEADER_PATTERNS) {
    const match = lineClean.match(pattern);
    if (match) {
      const dayNum = parseDayNumber(match[1]);
      const title = (match[2] || '').trim();
      return [true, dayNum, title];
    }
  }

  const mAlt = lineClean.match(/^DAY\s*[-_]?\s*0*(\d+)\s*[:\-–—]\s*(.*)$/i);
  if (mAlt) {
    return [true, parseInt(mAlt[1], 10), (mAlt[2] || '').trim()];
  }

  return [false, 0, ''];
}

export function extractDuration(text: string): [number | null, number | null] {
  const match = text.match(/(\d+)\s*(?:days?|d)\s*(?:[/&,–—\s]|and)+\s*(\d+)\s*(?:nights?|n)/i);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10)];
  }

  const matchDays = text.match(/(\d+)\s*(?:days?|d)\b/i);
  if (matchDays) {
    const days = parseInt(matchDays[1], 10);
    return [days, Math.max(0, days - 1)];
  }

  const matchNights = text.match(/(\d+)\s*(?:nights?|n)\b/i);
  if (matchNights) {
    const nights = parseInt(matchNights[1], 10);
    return [nights + 1, nights];
  }

  return [null, null];
}

const DEST_IMG_KEYWORDS: Record<string, string> = {
  munnar: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
  thekkady: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
  cochin: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
  kochi: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  vagamon: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  pattaya: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  swiss: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
};

export function parseItineraryTextClient(rawText: string): ParseResponse {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n');
  const warnings: ParseWarning[] = [];

  let title = 'Proposed Itinerary';
  let subtitle = '';
  const [declaredDays, declaredNights] = extractDuration(rawText);

  // Check if first non-empty line is title
  let firstNonEmptyIdx = -1;
  for (let idx = 0; idx < lines.length; idx++) {
    if (lines[idx].trim()) {
      firstNonEmptyIdx = idx;
      break;
    }
  }

  if (firstNonEmptyIdx !== -1) {
    const firstLine = lines[firstNonEmptyIdx].trim();
    const [isDay] = isDayHeader(firstLine);
    const lower = firstLine.toLowerCase();
    if (!isDay && !lower.startsWith('hotel:') && !lower.startsWith('meals:') && !lower.startsWith('inclusions:') && !lower.startsWith('exclusions:') && !lower.startsWith('notes:')) {
      if (firstLine.includes('–') || firstLine.includes('-') || firstLine.includes('—') || firstLine.includes('|')) {
        const parts = firstLine.split(/[-–—|]/);
        title = parts[0].trim();
        subtitle = parts.slice(1).join('-').trim();
      } else {
        title = firstLine;
      }
    }
  }

  const generalNotes: string[] = [];
  const inclusionsLines: string[] = [];
  const exclusionsLines: string[] = [];
  const termsLines: string[] = [];
  const unassignedLines: string[] = [];

  let currentSection = 'intro';

  interface RawDayData {
    day_number: number;
    title: string;
    destination: string;
    desc_lines: string[];
    hotels: string[];
    meals: string[];
    transfers: string[];
    activities: string[];
    custom_notes: string[];
  }

  const daysData: RawDayData[] = [];
  let currentDay: RawDayData | null = null;

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const cleanLine = lines[lineNum].trim();
    if (!cleanLine) continue;

    const lowerLine = cleanLine.toLowerCase();

    // Section headers
    if (lowerLine.startsWith('inclusions:') || lowerLine.startsWith('included:') || lowerLine.startsWith('package inclusions:')) {
      currentSection = 'inclusions';
      const content = cleanLine.split(':', 2)[1]?.trim();
      if (content) inclusionsLines.push(content);
      continue;
    } else if (lowerLine.startsWith('exclusions:') || lowerLine.startsWith('excluded:') || lowerLine.startsWith('not included:') || lowerLine.startsWith('package exclusions:')) {
      currentSection = 'exclusions';
      const content = cleanLine.split(':', 2)[1]?.trim();
      if (content) exclusionsLines.push(content);
      continue;
    } else if (lowerLine.startsWith('cancellation policy:') || lowerLine.startsWith('terms and conditions:') || lowerLine.startsWith('terms & conditions:') || lowerLine.startsWith('terms:')) {
      currentSection = 'terms';
      const content = cleanLine.split(':', 2)[1]?.trim();
      if (content) termsLines.push(content);
      continue;
    } else if (lowerLine.startsWith('important notes:') || lowerLine.startsWith('notes:') || lowerLine.startsWith('general notes:')) {
      if (currentDay === null) {
        currentSection = 'notes';
        const content = cleanLine.split(':', 2)[1]?.trim();
        if (content) generalNotes.push(content);
        continue;
      } else {
        const noteContent = cleanLine.split(':', 2)[1]?.trim();
        if (noteContent) currentDay.custom_notes.push(noteContent);
        continue;
      }
    }

    // Check if line is day header
    const [isDay, dayNum, dayTitle] = isDayHeader(cleanLine);
    if (isDay) {
      currentSection = 'day';
      if (currentDay) {
        daysData.push(currentDay);
      }

      // Infer destination
      let destination = '';
      const destMatches = [...dayTitle.matchAll(/(?:to|in|at|towards)\s+([A-Z][a-zA-Z\s]+?)(?:via|\.|\-|\,|$)/g)];
      if (destMatches.length > 0) {
        destination = destMatches[destMatches.length - 1][1].trim();
      } else if (dayTitle) {
        destination = dayTitle.split(/[-–]/)[0].trim();
      }

      currentDay = {
        day_number: dayNum > 0 ? dayNum : daysData.length + 1,
        title: dayTitle || `Day ${dayNum}`,
        destination,
        desc_lines: [],
        hotels: [],
        meals: [],
        transfers: [],
        activities: [],
        custom_notes: []
      };
      continue;
    }

    // Inside a day section
    if (currentSection === 'day' && currentDay !== null) {
      if (lowerLine.startsWith('hotel:') || lowerLine.startsWith('stay:') || lowerLine.startsWith('resort:') || lowerLine.startsWith('accommodation:')) {
        currentDay.hotels.push(cleanLine.split(':', 2)[1]?.trim() || '');
      } else if (lowerLine.startsWith('meals:') || lowerLine.startsWith('meal plan:') || lowerLine.startsWith('meal:')) {
        currentDay.meals.push(cleanLine.split(':', 2)[1]?.trim() || '');
      } else if (lowerLine.startsWith('transfer:') || lowerLine.startsWith('travel:') || lowerLine.startsWith('route:')) {
        currentDay.transfers.push(cleanLine.split(':', 2)[1]?.trim() || '');
      } else if (lowerLine.startsWith('activity:') || lowerLine.startsWith('activities:') || lowerLine.startsWith('sightseeing:')) {
        currentDay.activities.push(cleanLine.split(':', 2)[1]?.trim() || '');
      } else if (lowerLine.startsWith('notes:') || lowerLine.startsWith('note:')) {
        currentDay.custom_notes.push(cleanLine.split(':', 2)[1]?.trim() || '');
      } else {
        currentDay.desc_lines.push(cleanLine);
      }
      continue;
    }

    // Global sections
    if (currentSection === 'inclusions') {
      inclusionsLines.push(cleanLine.replace(/^[-•* ]+/, ''));
    } else if (currentSection === 'exclusions') {
      exclusionsLines.push(cleanLine.replace(/^[-•* ]+/, ''));
    } else if (currentSection === 'terms') {
      termsLines.push(cleanLine.replace(/^[-•* ]+/, ''));
    } else if (currentSection === 'notes') {
      generalNotes.push(cleanLine.replace(/^[-•* ]+/, ''));
    } else if (currentSection === 'intro') {
      if (lineNum > 0) {
        unassignedLines.push(cleanLine);
      }
    }
  }

  if (currentDay) {
    daysData.push(currentDay);
  }

  // Convert to ItineraryDay objects
  const itineraryDays: ItineraryDay[] = [];

  for (let pos = 0; pos < daysData.length; pos++) {
    const d = daysData[pos];
    const dayItems: DayItem[] = [];
    let itemPos = 0;

    for (const t of d.transfers) {
      dayItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        position: itemPos++,
        item_type: 'transfer',
        title: 'Transfer & Transit',
        description: t
      });
    }

    for (const h of d.hotels) {
      dayItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        position: itemPos++,
        item_type: 'accommodation',
        title: 'Accommodation',
        description: h
      });
    }

    for (const m of d.meals) {
      dayItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        position: itemPos++,
        item_type: 'meal',
        title: 'Meal Plan',
        description: m
      });
    }

    for (const a of d.activities) {
      dayItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        position: itemPos++,
        item_type: 'sightseeing',
        title: 'Sightseeing / Activity',
        description: a
      });
    }

    for (const n of d.custom_notes) {
      dayItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        position: itemPos++,
        item_type: 'custom_note',
        title: 'Important Note',
        description: n
      });
    }

    // Hero image suggestion
    let heroImg: string | null = null;
    const destLower = `${d.destination} ${d.title}`.toLowerCase();
    for (const [k, imgUrl] of Object.entries(DEST_IMG_KEYWORDS)) {
      if (destLower.includes(k)) {
        heroImg = imgUrl;
        break;
      }
    }
    if (!heroImg) {
      heroImg = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
    }

    itineraryDays.push({
      id: `day-${Date.now()}-${pos}`,
      position: pos,
      day_number: d.day_number,
      title: d.title || `Day ${pos + 1}`,
      destination: d.destination,
      description: d.desc_lines.join('\n'),
      hero_image_url: heroImg,
      items: dayItems
    });
  }

  // Sections
  const sections: ItinerarySection[] = [];
  let secPos = 0;
  if (inclusionsLines.length > 0) {
    sections.push({
      id: `sec-${Date.now()}-${secPos}`,
      position: secPos++,
      section_type: 'inclusions',
      title: 'Inclusions',
      content: inclusionsLines.map(l => `• ${l}`).join('\n'),
      visible_in_pdf: true
    });
  }

  if (exclusionsLines.length > 0) {
    sections.push({
      id: `sec-${Date.now()}-${secPos}`,
      position: secPos++,
      section_type: 'exclusions',
      title: 'Exclusions',
      content: exclusionsLines.map(l => `• ${l}`).join('\n'),
      visible_in_pdf: true
    });
  }

  if (generalNotes.length > 0) {
    sections.push({
      id: `sec-${Date.now()}-${secPos}`,
      position: secPos++,
      section_type: 'important_notes',
      title: 'Important Notes',
      content: generalNotes.join('\n'),
      visible_in_pdf: true
    });
  }

  if (termsLines.length > 0) {
    sections.push({
      id: `sec-${Date.now()}-${secPos}`,
      position: secPos++,
      section_type: 'terms_and_conditions',
      title: 'Terms & Policies',
      content: termsLines.join('\n'),
      visible_in_pdf: true
    });
  }

  // Total days calculation
  let actualDaysCount = itineraryDays.length;
  if (actualDaysCount === 0) {
    const unassignedFull = unassignedLines.length > 0 ? unassignedLines.join('\n') : rawText;
    warnings.push({
      code: 'NO_DAYS_FOUND',
      message: "No day labels (e.g., 'Day 1:') were detected in the source text. Content has been preserved in unassigned notes so nothing is lost.",
      raw_text: unassignedFull
    });
    itineraryDays.push({
      id: `day-${Date.now()}-0`,
      position: 0,
      day_number: 1,
      title: 'Overview & Day Plan',
      destination: '',
      description: unassignedFull,
      hero_image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      items: []
    });
    actualDaysCount = 1;
  }

  const daysCount = declaredDays !== null ? declaredDays : actualDaysCount;
  const nightsCount = declaredNights !== null ? declaredNights : Math.max(0, daysCount - 1);

  if (declaredDays !== null && declaredDays !== actualDaysCount) {
    warnings.push({
      code: 'DURATION_MISMATCH',
      message: `Text declares ${declaredDays} Days / ${declaredNights ?? Math.max(0, declaredDays - 1)} Nights, but ${actualDaysCount} day heading(s) were found. All days have been preserved.`
    });
  }

  const coverImage = itineraryDays[0]?.hero_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';

  const destList = itineraryDays.map(d => d.destination).filter(Boolean);
  const uniqueDests = Array.from(new Set(destList));
  const destSummary = uniqueDests.length > 0 ? uniqueDests.join(' → ') : 'Custom Journey';

  const itinerary: Itinerary = {
    id: `itin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    agency_id: 'default_agency',
    created_by: 'agent',
    title,
    subtitle,
    destination_summary: destSummary,
    days_count: daysCount,
    nights_count: nightsCount,
    show_customer_name_in_pdf: true,
    show_internal_notes_in_pdf: false,
    status: 'draft',
    theme: 'editorial',
    cover_image_url: coverImage,
    source_text: rawText,
    days: itineraryDays,
    sections,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const unassignedStr = unassignedLines.length > 0 ? unassignedLines.join('\n') : null;

  return {
    itinerary,
    warnings,
    unassigned_text: unassignedStr
  };
}
