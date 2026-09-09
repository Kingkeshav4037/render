import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Event, getEventFallbackDescription } from '../../../services/eventService';
import { Plus, Trash, Edit, Calendar, X, Search } from 'lucide-react';
import { toast } from 'sonner';

export const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('start_date', { ascending: true });
    setEvents((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await fetchEvents();
    })();
  }, []);

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    toast.success('Event deleted successfully');
    fetchEvents();
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.name || !editingEvent?.description) {
      toast.error('Please provide both an event name and description');
      return;
    }

    const payload = {
      name: editingEvent.name,
      category: ((editingEvent.category || 'FESTIVAL').toUpperCase()) as "FESTIVAL" | "CONCERT" | "SPORTS" | "CULTURAL" | "SEASONAL",
      description: editingEvent.description,
      start_date: editingEvent.start_date || new Date().toISOString(),
      end_date: editingEvent.end_date || new Date(Date.now() + 86400000).toISOString(),
      ticket_price: Number(editingEvent.ticket_price) || 0,
      currency: 'NOK',
      image_url: editingEvent.image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200',
      status: 'PUBLISHED' as const
    };

    if (editingEvent.id) {
      await (supabase.from('events') as any).update(payload).eq('id', editingEvent.id);
      toast.success('Event updated successfully');
    } else {
      await (supabase.from('events') as any).insert([payload]);
      toast.success('Event created successfully');
    }

    setEditingEvent(null);
    fetchEvents();
  };

  const filtered = events.filter(e => 
    !searchTerm.trim() || 
    (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Events & Descriptions</h1>
          <p className="text-slate-500 text-sm">Create, edit, and ensure every public event has a comprehensive description.</p>
        </div>
        <button 
          onClick={() => setEditingEvent({
            name: '',
            category: 'Festival',
            description: '',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            ticket_price: 0
          })}
          className="bg-navy-900 hover:bg-navy-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search event name or description..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Event Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Ticket Price</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(event => {
                  const desc = event.description || getEventFallbackDescription(event.name, event.category);
                  return (
                    <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 whitespace-nowrap">{event.name}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                          {event.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs md:max-w-md truncate" title={desc}>
                        {desc}
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar size={13} className="text-slate-400" />
                          {new Date(event.start_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                        {event.ticket_price > 0 ? `NOK ${event.ticket_price}` : 'Free'}
                      </td>
                      <td className="p-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setEditingEvent(event)} 
                            className="p-2 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                            aria-label="Edit event"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => deleteEvent(event.id)} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete event"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">No events found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingEvent.id ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button 
                onClick={() => setEditingEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Event Name</label>
                <input 
                  type="text" 
                  required
                  value={editingEvent.name || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, name: e.target.value })}
                  placeholder="e.g. Bergen International Festival"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
                <select
                  value={editingEvent.category || 'Festival'}
                  onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Festival">Festival</option>
                  <option value="Concert">Concert</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Event Description (Required)</label>
                <textarea 
                  required
                  rows={4}
                  value={editingEvent.description || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Provide a detailed, captivating description of the event, activities, artists, and visitor highlights..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Ticket Price (NOK)</label>
                  <input 
                    type="number"
                    min="0"
                    value={editingEvent.ticket_price ?? 0}
                    onChange={e => setEditingEvent({ ...editingEvent, ticket_price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Image URL</label>
                  <input 
                    type="url"
                    value={editingEvent.image_url || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-md"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;

