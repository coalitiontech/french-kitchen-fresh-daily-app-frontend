import {Frame, Navigation} from '@shopify/polaris';
import { ProfileIcon, BookOpenIcon, CalendarTimeIcon, CalendarIcon} from '@shopify/polaris-icons';
import React from 'react';

export default function NavigationComponent({url}) {
  
  return (
      <Navigation location={url}>
        <Navigation.Section
          items={[
            {
              url: '/locations',
              label: 'Locations',
              icon: BookOpenIcon,
              selected: (url.includes('/locations'))
            },
            {
              url: '/settings/1',
              label: 'Settings',
              icon: ProfileIcon,
              selected: (url.includes('/settings'))
            },
            {
              url: '/inventorySchedule',
              label: 'Inventory Schedule',
              icon: CalendarTimeIcon,
              selected: (url.includes('/inventorySchedule'))
            },
            {
              url: '/blackoutSettings',
              label: 'BlackoutSetting',
              icon: CalendarIcon,
              selected: (url.includes('/blackoutSettings'))
            },
            {
              url: '/scheduledOrders',
              label: 'Scheduled Orders',
              icon: CalendarIcon,
              selected: (url.includes('/scheduledOrders'))
            },
            {
              url: '/scheduledProducts',
              label: 'Scheduled Products',
              icon: CalendarIcon,
              selected: (url.includes('/scheduledProducts'))
            },
          ]}
        />
      </Navigation>
  );
}