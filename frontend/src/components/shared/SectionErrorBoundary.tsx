import React from 'react';
import { RouteErrorBoundary } from '../layout/GlobalErrorBoundary';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
}

export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({ children, sectionName }) => {
  return (
    <RouteErrorBoundary groupName={sectionName || 'Section'}>
      {children}
    </RouteErrorBoundary>
  );
};
