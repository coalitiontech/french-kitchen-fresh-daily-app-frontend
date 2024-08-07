import {Frame, Navigation} from '@shopify/polaris';
import { ProfileIcon, FoodIcon, BookOpenIcon} from '@shopify/polaris-icons';
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
              url: '/settings',
              label: 'Settings',
              icon: ProfileIcon,
              selected: (url.includes('/settings'))
            },
            {
              url: '/inventorySchedule',
              label: 'Inventory Schedule',
              icon: FoodIcon,
              selected: (url.includes('/inventorySchedule'))
            },
            {
              url: '/blackoutSettings',
              label: 'BlackoutSetting',
              icon: FoodIcon,
              selected: (url.includes('/blackoutSettings'))
            },
          ]}
        />
      </Navigation>
  );
}