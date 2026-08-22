// @ts-nocheck
import { supabase } from '../../lib/supabase';

export interface AdminPermissions {
  [resource: string]: {
    [action: string]: boolean;
  };
}

export const adminService = {
  async getUserPermissions(userId: string, appRole: string): Promise<AdminPermissions> {
    const permissions: AdminPermissions = {};

    // For now, if you are SUPER_ADMIN or ADMIN, we just give you all standard admin permissions
    // from the admin_permissions table, to replace the broken user_admin_groups architecture.
    if (appRole === 'SUPER_ADMIN' || appRole === 'ADMIN') {
      const { data } = await supabase.from('admin_permissions').select('resource, action');
      if (data) {
        data.forEach((p) => {
          if (!permissions[p.resource]) permissions[p.resource] = {};
          permissions[p.resource][p.action] = true;
        });
      }
    }

    return permissions;
  }
};

