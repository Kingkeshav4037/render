// @ts-nocheck
import { supabase } from '../../lib/supabase';
import type { EmergencyContact } from '../../types/profile';

function mapRow(row: any): EmergencyContact {
  return {
    id: row.id,
    name: row.name,
    relationship: row.relationship,
    phone: row.phone,
    alternatePhone: row.alternate_phone || undefined,
    email: row.email || undefined,
    country: row.country || undefined,
    isPrimary: row.is_primary || false,
  };
}

export const emergencyContactsService = {
  async getAll(userId: string): Promise<EmergencyContact[]> {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapRow);
  },

  async add(
    userId: string,
    contact: Omit<EmergencyContact, 'id' | 'isPrimary'>
  ): Promise<EmergencyContact> {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({
        user_id: userId,
        name: contact.name,
        relationship: contact.relationship || (null as any),
        phone: contact.phone,
        alternate_phone: contact.alternatePhone || null,
        email: contact.email || (null as any),
        country: contact.country || null,
        is_primary: false,
      })
      .select()
      .single();

    if (error) throw error;
    return mapRow(data);
  },

  async update(
    contactId: string,
    updates: Partial<Omit<EmergencyContact, 'id' | 'isPrimary'>>
  ): Promise<void> {
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.relationship !== undefined) dbUpdates.relationship = updates.relationship;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.alternatePhone !== undefined) dbUpdates.alternate_phone = updates.alternatePhone;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.country !== undefined) dbUpdates.country = updates.country;

    const { error } = await supabase
      .from('emergency_contacts')
      .update(dbUpdates as any)
      .eq('id', contactId);

    if (error) throw error;
  },

  async delete(contactId: string): Promise<void> {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId);

    if (error) throw error;
  },

  async setPrimary(contactId: string, userId: string): Promise<void> {
    // First, unset all existing primaries for this user
    const { error: resetError } = await supabase
      .from('emergency_contacts')
      .update({ is_primary: false } as any)
      .eq('user_id', userId);

    if (resetError) throw resetError;

    // Then set the chosen contact as primary
    const { error } = await supabase
      .from('emergency_contacts')
      .update({ is_primary: true } as any)
      .eq('id', contactId);

    if (error) throw error;
  },
};

