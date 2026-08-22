import React from 'react';

export const HorizontalScroller = ({ children }: { children: React.ReactNode }) => (
  <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x gap-6">
    {children}
  </div>
);
