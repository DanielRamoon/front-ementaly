import { SvgIconProps } from '@material-ui/core';
import React from 'react';

export interface ItemDTO {
  label: string;
  name: string;
  handler(): void;
  side?: 'right' | 'left';
  icon?: React.ReactElement<SvgIconProps>;
}

interface Props {
  items: Array<ItemDTO>;
  activeTab: string;
}

export const SubMenuDashboard: React.FC<Props> = ({
  children,
  items,
  activeTab,
}) => (
  <div className="mx-3 my-4 flex w-11/12 sm:mx-8 xl:w-8/12 flex-wrap">
    {items.map((item) => (
      <h6
        className={`  
          mr-8
          font-bold text-lg mx-1 cursor-pointer text-gray-500
          ${item.side === 'right' && 'justify-self-end ml-auto xl:pr-16'}  
          ${item.name === activeTab && 'text-primary'}`}
        onClick={item.handler}
        key={item.name}>
        {item?.icon}
        {item.label}
      </h6>
    ))}
    {children}
  </div>
);
