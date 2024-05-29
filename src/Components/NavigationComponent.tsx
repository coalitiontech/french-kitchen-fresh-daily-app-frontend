import {Frame, Navigation} from '@shopify/polaris';
import {HomeMinor, CustomersMajor, FoodMajor, VocabularyMajor} from '@shopify/polaris-icons';
import React from 'react';

export default function NavigationComponent({url}) {
  
  return (
      <Navigation location={url}>
        <Navigation.Section
          items={[
            {
              url: '/recipes',
              label: 'Recipes',
              icon: VocabularyMajor,
              selected: (url.includes('/recipes'))
            },
            {
              url: '/authors',
              label: 'Authors',
              icon: CustomersMajor,
              selected: (url.includes('/authors'))
            },
            {
              url: '/ingredients',
              label: 'Ingredients',
              icon: FoodMajor,
              selected: (url.includes('/ingredients'))
            },
          ]}
        />
      </Navigation>
  );
}