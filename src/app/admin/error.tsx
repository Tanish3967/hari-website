"use client" // Error components must be Client Components

import { useEffect } from "react"
import { AlertCircle, RefreshCcw, ShieldAlert } from "lucide-react"

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Admin Layout Error Boundary caught:", error)
    }, [error])

    // Specific handler for the infamous Firefox 'The operation is insecure' DOMException
    const isFirefoxSecurityError = error.message?.includes("insecure") || error.name === "DOMException"

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
                {isFirefoxSecurityError ? (
                    <ShieldAlert className="w-10 h-10" />
                ) : (
                    <AlertCircle className="w-10 h-10" />
                )}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isFirefoxSecurityError ? "Strict Browser Privacy Detected" : "Something went wrong!"}
            </h2>

            <p className="text-slate-500 max-w-md mb-8">
                {isFirefoxSecurityError
                    ? "Your browser's strict tracking protection or privacy settings (like Firefox 'Enhanced Tracking Protection') blocked the dashboard from accessing local storage. Please disable tracking protection for this site to ensure full functionality."
                    : "An unexpected error occurred while loading this section of the dashboard."
                }
            </p>

            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm font-medium"
            >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try again
            </button>

            {/* Optional: Developer details in development only */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-12 p-4 bg-slate-50 rounded-xl text-left border border-slate-200 w-full max-w-2xl overflow-auto text-xs font-mono text-slate-600">
                    <p className="font-bold mb-1 text-slate-800">Error Details:</p>
                    {error.message}
                    {error.stack && <pre className="mt-2 text-[10px]">{error.stack}</pre>}
                </div>
            )}
        </div>
    )
}
