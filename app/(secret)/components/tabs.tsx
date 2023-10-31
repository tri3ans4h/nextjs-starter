'use client';

import React, { useState } from 'react';

import { useTabs } from '@/hooks/use-tabs';
import { Framer } from '@/lib/framer';
import Activity from './tabs/activity';
import Domains from './tabs/domains';
import Integrations from './tabs/integrations';
import Overview from './tabs/overviews';

const Tabs = () => {
  const [hookProps] = useState({
    tabs: [
      {
        label: 'Overview',
        children: <Overview />,
        id: 'Overview',
      },
      {
        label: 'Integrations',
        children: <Integrations />,
        id: 'Integrations',
      },
      {
        label: 'Activity',
        children: <Activity />,
        id: 'Activity',
      },
      {
        label: 'Domains',
        children: <Domains />,
        id: 'Domains',
      },
    ],
    initialTabId: 'Matches',
  });
  const framer = useTabs(hookProps);
//  <div className="border-b w-full items-start flex border-zinc-700 bg-zinc-950 px-8 pt-16">
    
  return (
    <div className="w-full flex flex-col">
      <div className="border-none w-full items-start flex border-white-700 bg-white-950 px-4 pt-4  ">
        <Framer.Tabs {...framer.tabProps} />
      </div>

      <div className="pt-2">{framer.selectedTab.children}</div>
    </div>
  );
};

export default Tabs;