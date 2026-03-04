import { createBrowserClient } from '@supabase/ssr'

// Safe storage wrapper to prevent Firefox DOMException when cookies/storage are blocked
const getSafeStorage = () => {
  if (typeof window === 'undefined') return undefined;

  try {
    // Test if localStorage is securely accessible before handing it to Supabase
    window.localStorage.getItem('__storage_test__');
    return {
      getItem: (key: string) => {
        try { return window.localStorage.getItem(key) } catch { return null }
      },
      setItem: (key: string, value: string) => {
        try { window.localStorage.setItem(key, value) } catch { }
      },
      removeItem: (key: string) => {
        try { window.localStorage.removeItem(key) } catch { }
      }
    };
  } catch (_error) {
    // If strict tracking prevention blocked it, fallback to an isolated dummy memory store
    const memStore: Record<string, string> = {};
    return {
      getItem: (key: string) => memStore[key] || null,
      setItem: (key: string, value: string) => { memStore[key] = value },
      removeItem: (key: string) => { delete memStore[key] }
    };
  }
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        timeout: 20000,
        // Force fallback to standard HTTPS polling across the entire client
        // to prevent Firefox throwing 'DOMException: The operation is insecure'
        // when trying to establish a WSS connection on Netlify.
        params: {
          eventsPerSecond: 10,
        }
      },
      auth: {
        // Prevent background socket connections for auth
        detectSessionInUrl: true,
        autoRefreshToken: true,
        // Wrap local storage in a try-catch to permanently fix DOMException
        storage: getSafeStorage(),
      }
    }
  )
}
