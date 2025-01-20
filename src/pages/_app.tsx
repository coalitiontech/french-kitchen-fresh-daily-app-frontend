import type { AppProps } from 'next/app'
import '@shopify/polaris/build/esm/styles.css';
import en from "@shopify/polaris/locales/en.json";
import '@/styles/table.css';
import {
  AppProvider,
  Frame,
} from '@shopify/polaris';
import NavigationComponent from '@/Components/NavigationComponent';
import { useRouter } from 'next/router';
import {NavMenu} from '@shopify/app-bridge-react';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const navigation = <NavigationComponent url={router.pathname} />
  const content = <Component {...pageProps} />
  return (
    <AppProvider i18n={en}>
      {
        process.env.NEXT_PUBLIC_SHOPIFY_LOAD_APP_BRIDGE &&
        <NavMenu>
          <a href="/" rel="home">Home</a>
          <a href="/inventorySchedule">Inventory Schedule</a>
          <a href="/blackoutSettings">Blackout Settings</a>
          {/* <a href="/locations">Locations</a> */}
          {/* <a href="/settings">Settings</a> */}
          <a href="/scheduledOrders">Scheduled Orders</a>
          <a href="/scheduledProducts">Scheduled Products</a>
        </NavMenu>
      }
      {
        process.env.NEXT_PUBLIC_SHOPIFY_LOAD_APP_BRIDGE &&
        <Frame children={content}/>
        ||
        <Frame navigation={navigation} children={content}/>
      }
    </AppProvider>
  )
}