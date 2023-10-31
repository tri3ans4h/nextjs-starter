import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SecretContextProvider } from '@/context/secret-context'
import { cookies } from 'next/headers'
import { browserName, browserVersion, deviceDetect, deviceType, engineName, engineVersion, fullBrowserVersion, getUA, mobileModel, mobileVendor, osName, osVersion } from 'mobile-device-detect'
import { ClientCookiesProvider } from '@/providers/client-cookie-provider'
import ToastContainerWrapper from '@/components/wrapper/toast-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Boilerplate',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  // const auth = cookies().get('authorization')?.value

  return (
    <html lang="en">
      <body className={inter.className}>
        <SecretContextProvider>
          <ClientCookiesProvider value={cookies().getAll()}>
            {children}
          </ClientCookiesProvider>
        </SecretContextProvider>
        <ToastContainerWrapper />
      </body>
    </html>
  );
}
