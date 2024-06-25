// import '@/styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import type { AppProps } from 'next/app'
import '@shopify/polaris/build/esm/styles.css';
import en from "@shopify/polaris/locales/en.json";
import '@/styles/table.css';
import styles from '@/Components/styles.button.css';

import { HomeMinor, OrdersMinor, ProductsMinor } from '@shopify/polaris-icons';
import {
  AppProvider,
  Frame,
  Navigation
} from '@shopify/polaris';
import NavigationComponent from '@/Components/NavigationComponent';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const navigation = <NavigationComponent url={router.pathname} />
  const content = <Component {...pageProps} />
  return (
    <AppProvider i18n={en}>
      {/* {
        router.isReady && 
        <>
          {
            router.pathname === "/load" &&
            <Frame children={content}/>
            ||
            <Frame navigation={navigation} children={content}/>
          }
        </> 
      } */}
      <Frame navigation={navigation} children={content}/>
    </AppProvider>
  )
}
