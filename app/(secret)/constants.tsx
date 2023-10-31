import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Home',
    path: '/simple',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  /*{
  {
    title: 'Projects',
    path: '/projects',
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'All', path: '/projects' },
      { title: 'Web Design', path: '/projects/web-design' },
      { title: 'Graphic Design', path: '/projects/graphic-design' },
    ],
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <Icon icon="lucide:mail" width="24" height="24" />,
  },*/
  {
    title: 'Settings',
    path: '/simple',
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Account', path: '/simple/settings/profile' },
      { title: 'Security', path: '/simple/settings/security' },
    ],
  },
  {
    title: 'User Mgmt',
    path: '/simple/user',
    icon: <Icon icon="lucide:user" width="24" height="24" />
  },
  {
    title: 'Help',
    path: '/simple/help',
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
];