import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Download, CheckCircle2, ArrowLeft, Search, Calendar, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { invoiceService, InvoiceData } from '../../services/invoice/invoiceService';

export const Invoices = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { formatPrice } = useCurrencyStore();
  const { profile } = useAuthStore();

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch bookings to derive all invoices
      const { data: bookingsData, error: dbError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      if (bookingsData && bookingsData.length > 0) {
        const generatedInvoices = bookingsData.map(b => invoiceService.createInvoiceFromBooking(b, profile));
        setInvoices(generatedInvoices);
      } else {
        setInvoices([]);
      }
    } catch (err: any) {
      console.error('Failed to load invoices:', err);
      setError(err?.message || 'Unable to retrieve your invoice records. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate, profile]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.items.some(item => item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpent = invoices.reduce((sum, inv) => sum + (inv.status === 'PAID' ? inv.totalAmount : 0), 0);
  const totalTax = invoices.reduce((sum, inv) => sum + (inv.status === 'PAID' ? (inv.vatStandard + inv.vatReduced) : 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#E2E8F0] border-t-navy-900 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Tax Invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-6 flex justify-center items-center">
        <div className="bg-white border border-red-200 rounded-3xl p-10 max-w-lg w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">Failed to Load Invoices</h2>
          <p className="text-gray-600 text-xs mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => fetchInvoices()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-navy-900 font-sans pb-24">
      {/* Header */}
      <div className="bg-navy-900 text-white pt-32 pb-20 px-6 md:px-12 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/10 to-transparent mix-blend-overlay"></div>
        <div className="relative max-w-[1440px] mx-auto z-10">
          <button 
            onClick={() => navigate('/user/bookings')} 
            className="text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-bold flex items-center gap-2 mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Travel Wallet
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <span className="text-aurora-green font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-3">
                <FileText size={16} /> Norwegian Tax Compliance
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-black mb-3">Invoices & Receipts</h1>
              <p className="text-white/80 max-w-xl text-base">
                View, manage, and download official MVA tax invoices for your bookings and travels across Norway.
              </p>
            </div>

            {/* Metrics */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl min-w-[140px]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Total Invoiced</div>
                <div className="text-2xl font-display font-black text-aurora-green">{formatPrice(totalSpent)}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl min-w-[140px]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">MVA / VAT Paid</div>
                <div className="text-2xl font-display font-black text-white">{formatPrice(totalTax)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice # or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Compliant with *Skatteetaten* Norwegian Tax Rules (Org. nr 984 123 456 MVA)
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FileText size={28} />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">No Invoices Found</h2>
            <p className="text-gray-500 text-sm mb-6">
              When you make a booking or checkout on Norway SmartLife, official tax receipts will be accessible here.
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-3 bg-navy-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-aurora-green hover:text-navy-900 transition-colors"
            >
              Explore Experiences
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Invoice #</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Service & Description</th>
                      <th className="py-4 px-6">MVA / VAT</th>
                      <th className="py-4 px-6 text-right">Total Amount</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.invoiceNumber} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-navy-900 font-mono">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-4 px-6 text-gray-500 flex items-center gap-1.5 pt-5">
                          <Calendar size={13} className="text-gray-400" />
                          {inv.invoiceDate}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-navy-900">{inv.items[0]?.description || 'Experience Booking'}</div>
                          <div className="text-[11px] text-gray-400">{inv.items[0]?.category}</div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {formatPrice(inv.vatStandard + inv.vatReduced)}
                        </td>
                        <td className="py-4 px-6 text-right font-black text-navy-900 text-sm font-display">
                          {formatPrice(inv.totalAmount)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 size={11} /> {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => invoiceService.openPrintableInvoice(inv)}
                            className="px-3.5 py-2 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-lg transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Download size={13} /> PDF / Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {filteredInvoices.map((inv) => (
                <div key={inv.invoiceNumber} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Invoice Number</span>
                      <span className="font-bold text-navy-900 font-mono text-sm">{inv.invoiceNumber}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={11} /> {inv.status}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <p className="font-semibold text-xs text-navy-900 mb-1">{inv.items[0]?.description || 'Experience Booking'}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Date: {inv.invoiceDate}</span>
                      <span>MVA: {formatPrice(inv.vatStandard + inv.vatReduced)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Amount</span>
                      <span className="text-base font-black text-navy-900 font-display">{formatPrice(inv.totalAmount)}</span>
                    </div>
                    <button
                      onClick={() => invoiceService.openPrintableInvoice(inv)}
                      className="px-4 py-2.5 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Download size={14} /> PDF / Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
