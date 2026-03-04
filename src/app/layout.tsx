import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SBK Healthcare Centre',
  description: 'Book your appointment today. Professional healthcare and clinic management.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                window.localStorage.getItem('__test');
                window.sessionStorage.getItem('__test');
              } catch (e) {
                // Firefox Tracking Protection DOMException override
                var memStr = {};
                var mockStorage = {
                  getItem: function(k) { return memStr[k] || null; },
                  setItem: function(k, v) { memStr[k] = v; },
                  removeItem: function(k) { delete memStr[k]; },
                  clear: function() { memStr = {}; },
                  key: function(i) { return Object.keys(memStr)[i] || null; },
                  get length() { return Object.keys(memStr).length; }
                };
                try { Object.defineProperty(window, 'localStorage', { value: mockStorage, writable: true }); } catch (err) {}
                try { Object.defineProperty(window, 'sessionStorage', { value: mockStorage, writable: true }); } catch (err) {}
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
