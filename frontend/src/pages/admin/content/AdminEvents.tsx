import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Event } from '../../../services/eventService';
import { Plus, Trash, Edit, Calendar } from 'lucide-react';

export const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('start_date', { ascending: true });
    setEvents((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Add Event
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Event</th>
                <th className="p-4 font-semibold text-gray-600">Category</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Ticket Price</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium">{event.name}</td>
                  <td className="p-4">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                      {event.category}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(event.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-4">NOK {event.ticket_price}</td>
                  <td className="p-4 flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-navy-900"><Edit size={18} /></button>
                    <button onClick={() => deleteEvent(event.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash size={18} /></button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
