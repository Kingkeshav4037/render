import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const SectionHeader = ({ title, subtitle, icon }: SectionHeaderProps) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      {icon && <div className="text-aurora-green">{icon}</div>}
      <h2 className="text-3xl font-bold text-navy-900">{title}</h2>
    </div>
    {subtitle && <p className="text-gray-500 max-w-2xl">{subtitle}</p>}
  </div>
);
