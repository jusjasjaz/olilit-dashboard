import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'Dashboard',
    link: '/dashboard',
    icon: 'ri-home-4-line',
  },
  // {
  //   id: 3,
  //   label: 'KYC',
  //   link: '',
  //   icon: 'ri-group-line',
  // },
  {
    id: 4,
    label: 'Customers',
    link: '/customers-page',
    icon: 'ri-group-line',
  },
  {
    id: 5,
    label: 'Merchants',
    link: '/merchants-page',
    icon: 'ri-shopping-bag-3-line',
  },
  {
    id: 6,
    label: 'User Management',
    link: '/user-management',
    icon: 'ri-user-line',
  },

  {
    id: 7,
    label: 'Limit Configuration',
    link: '/limit-configuration',
    icon: 'ri-settings-2-line',
  },
  {
    id: 8,
    label: 'Fee Configuration',
    link: '/fee-configuration',
    icon: 'ri-settings-2-line',
  },
  {
    id: 9,
    label: 'Help Ticket',
    link: '/help-tickets',
    icon: 'ri-question-line',
  },
  {
    id: 10,
    label: 'Reports',
    link: '/reports',
    icon: 'ri-line-chart-line',
  },
  // {
  //   id: 6,
  //   label: 'Reports',
  //   link: '',
  //   icon: 'ri-account-circle-line',
  // },
  // {
  //   id: 7,
  //   label: 'Help Tickets',
  //   link: '',
  //   icon: 'ri-funds-fill',
  // },
];
