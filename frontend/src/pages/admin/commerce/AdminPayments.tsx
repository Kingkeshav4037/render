import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Download, ArrowUpRight, Search, Filter, Printer, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { invoiceService, InvoiceData } from '../../../services/invoice/invoiceService';

const FALLBACK_PAYMENTS: InvoiceData[] = [
  {
    invoiceNumber: 'NSL-2026-8201',
    invoiceDate: '23 Aug 2026',
    dueDate: '23 Aug 2026',
    customerName: 'Astrid Lindgren',
    customerEmail: 'astrid@example.com',
    customerCountry: 'Norway',
    currency: 'NOK',
    bookingRef: 'BKG-8201',
    paymentMethod: 'Razorpay / Card',
    paymentGatewayRef: 'pay_Nz8201A',
    status: 'PAID',
    subtotal: 3600,
    vatStandard: 900,
    vatReduced: 0,
    totalAmount: 4500,
    items: [
      { description: 'Fjord Safari Experience & Guide', category: 'ACTIVITY', quantity: 2, unitPrice: 1800, taxRatePct: 25, total: 3600 }
    ]
  },
  {
    invoiceNumber: 'NSL-2026-8200',
    invoiceDate: '22 Aug 2026',
    dueDate: '22 Aug 2026',
    customerName: 'Lars Haugen',
    customerEmail: 'lars@example.com',
    customerCountry: 'Norway',
    currency: 'NOK',
    bookingRef: 'BKG-8200',
    paymentMethod: 'Vipps / Card',
    paymentGatewayRef: 'pay_Nz8200B',
    status: 'PAID',
    subtotal: 1071.43,
    vatStandard: 0,
    vatReduced: 128.57,
    totalAmount: 1200,
    items: [
      { description: 'Scenic Mountain Cabin Night', category: 'ACCOMMODATION', quantity: 1, unitPrice: 1071.43, taxRatePct: 12, total: 1071.43 }
    ]
  },
  {
    invoiceNumber: 'NSL-2026-8199',
    invoiceDate: '21 Aug 2026',
    dueDate: '21 Aug 2026',
    customerName: 'Freja Olsen',
    customerEmail: 'freja@example.com',
    customerCountry: 'Norway',
    currency: 'NOK',
    bookingRef: 'BKG-8199',
    paymentMethod: 'Card Checkout',
    paymentGatewayRef: 'pay_Nz8199C',
    status: 'REFUNDED',
    subtotal: 7120,
    vatStandard: 1780,
    vatReduced: 0,
    totalAmount: 8900,
    items: [
      { description: 'Aurora Northern Lights Expedition', category: 'ACTIVITY', quantity: 4, unitPrice: 1780, taxRatePct: 25, total: 7120 }
    ]
  }
];

export const AdminPayments = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const dbInvoices = await invoiceService.fetchInvoices();
      if (dbInvoices.length > 0) {
        setInvoices(dbInvoices);
      } else {
        setInvoices(FALLBACK_PAYMENTS);
      }
    } catch (err) {
      console.warn('Failed to load DB invoices:', err);
      setInvoices(FALLBACK_PAYMENTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.bookingRef && inv.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      inv.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const totalVolume = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, inv) => acc + inv.totalAmount, 0);

  const exportCSV = () => {
    const headers = ['Invoice Number', 'Date', 'Customer', 'Email', 'Amount (NOK)', 'Status', 'Gateway Ref', 'Booking Ref'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      inv.invoiceDate,
      `"${inv.customerName}"`,
      inv.customerEmail,
      inv.totalAmount,
      inv.status,
      inv.paymentGatewayRef || 'N/A',
      inv.bookingRef || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Norway_SmartLife_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="text-emerald-600" /> Payments & Universal Invoices
          </h1>
          <p className="text-slate-500 text-sm mt-1">Transaction logs, Skatteetaten MVA compliance receipts, and financial reporting.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Settled Volume', val: `NOK ${totalVolume.toLocaleString('no-NO')}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Invoices', val: `${invoices.length} Issued`, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Paid Ratio', val: `${Math.round((invoices.filter(i => i.status === 'PAID').length / (invoices.length || 1)) * 100)}%`, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Refunds / Adj.', val: `${invoices.filter(i => i.status === 'REFUNDED').length} Orders`, icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{stat.val}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search invoice #, customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-slate-400 hidden sm:block" />
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
            {['ALL', 'PAID', 'REFUNDED', 'PENDING'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices & Transaction Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <FileText size={16} className="text-slate-500" />
            Transaction Invoices ({filteredInvoices.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Click Print to open Norwegian MVA tax invoice</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice Number</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Booking Ref</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold">Issued Date</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.invoiceNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{inv.customerName}</div>
                      <div className="text-xs text-slate-400">{inv.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-blue-600">
                      {inv.bookingRef || 'Direct Order'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      {inv.currency} {inv.totalAmount.toLocaleString('no-NO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1
                        ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : inv.status === 'REFUNDED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}
                      `}>
                        {inv.status === 'PAID' && <CheckCircle2 size={10} />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{inv.invoiceDate}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => invoiceService.openPrintableInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold transition-all border border-slate-200 hover:border-emerald-200"
                        title="View / Print Skatteetaten Tax Invoice"
                      >
                        <Printer size={13} /> Print Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
