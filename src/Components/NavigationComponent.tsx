import {Frame, Navigation} from '@shopify/polaris';
import {HomeMinor, CustomersMajor, FoodMajor, VocabularyMajor} from '@shopify/polaris-icons';
import React from 'react';

export default function NavigationComponent({url}) {
  
  return (
      <Navigation location={url}>
        <Navigation.Section
          items={[
            {
              url: '/locations',
              label: 'Locations',
              icon: VocabularyMajor,
              selected: (url.includes('/locations'))
            },
            {
              url: '/settings',
              label: 'Settings',
              icon: CustomersMajor,
              selected: (url.includes('/settings'))
            },
            {
              url: '/inventorySchedule',
              label: 'Inventory Schedule',
              icon: FoodMajor,
              selected: (url.includes('/inventorySchedule'))
            },
            {
              url: '/blackoutSettings',
              label: 'BlackoutSetting',
              icon: FoodMajor,
              selected: (url.includes('/blackoutSettings'))
            },
          ]}
        />
      </Navigation>
  );
}