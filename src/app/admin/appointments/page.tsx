"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { format, isToday, isFuture, isPast } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, Calendar, Clock, CheckCircle, XCircle, Filter } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Appointment = {
    id: string
    doctor_id: string
    patient_id: string
    appointment_date: string
    appointment_time: string
    status: 'pending' | 'completed' | 'cancelled'
    notes: string
    patient: {
        name: string
        phone: string
    }
}

export default function AppointmentsAdminPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "past">("today")
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all")

    const supabase = createClient()
    const DOCTOR_ID = "daece02f-137c-4818-bc05-64383c3920b1"

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('appointments')
                .select(`
          *,
          patient:patients (name, phone)
        `)
                .eq('doctor_id', DOCTOR_ID)
                .order('appointment_date', { ascending: false })
                .order('appointment_time', { ascending: false })

            if (error) throw error

            const formatted = data?.map(app => ({
                ...app,
                patient: Array.isArray(app.patient) ? app.patient[0] : app.patient
            })) as Appointment[]

            setAppointments(formatted || [])
        } catch (err) {
            console.error("Error fetching appointments:", err)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: string, newStatus: 'completed' | 'cancelled' | 'pending') => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
        } catch (err) {
            console.error(err)
        }
    }

    const filteredAppointments = appointments.filter(app => {
        // 1. Text Search filtering
        const matchesSearch =
            app.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.patient?.phone.includes(searchQuery) ||
            app.appointment_date.includes(searchQuery)

        // 2. Date filtering
        const appDate = new Date(`${app.appointment_date}T${app.appointment_time}`)
        let matchesDate = true
        if (filter === "today") matchesDate = isToday(appDate)
        if (filter === "upcoming") matchesDate = isFuture(appDate) && !isToday(appDate)
        if (filter === "past") matchesDate = isPast(appDate) && !isToday(appDate)

        // 3. Status filtering
        let matchesStatus = true
        if (statusFilter !== "all") matchesStatus = app.status === statusFilter

        return matchesSearch && matchesDate && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>
            case 'cancelled': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>
            default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Appointments</h1>
                    <p className="text-slate-500 mt-1">Manage and track your entire clinic schedule.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Filters Toolbar */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search by name, phone or date..."
                            className="pl-10 h-11 bg-white border-slate-200 rounded-xl w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                            <SelectTrigger className="w-full md:w-[160px] h-11 bg-white rounded-xl">
                                <SelectValue placeholder="Date Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Dates</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="past">Past</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                            <SelectTrigger className="w-full md:w-[160px] h-11 bg-white rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-slate-300" />
                        </div>
                        No appointments found matching these filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                    <th className="p-4 font-semibold">Date & Time</th>
                                    <th className="p-4 font-semibold">Patient</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold text-right">Quick Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((app) => (
                                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{format(new Date(app.appointment_date), 'MMM dd, yyyy')}</div>
                                            <div className="text-sm text-slate-500 flex items-center mt-1">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {app.appointment_time.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-800">{app.patient?.name || 'Unknown'}</div>
                                            <div className="text-sm text-slate-500">{app.patient?.phone}</div>
                                            {app.notes && (
                                                <div className="text-xs text-slate-400 mt-1 max-w-xs truncate italic">"{app.notes}"</div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            {app.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline" size="sm"
                                                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-8"
                                                        onClick={() => updateStatus(app.id, 'completed')}
                                                    >
                                                        Complete
                                                    </Button>
                                                    <Button
                                                        variant="outline" size="sm"
                                                        className="text-red-600 border-red-200 hover:bg-red-50 h-8"
                                                        onClick={() => updateStatus(app.id, 'cancelled')}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            )}
                                            {app.status !== 'pending' && (
                                                <span className="text-xs text-slate-400 italic">No actions available</span>
                                            )}
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
