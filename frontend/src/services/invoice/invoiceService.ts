/**
 * Universal Invoice Generation & Download Service (Phase 26)
 * Generates Norwegian Tax (MVA) compliant invoices and receipts with instant PDF/Print capability.
 */

export interface InvoiceItem {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  taxRatePct: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  customerCountry: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  vatStandard: number; // 25% MVA
  vatReduced: number;  // 12% MVA (Lodging/Transport)
  totalAmount: number;
  paymentMethod: string;
  paymentGatewayRef?: string;
  bookingRef?: string;
  status: 'PAID' | 'REFUNDED' | 'PENDING';
}

const COMPANY_INFO = {
  name: 'Norway SmartLife AS',
  orgNumber: 'NO 984 123 456 MVA',
  address: 'Dronning Eufemias gate 16, 0191 Oslo, Norway',
  email: 'billing@smartlife.no',
  web: 'https://norway-smartlife.vercel.app',
};

export const invoiceService = {
  /**
   * Builds an InvoiceData model from a booking object
   */
  createInvoiceFromBooking(booking: any, userProfile?: any): InvoiceData {
    const isAccommodationOrTransport = ['ACCOMMODATION', 'TRANSPORT', 'FERRY', 'TRAIN'].includes(booking.item_type?.toUpperCase());
    const taxRate = isAccommodationOrTransport ? 12 : 25;
    const total = Number(booking.total_amount || 0);
    const subtotal = Math.round((total / (1 + taxRate / 100)) * 100) / 100;
    const taxAmount = Math.round((total - subtotal) * 100) / 100;

    const startDate = booking.start_time ? new Date(booking.start_time).toLocaleDateString('en-GB') : 'N/A';
    const endDate = booking.end_time ? new Date(booking.end_time).toLocaleDateString('en-GB') : '';
    const dateRange = endDate ? `${startDate} – ${endDate}` : startDate;

    const shortId = (booking.id || '').split('-')[0].toUpperCase();
    const invoiceNum = `INV-2026-${shortId || Math.floor(10000 + Math.random() * 90000)}`;

    return {
      invoiceNumber: invoiceNum,
      invoiceDate: new Date(booking.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: new Date(booking.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      customerName: userProfile?.fullName || booking.customer_name || 'Valued Traveler',
      customerEmail: userProfile?.email || booking.customer_email || 'customer@smartlife.no',
      customerCountry: userProfile?.country || 'Norway',
      currency: booking.currency || 'NOK',
      bookingRef: `BKG-${shortId}`,
      paymentMethod: 'Credit Card / Online Checkout',
      paymentGatewayRef: booking.payment_id || `RZP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: booking.status === 'CANCELLED' ? 'REFUNDED' : 'PAID',
      items: [
        {
          description: `${booking.item_type || 'Experience'} Reservation (${dateRange}) - ${booking.pax || 1} Guest(s)`,
          category: booking.item_type || 'Travel Experience',
          quantity: booking.pax || 1,
          unitPrice: Math.round((subtotal / (booking.pax || 1)) * 100) / 100,
          taxRatePct: taxRate,
          total: subtotal,
        }
      ],
      subtotal,
      vatStandard: taxRate === 25 ? taxAmount : 0,
      vatReduced: taxRate === 12 ? taxAmount : 0,
      totalAmount: total,
    };
  },

  /**
   * Generates clean, print-ready HTML for the invoice
   */
  generateInvoiceHTML(data: InvoiceData): string {
    const formattedTotal = `${data.currency} ${data.totalAmount.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`;
    const formattedSubtotal = `${data.currency} ${data.subtotal.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`;
    const formattedVatStandard = `${data.currency} ${data.vatStandard.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`;
    const formattedVatReduced = `${data.currency} ${data.vatReduced.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${data.invoiceNumber} — Norway SmartLife</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      padding: 40px;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 48px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0F172A;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      font-size: 20px;
      color: #0F172A;
      letter-spacing: -0.02em;
    }
    .logo-badge span {
      color: #00D084;
    }
    .company-details {
      font-size: 12px;
      color: #64748B;
      margin-top: 6px;
    }
    .invoice-title-block {
      text-align: right;
    }
    .invoice-title {
      font-size: 24px;
      font-weight: 800;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .invoice-number {
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      margin-top: 4px;
    }
    .status-badge {
      display: inline-block;
      margin-top: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: #DCFCE7;
      color: #15803D;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 36px;
    }
    .meta-block h4 {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      margin-bottom: 8px;
    }
    .meta-block p {
      font-size: 13px;
      color: #1E293B;
      font-weight: 500;
    }
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    table.items-table th {
      background: #F8FAFC;
      border-bottom: 1px solid #CBD5E1;
      padding: 12px 14px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #475569;
    }
    table.items-table td {
      padding: 14px;
      border-bottom: 1px solid #E2E8F0;
      font-size: 13px;
    }
    .text-right { text-align: right !important; }
    .text-center { text-align: center !important; }
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: start;
    }
    .payment-info {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 16px;
      font-size: 12px;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
    }
    .totals-table td {
      padding: 6px 0;
      font-size: 13px;
    }
    .totals-table tr.grand-total td {
      border-top: 2px solid #0F172A;
      padding-top: 10px;
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
    }
    .footer-note {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E2E8F0;
      text-align: center;
      font-size: 11px;
      color: #94A3B8;
    }
    @media print {
      body { padding: 0; background: #FFF; }
      .invoice-card { border: none; box-shadow: none; padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo-badge">
          🇳🇴 NORWAY <span>SMARTLIFE</span>
        </div>
        <div class="company-details">
          ${COMPANY_INFO.name}<br>
          Org. nr: ${COMPANY_INFO.orgNumber}<br>
          ${COMPANY_INFO.address}<br>
          ${COMPANY_INFO.email}
        </div>
      </div>
      <div class="invoice-title-block">
        <div class="invoice-title">Tax Invoice</div>
        <div class="invoice-number">${data.invoiceNumber}</div>
        <div class="status-badge">${data.status}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-block">
        <h4>Billed To</h4>
        <p><strong>${data.customerName}</strong></p>
        <p>${data.customerEmail}</p>
        <p>${data.customerCountry}</p>
        ${data.bookingRef ? `<p style="margin-top: 6px; color: #64748B;">Booking Ref: <strong>${data.bookingRef}</strong></p>` : ''}
      </div>
      <div class="meta-block" style="text-align: right;">
        <h4>Invoice Details</h4>
        <p>Invoice Date: <strong>${data.invoiceDate}</strong></p>
        <p>Payment Date: <strong>${data.dueDate}</strong></p>
        <p>Currency: <strong>${data.currency}</strong></p>
        ${data.paymentGatewayRef ? `<p style="color: #64748B; font-size: 11px;">Ref: ${data.paymentGatewayRef}</p>` : ''}
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-center">Qty</th>
          <th class="text-right">Unit Price</th>
          <th class="text-center">MVA %</th>
          <th class="text-right">Amount (${data.currency})</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>
              <strong>${item.description}</strong>
              <div style="font-size: 11px; color: #64748B;">${item.category}</div>
            </td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">${item.unitPrice.toLocaleString('no-NO', { minimumFractionDigits: 2 })}</td>
            <td class="text-center">${item.taxRatePct}%</td>
            <td class="text-right">${item.total.toLocaleString('no-NO', { minimumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="summary-grid">
      <div class="payment-info">
        <h4 style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #475569; margin-bottom: 6px;">Payment Summary</h4>
        <p>Method: <strong>${data.paymentMethod}</strong></p>
        <p>Status: <strong style="color: #16A34A;">Fully Paid & Settled</strong></p>
        <p style="margin-top: 6px; font-size: 11px; color: #64748B;">Thank you for exploring Norway sustainably with SmartLife.</p>
      </div>

      <div>
        <table class="totals-table">
          <tr>
            <td style="color: #64748B;">Subtotal (excl. MVA):</td>
            <td class="text-right">${formattedSubtotal}</td>
          </tr>
          ${data.vatReduced > 0 ? `
          <tr>
            <td style="color: #64748B;">MVA / VAT (12% Reduced):</td>
            <td class="text-right">${formattedVatReduced}</td>
          </tr>
          ` : ''}
          ${data.vatStandard > 0 ? `
          <tr>
            <td style="color: #64748B;">MVA / VAT (25% Standard):</td>
            <td class="text-right">${formattedVatStandard}</td>
          </tr>
          ` : ''}
          <tr class="grand-total">
            <td>Total Paid:</td>
            <td class="text-right">${formattedTotal}</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="footer-note">
      This is a computer-generated tax invoice issued under Norwegian Tax Administration (*Skatteetaten*) guidelines.<br>
      Norway SmartLife AS • www.smartlife.no • Oslo, Norway
    </div>
  </div>
  <script>
    window.onload = function() {
      // Auto-trigger print dialog if opened in a dedicated tab
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>
`;
  },

  /**
   * Opens the printable invoice in a new browser tab with automatic print dialog
   */
  openPrintableInvoice(invoiceData: InvoiceData): void {
    const htmlContent = this.generateInvoiceHTML(invoiceData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      // Fallback if popup blocked
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  },

  /**
   * Helper to download or print an invoice directly from a booking object
   */
  downloadInvoiceForBooking(booking: any, userProfile?: any): void {
    const invoice = this.createInvoiceFromBooking(booking, userProfile);
    this.openPrintableInvoice(invoice);
  }
};
