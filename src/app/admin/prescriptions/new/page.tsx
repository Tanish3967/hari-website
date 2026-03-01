import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import PrescriptionClient from "./PrescriptionClient"

export const dynamic = 'force-dynamic'

export default function NewPrescriptionPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        }>
            <PrescriptionClient />
        </Suspense>
    )
}
