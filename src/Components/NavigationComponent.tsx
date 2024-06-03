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
              url: '/inventory',
              label: 'Inventory',
              icon: FoodMajor,
              selected: (url.includes('/inventorySchedule'))
            },
            // {
            //   url: '/blackoutDate',
            //   label: 'blackoutDate',
            //   icon: FoodMajor,
            //   selected: (url.includes('/blackoutDateTime'))
            // },
          ]}
        />
      </Navigation>
  );
}