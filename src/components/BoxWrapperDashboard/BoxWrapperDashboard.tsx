import React from 'react';

interface Props {
  moreClass?: string;
}

export const BoxWrapperDashboard: React.FC<Props> = ({
  children,
  moreClass,
}) => (
  <div
    className={`flex flex-col items-center xl:items-start xl:flex-row ${moreClass}`}>
    {children}
  </div>
);
