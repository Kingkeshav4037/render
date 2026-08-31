import { Trip, TripDay, TripActivity, TripStay, TripSegment, tripService } from './tripService';

export const tripExportService = {
  /**
   * Generates a printable HTML document for PDF generation / printing
   */
  generateItineraryHTML(data: {
    trip: Trip;
    days: TripDay[];
    userName?: string;
  }): string {
    const { trip, days, userName = 'Valued Traveler' } = data;
    const costSummary = tripService.calculateEstimatedTripCost(days, trip.budget_nok);

    const formattedStartDate = trip.start_date
      ? new Date(trip.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'TBD';
    const formattedEndDate = trip.end_date
      ? new Date(trip.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'TBD';

    const daysHTML = days
      .map(day => {
        const activitiesHTML = (day.activities || [])
          .map(
            (act: TripActivity) => `
            <div class="item activity">
              <div class="time-col">
                <span class="time">${act.start_time ? new Date(act.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'Flexible'}</span>
              </div>
              <div class="content-col">
                <div class="title">${act.activity_title}</div>
                <div class="category-badge">${act.activity_type || 'Activity'}</div>
                ${act.location?.name ? `<div class="location">📍 ${act.location.name}</div>` : ''}
                ${act.notes ? `<div class="notes">📝 ${act.notes}</div>` : ''}
                ${act.price_nok ? `<div class="price">NOK ${act.price_nok.toLocaleString()}</div>` : ''}
              </div>
            </div>
          `
          )
          .join('');

        const staysHTML = (day.stays || [])
          .map(
            (stay: TripStay) => `
            <div class="item stay">
              <div class="time-col">
                <span class="time">Overnight</span>
              </div>
              <div class="content-col">
                <div class="title">🏨 ${stay.accommodation_name}</div>
                ${stay.location?.name ? `<div class="location">📍 ${stay.location.name}</div>` : ''}
                ${stay.notes ? `<div class="notes">📝 ${stay.notes}</div>` : ''}
                ${stay.price_nok ? `<div class="price">NOK ${stay.price_nok.toLocaleString()} / night</div>` : ''}
              </div>
            </div>
          `
          )
          .join('');

        const segmentsHTML = (day.segments || [])
          .map(
            (seg: TripSegment) => `
            <div class="item segment">
              <div class="time-col">
                <span class="time">Transit</span>
              </div>
              <div class="content-col">
                <div class="title">🚗 ${seg.transport_mode}: ${seg.start_location?.name || 'Origin'} ➔ ${seg.end_location?.name || 'Destination'}</div>
                <div class="distance">Distance: ${seg.distance_km} km</div>
              </div>
            </div>
          `
          )
          .join('');

        return `
          <div class="day-card">
            <div class="day-header">
              <h3>Day ${day.day_number}: ${day.date ? new Date(day.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }) : `Day ${day.day_number}`}</h3>
              ${day.description ? `<p class="day-desc">${day.description}</p>` : ''}
            </div>
            <div class="day-body">
              ${activitiesHTML || '<p class="empty-text">No scheduled activities for this day.</p>'}
              ${segmentsHTML}
              ${staysHTML}
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${trip.title} — Itinerary | Norway SmartLife</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1a1a24;
            background: #ffffff;
            line-height: 1.5;
            padding: 20px;
          }
          .header {
            border-bottom: 2px solid #00205B;
            padding-bottom: 20px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .brand {
            font-size: 24px;
            font-weight: 800;
            color: #00205B;
            letter-spacing: -0.5px;
          }
          .brand span {
            color: #BA0C2F;
          }
          .trip-title {
            font-size: 28px;
            font-weight: 800;
            color: #00205B;
            margin-top: 10px;
          }
          .trip-meta {
            font-size: 14px;
            color: #555;
            margin-top: 5px;
          }
          .badge {
            display: inline-block;
            background: #f0f4f8;
            color: #00205B;
            font-size: 11px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
          }
          .day-card {
            background: #fafbfc;
            border: 1px solid #e1e4e8;
            border-radius: 8px;
            margin-bottom: 20px;
            page-break-inside: avoid;
            overflow: hidden;
          }
          .day-header {
            background: #00205B;
            color: #ffffff;
            padding: 12px 18px;
          }
          .day-header h3 {
            font-size: 16px;
            font-weight: 700;
          }
          .day-desc {
            font-size: 12px;
            opacity: 0.85;
            margin-top: 2px;
          }
          .day-body {
            padding: 15px;
          }
          .item {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px dashed #e1e4e8;
          }
          .item:last-child {
            border-bottom: none;
          }
          .time-col {
            width: 90px;
            font-size: 12px;
            font-weight: 700;
            color: #BA0C2F;
          }
          .content-col {
            flex: 1;
          }
          .title {
            font-size: 14px;
            font-weight: 700;
            color: #1a1a24;
          }
          .category-badge {
            display: inline-block;
            font-size: 10px;
            background: #e6f0fa;
            color: #004085;
            padding: 2px 6px;
            border-radius: 3px;
            margin-top: 3px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .location, .notes, .distance {
            font-size: 12px;
            color: #666;
            margin-top: 3px;
          }
          .price {
            font-size: 12px;
            font-weight: bold;
            color: #2e7d32;
            margin-top: 3px;
          }
          .empty-text {
            font-size: 12px;
            color: #888;
            font-style: italic;
          }
          .cost-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 15px 20px;
            margin-top: 30px;
            page-break-inside: avoid;
          }
          .cost-box h4 {
            font-size: 15px;
            color: #00205B;
            margin-bottom: 10px;
          }
          .cost-row {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            padding: 4px 0;
            color: #475569;
          }
          .cost-row.total {
            font-weight: 800;
            font-size: 15px;
            color: #00205B;
            border-top: 2px solid #cbd5e1;
            margin-top: 6px;
            padding-top: 6px;
          }
          .footer {
            margin-top: 30px;
            border-top: 1px solid #e1e4e8;
            padding-top: 15px;
            font-size: 11px;
            color: #777;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Norway <span>SmartLife</span> 🇳🇴</div>
            <h1 class="trip-title">${trip.title}</h1>
            <div class="trip-meta">
              <strong>Dates:</strong> ${formattedStartDate} – ${formattedEndDate} &nbsp;|&nbsp; 
              <strong>Traveler:</strong> ${userName} &nbsp;|&nbsp; 
              <strong>Status:</strong> ${trip.status || 'PLANNED'}
            </div>
            ${trip.notes ? `<p class="notes" style="margin-top: 8px; font-style: italic;">"${trip.notes}"</p>` : ''}
          </div>
          <div style="text-align: right;">
            <div class="badge">Personalized Itinerary</div>
            <div style="font-size: 11px; color: #888; margin-top: 5px;">Exported: ${new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        <div class="itinerary-content">
          ${daysHTML}
        </div>

        <div class="cost-box">
          <h4>Estimated Trip Budget Breakdown</h4>
          <div class="cost-row">
            <span>Accommodations & Cabins</span>
            <span>NOK ${costSummary.accommodation_total_nok.toLocaleString()}</span>
          </div>
          <div class="cost-row">
            <span>Experiences & Activities</span>
            <span>NOK ${costSummary.activities_total_nok.toLocaleString()}</span>
          </div>
          <div class="cost-row">
            <span>Transit & Ferries</span>
            <span>NOK ${costSummary.transport_total_nok.toLocaleString()}</span>
          </div>
          <div class="cost-row">
            <span>Dining & Culinary Estimate</span>
            <span>NOK ${costSummary.food_estimate_nok.toLocaleString()}</span>
          </div>
          <div class="cost-row total">
            <span>Total Estimated Cost</span>
            <span>NOK ${costSummary.grand_total_nok.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          <div>Emergency: 112 (Police) / 113 (Ambulance) / 120 (Sea Rescue)</div>
          <div>Generated by Norway SmartLife AS · https://norway-smartlife.vercel.app</div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * Trigger browser print or save-as-PDF dialogue
   */
  exportToPDF(data: { trip: Trip; days: TripDay[]; userName?: string }): void {
    const html = this.generateItineraryHTML(data);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download or print your itinerary.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // Trigger print after rendering
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  },

  /**
   * Generate RFC 5545 iCalendar (.ics) export file
   */
  generateICalendar(data: { trip: Trip; days: TripDay[] }): string {
    const { trip, days } = data;
    const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let icsEvents: string[] = [];

    days.forEach(day => {
      // Activities
      (day.activities || []).forEach(act => {
        const start = act.start_time
          ? new Date(act.start_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
          : `${day.date.replace(/-/g, '')}T090000Z`;
        const end = act.end_time
          ? new Date(act.end_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
          : `${day.date.replace(/-/g, '')}T110000Z`;

        icsEvents.push(`BEGIN:VEVENT
UID:${act.id || Math.random().toString(36).substring(2)}@smartlife.no
DTSTAMP:${nowStamp}
DTSTART:${start}
DTEND:${end}
SUMMARY:${act.activity_title}
DESCRIPTION:${act.notes || 'Activity in Norway SmartLife Itinerary'}
LOCATION:${act.location?.name || 'Norway'}
STATUS:CONFIRMED
END:VEVENT`);
      });

      // Stays
      (day.stays || []).forEach(stay => {
        const checkIn = stay.check_in
          ? `${stay.check_in.replace(/-/g, '')}T150000Z`
          : `${day.date.replace(/-/g, '')}T150000Z`;
        const checkOut = stay.check_out
          ? `${stay.check_out.replace(/-/g, '')}T110000Z`
          : `${day.date.replace(/-/g, '')}T110000Z`;

        icsEvents.push(`BEGIN:VEVENT
UID:${stay.id || Math.random().toString(36).substring(2)}@smartlife.no
DTSTAMP:${nowStamp}
DTSTART:${checkIn}
DTEND:${checkOut}
SUMMARY:Stay at ${stay.accommodation_name}
LOCATION:${stay.location?.name || 'Norway'}
STATUS:CONFIRMED
END:VEVENT`);
      });
    });

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Norway SmartLife//Trip Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${trip.title}
X-WR-TIMEZONE:Europe/Oslo
${icsEvents.join('\n')}
END:VCALENDAR`;
  },

  /**
   * Download iCalendar file (.ics)
   */
  exportToCalendar(data: { trip: Trip; days: TripDay[] }): void {
    const icsContent = this.generateICalendar(data);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${data.trip.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Itinerary.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Export structured JSON
   */
  exportToJSON(data: { trip: Trip; days: TripDay[] }): void {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${data.trip.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Plan.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
