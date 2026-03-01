"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, FileText, Download, Clock } from "lucide-react"

type Prescription = {
    id: string
    rx_id: string
    created_at: string
    diagnosis: string
    patient: {
        id: string
        name: string
        phone: string
    }
}

export default function PrescriptionsHistoryPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const supabase = createClient()
    const DOCTOR_ID = "daece02f-137c-4818-bc05-64383c3920b1"

    useEffect(() => {
        async function fetchHistory() {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('prescriptions')
                    .select(`
            id, rx_id, created_at, diagnosis,
            patient:patients (id, name, phone)
          `)
                    .eq('doctor_id', DOCTOR_ID)
                    .order('created_at', { ascending: false })

                if (error) throw error

                // Format patient nested join
                const formatted = data?.map(rx => ({
                    ...rx,
                    patient: Array.isArray(rx.patient) ? rx.patient[0] : rx.patient
                })) as Prescription[]

                setPrescriptions(formatted || [])
            } catch (err) {
                console.error("Error fetching prescriptions:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [])

    const filteredRx = prescriptions.filter(rx =>
        rx.rx_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.patient?.phone.includes(searchQuery)
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Prescription History</h1>
                    <p className="text-slate-500 mt-1">View past prescriptions and re-print documents.</p>
                </div>
                <Button
                    onClick={() => window.location.href = '/admin/patients'}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 shadow-md"
                >
                    <FileText className="w-5 h-5 mr-2" /> New Prescription
                </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search by Rx ID, Patient Name or Phone..."
                            className="pl-10 h-11 bg-white border-slate-200 rounded-xl w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        Records Found: {filteredRx.length}
                    </div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredRx.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        No prescriptions found matching your search.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                    <th className="p-4 font-semibold">Rx ID & Date</th>
                                    <th className="p-4 font-semibold">Patient</th>
                                    <th className="p-4 font-semibold hidden md:table-cell">Diagnosis</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRx.map((rx) => (
                                    <tr key={rx.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{rx.rx_id}</div>
                                            <div className="text-xs text-slate-500 flex items-center mt-1">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {format(new Date(rx.created_at), 'MMM dd, yyyy - hh:mm a')}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-800">{rx.patient?.name || 'Unknown Patient'}</div>
                                            <div className="text-sm text-slate-500">{rx.patient?.phone}</div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div className="text-slate-700 text-sm max-w-xs truncate">
                                                {rx.diagnosis || <span className="text-slate-400 italic">No diagnosis recorded</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg hover:bg-slate-100 disabled:opacity-50"
                                                title="Re-printing historical PDFs requires re-generation logic. (Not implemented in UI demo)"
                                                disabled
                                            >
                                                <Download className="w-4 h-4 mr-2" /> View PDF
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    )
}
