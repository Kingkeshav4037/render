import React from 'react';
import { RoleGuard } from './RoleGuard';

export const ProviderGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <RoleGuard allowedRoles={['PROVIDER', 'ADMIN', 'SUPER_ADMIN']} redirectPath="/home">
      {children}
    </RoleGuard>
  );
};
