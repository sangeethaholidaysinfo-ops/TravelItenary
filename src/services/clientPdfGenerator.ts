import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Itinerary, Agency } from '../types/itinerary';

function sanitizeFilename(name: string): string {
  return (name || 'Itinerary')
    .replace(/[\\/*?:"<>| ]/g, '_')
    .replace(/_+/g, '_')
    .trim();
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateItineraryHtmlString(itinerary: Itinerary, agency: Agency): string {
  const isEditorial = (itinerary.theme || 'editorial') === 'editorial';
  const brandColor = agency.brand_colour || '#0284c7';
  const accentColor = isEditorial ? '#c29d59' : brandColor;

  // Day cards
  const daysHtml = itinerary.days.map((d) => {
    const itemsHtml = d.items.map((it) => {
      let badgeBg = '#f1f5f9';
      let badgeColor = '#334155';
      let badgeBorder = '#cbd5e1';
      let iconLabel = 'Sightseeing';

      if (it.item_type === 'accommodation') {
        badgeBg = '#fef3c7';
        badgeColor = '#92400e';
        badgeBorder = '#fde68a';
        iconLabel = 'Accommodation';
      } else if (it.item_type === 'transfer') {
        badgeBg = '#dbeafe';
        badgeColor = '#1e40af';
        badgeBorder = '#bfdbfe';
        iconLabel = 'Transfer';
      } else if (it.item_type === 'meal') {
        badgeBg = '#d1fae5';
        badgeColor = '#065f46';
        badgeBorder = '#a7f3d0';
        iconLabel = 'Meal Plan';
      } else if (it.item_type === 'arrival') {
        badgeBg = '#f3e8ff';
        badgeColor = '#6b21a8';
        badgeBorder = '#e9d5ff';
        iconLabel = 'Arrival';
      } else if (it.item_type === 'departure') {
        badgeBg = '#ffe4e6';
        badgeColor = '#9f1239';
        badgeBorder = '#fecdd3';
        iconLabel = 'Departure';
      } else if (it.item_type === 'custom_note') {
        badgeBg = '#ffedd5';
        badgeColor = '#9a3412';
        badgeBorder = '#fed7aa';
        iconLabel = 'Important Note';
      }

      const timeBadge = it.time_text
        ? `<span style="font-size: 11px; font-weight: 600; color: #64748b; margin-left: auto;">${it.time_text}</span>`
        : '';
      const locBadge = it.location
        ? `<span style="font-size: 11px; color: #64748b; font-style: italic; margin-left: 6px;">📍 ${it.location}</span>`
        : '';
      const internalNote =
        itinerary.show_internal_notes_in_pdf && it.internal_note
          ? `<div style="margin-top: 4px; font-size: 11px; color: #9a3412; background: #fff7ed; padding: 4px 8px; border-radius: 4px; border: 1px solid #fed7aa;">Internal Note: ${it.internal_note}</div>`
          : '';

      return `
        <div style="padding: 10px 12px; margin-bottom: 8px; border-radius: 6px; background: #f8fafc; border: 1px solid #e2e8f0; page-break-inside: avoid;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
              <span style="display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; border-radius: 4px; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">${iconLabel}</span>
              <span style="font-weight: 700; color: #0f172a; font-size: 12px;">${it.title}</span>
              ${locBadge}
            </div>
            ${timeBadge}
          </div>
          ${it.description ? `<p style="font-size: 11px; color: #475569; margin: 4px 0 0 0; line-height: 1.5;">${it.description}</p>` : ''}
          ${internalNote}
        </div>
      `;
    }).join('');

    const heroImgHtml = d.hero_image_url
      ? `
        <div style="width: 100%; height: 180px; overflow: hidden; background: #e2e8f0; position: relative;">
          <img crossorigin="anonymous" src="${d.hero_image_url}" alt="${d.title}" style="width: 100%; height: 100%; object-fit: ${d.hero_image_fit || 'cover'}; object-position: ${d.hero_image_focal_x || 50}% ${d.hero_image_focal_y || 50}%; display: block;" onerror="this.parentElement.style.display='none'" />
          ${d.hero_image_caption || d.hero_image_attribution ? `<div style="position: absolute; bottom: 6px; right: 8px; font-size: 9px; color: white; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">${d.hero_image_caption || d.hero_image_attribution}</div>` : ''}
        </div>
      `
      : '';

    const dateBadge = d.date
      ? `<span style="font-size: 11px; font-weight: 500; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; margin-left: 8px;">${d.date}</span>`
      : '';
    const destTag = d.destination
      ? `<span style="font-size: 11px; font-weight: 700; color: #047857; background: #ecfdf5; padding: 2px 8px; border-radius: 4px; border: 1px solid #a7f3d0;">📍 ${d.destination}</span>`
      : '';

    return `
      <div style="margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); page-break-inside: avoid;">
        ${heroImgHtml}
        <div style="padding: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
              <span style="padding: 3px 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; border-radius: 4px; background: ${accentColor}18; color: ${accentColor}; border: 1px solid ${accentColor}50;">Day ${d.day_number}</span>
              <span style="font-size: 15px; font-weight: 700; color: #0f172a; ${isEditorial ? 'font-family: Georgia, serif;' : 'font-family: system-ui, sans-serif;'}">${d.title}</span>
              ${dateBadge}
            </div>
            ${destTag}
          </div>
          ${d.description ? `<p style="font-size: 12px; color: #334155; margin: 0 0 12px 0; line-height: 1.6; white-space: pre-line;">${d.description}</p>` : ''}
          ${itemsHtml ? `<div style="margin-top: 10px; border-top: 1px solid #f1f5f9; padding-top: 10px;">${itemsHtml}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Sections
  const sectionsHtml = itinerary.sections
    .filter((sec) => sec.visible_in_pdf && sec.content)
    .map((sec) => {
      const formatted = sec.content
        .split('\n')
        .filter((l) => l.trim())
        .map((l) => {
          if (l.trim().startsWith('•') || l.trim().startsWith('-')) {
            return `<div style="margin-bottom: 4px; display: flex; align-items: flex-start;"><span style="color: #94a3b8; margin-right: 6px;">•</span><span>${l.replace(/^[-• ]+/, '')}</span></div>`;
          }
          return `<p style="margin: 0 0 4px 0;">${l}</p>`;
        })
        .join('');

      return `
        <div style="margin-bottom: 12px; padding: 14px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; page-break-inside: avoid;">
          <h4 style="font-size: 12px; font-weight: 800; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em; color: ${brandColor}; ${isEditorial ? 'font-family: Georgia, serif;' : 'font-family: system-ui, sans-serif;'}">${sec.title}</h4>
          <div style="font-size: 11px; color: #334155; line-height: 1.6;">${formatted}</div>
        </div>
      `;
    })
    .join('');

  const phoneList = agency.phones && agency.phones.length > 0
    ? agency.phones
    : agency.phone
    ? agency.phone.split(/[\/,•|]+/).map((p) => p.trim()).filter(Boolean)
    : [];
  const phoneDisplay = phoneList.length > 0 ? phoneList.join(' / ') : agency.phone || '';

  const phoneHtml = phoneDisplay
    ? `<span style="display: inline-flex; align-items: center; gap: 4px; color: #0f172a; font-weight: 700;"><span>📞</span><span>${phoneDisplay}</span></span>`
    : '';

  const emailHtml = agency.email
    ? `<span style="display: inline-flex; align-items: center; gap: 4px; color: #334155;"><span>✉️</span><span>${agency.email}</span></span>`
    : '';

  const websiteHtml = agency.website
    ? `<span style="display: inline-flex; align-items: center; gap: 4px; color: ${brandColor}; font-weight: 700;"><span>🌐</span><span>${agency.website}</span></span>`
    : '';

  const contactItems = [phoneHtml, emailHtml, websiteHtml].filter(Boolean);
  const contactRowHtml = contactItems.join('<span style="color: #cbd5e1; margin: 0 4px;">•</span>');

  let brandingHtml = '';
  if (agency.logo_url) {
    brandingHtml = `
      <div style="display: flex; align-items: center; gap: 16px;">
        <img crossorigin="anonymous" src="${agency.logo_url}" alt="${agency.name}" style="max-height: 60px; max-width: 190px; height: auto; object-fit: contain; display: block;" onerror="this.style.display='none'" />
        <div>
          <div style="font-weight: 800; font-size: 19px; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2;">${agency.name}</div>
          <div style="margin-top: 5px; font-size: 11.5px; color: #334155; line-height: 1.4; display: flex; flex-wrap: wrap; align-items: center; gap: 4px;">
            ${contactRowHtml}
          </div>
        </div>
      </div>
    `;
  } else {
    brandingHtml = `
      <div>
        <div style="font-weight: 800; font-size: 22px; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2;">${agency.name}</div>
        <div style="margin-top: 5px; font-size: 11.5px; color: #334155; line-height: 1.4; display: flex; flex-wrap: wrap; align-items: center; gap: 4px;">
          ${contactRowHtml}
        </div>
      </div>
    `;
  }

  const custHtml =
    itinerary.customer_name && itinerary.show_customer_name_in_pdf
      ? `<div style="font-size: 11.5px; color: #475569; margin-top: 5px;">Prepared for: <strong style="color: #0f172a; font-size: 13px;">${itinerary.customer_name}</strong></div>`
      : '';

  return `
    <div style="width: 794px; background: #ffffff; color: #0f172a; padding: 32px 36px; font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box; margin: 0 auto; line-height: 1.5; font-size: 12px;">
      <!-- Header -->
      <header style="border-bottom: 2px solid ${brandColor}25; padding-bottom: 16px; margin-bottom: 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <div style="flex: 1;">
          ${brandingHtml}
        </div>
        <div style="text-align: right; shrink-0;">
          <span style="display: inline-block; padding: 6px 14px; font-size: 12px; font-weight: 800; text-transform: uppercase; border-radius: 6px; background: ${brandColor}18; color: ${brandColor}; border: 1px solid ${brandColor}40; letter-spacing: 0.05em;">
            ${itinerary.days_count} Days / ${itinerary.nights_count} Nights
          </span>
          ${custHtml}
        </div>
      </header>

      <!-- Cover Banner -->
      <div style="margin-bottom: 20px; border-radius: 10px; overflow: hidden; background: #0f172a; color: white; position: relative; min-height: 160px; page-break-inside: avoid;">
        ${
          itinerary.cover_image_url
            ? `<img crossorigin="anonymous" src="${itinerary.cover_image_url}" style="width: 100%; height: 200px; object-fit: cover; opacity: 0.55; display: block;" onerror="this.style.display='none'" />`
            : '<div style="width: 100%; height: 100px; background: #1e293b;"></div>'
        }
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.3), transparent); padding: 20px; display: flex; flex-direction: column; justify-content: flex-end;">
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #fbbf24; margin-bottom: 4px;">${itinerary.destination_summary || 'Featured Journey'}</span>
          <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0; ${isEditorial ? 'font-family: Georgia, serif;' : 'font-family: system-ui, sans-serif;'}">${itinerary.title}</h1>
          ${itinerary.subtitle ? `<p style="font-size: 12px; color: #e2e8f0; margin: 4px 0 0 0;">${itinerary.subtitle}</p>` : ''}
        </div>
      </div>

      <!-- Notes -->
      ${
        itinerary.notes
          ? `
          <div style="margin-bottom: 20px; padding: 14px; border-radius: 8px; background: #fffbeb; border: 1px solid #fef3c7; color: #78350f; font-size: 12px; line-height: 1.6; page-break-inside: avoid;">
            <h4 style="font-weight: 800; text-transform: uppercase; font-size: 10px; color: #92400e; margin: 0 0 4px 0;">Trip Overview & Highlights</h4>
            ${itinerary.notes}
          </div>
          `
          : ''
      }

      <!-- Day by Day Itinerary -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #0f172a; margin: 0 0 14px 0; padding-bottom: 6px; border-bottom: 2px solid ${brandColor};">
          Day-by-Day Journey
        </h2>
        ${daysHtml}
      </div>

      <!-- Sections -->
      ${
        sectionsHtml
          ? `
          <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #e2e8f0; page-break-inside: avoid;">
            <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #0f172a; margin: 0 0 14px 0; padding-bottom: 6px; border-bottom: 2px solid ${brandColor};">
              Trip Details, Inclusions & Policies
            </h2>
            <div>${sectionsHtml}</div>
          </div>
          `
          : ''
      }

      <!-- Footer -->
      <footer style="margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10.5px; color: #64748b; page-break-inside: avoid;">
        <p style="font-weight: 700; color: #0f172a; margin: 0; font-size: 11.5px;">${agency.name} — Professional Travel Proposal</p>
        <p style="margin: 4px 0 0 0; color: #334155; font-size: 10.5px;">${[phoneDisplay ? `📞 ${phoneDisplay}` : '', agency.email ? `✉️ ${agency.email}` : '', agency.website ? `🌐 ${agency.website}` : ''].filter(Boolean).join(' &nbsp;•&nbsp; ')}</p>
        ${agency.footer_disclaimer ? `<p style="margin: 6px 0 0 0; font-size: 9.5px; color: #64748b; line-height: 1.4;">${agency.footer_disclaimer}</p>` : ''}
      </footer>
    </div>
  `;
}

export async function exportItineraryToPdfClient(
  itinerary: Itinerary,
  agency: Agency
): Promise<{ download_url: string; filename: string }> {
  const dateStr = formatDate(new Date());
  const sanitizedTitle = sanitizeFilename(itinerary.title);
  const filename = `${sanitizedTitle}_Itinerary_${dateStr}.pdf`;

  // Create isolated iframe to prevent html2canvas from inheriting Tailwind v4's oklch variables
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-99999px';
  iframe.style.left = '-99999px';
  iframe.style.width = '794px';
  iframe.style.height = '1123px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-9999';
  iframe.setAttribute('title', 'PDF Generator Sandbox');

  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!iframeDoc) {
      throw new Error('Unable to create PDF sandbox document in browser.');
    }

    // Write completely self-contained HTML into isolated iframe
    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      background-color: #ffffff !important;
      color: #0f172a !important;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 794px;
    }
  </style>
</head>
<body>
  ${generateItineraryHtmlString(itinerary, agency)}
</body>
</html>`);
    iframeDoc.close();

    // Wait for images and layout inside the iframe to settle
    await new Promise((resolve) => setTimeout(resolve, 500));

    const renderElement = iframeDoc.body;

    // Render using html2canvas in the isolated iframe window context
    const canvas = await html2canvas(renderElement, {
      scale: 2, // High DPI resolution (crisp text and images)
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 794,
      onclone: (clonedDoc: Document) => {
        // Remove any leaked stylesheets that might contain unsupported modern color functions
        const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach((tag) => {
          try {
            if (tag.textContent && tag.textContent.includes('oklch')) {
              tag.remove();
            }
          } catch {
            // Ignore
          }
        });
      },
    });

    // Create jsPDF in standard A4 format (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdfWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;

    // Additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Trigger direct download
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      download_url: blobUrl,
      filename,
    };
  } finally {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}
