"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Loader2, FileText, CalendarPlus } from "lucide-react"

type Patient = {
    id: string
    name: string
    phone: string
    age: number
    gender: string
    created_at: string
}

export default function PatientsAdminPage() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddingWalkIn, setIsAddingWalkIn] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const supabase = createClient()
    const DOCTOR_ID = "daece02f-137c-4818-bc05-64383c3920b1"

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPatients(data || [])
        } catch (err) {
            console.error("Error fetching patients:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleWalkInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        setError("")
        setSuccess("")

        const formData = new FormData(e.currentTarget)
        const patientData = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            age: parseInt(formData.get("age") as string, 10),
            gender: formData.get("gender") as string,
        }

        try {
            // 1. Check if patient exists by phone
            let patientId: string;
            const { data: existingPatient } = await supabase
                .from('patients')
                .select('id')
                .eq('phone', patientData.phone)
                .single()

            if (existingPatient) {
                // Patient exists, update details
                const { error: updateError } = await supabase
                    .from('patients')
                    .update(patientData)
                    .eq('id', existingPatient.id)
                if (updateError) throw updateError
                patientId = existingPatient.id
            } else {
                // Create new patient
                const { data: newPatient, error: insertError } = await supabase
                    .from('patients')
                    .insert([patientData])
                    .select()
                    .single()
                if (insertError) throw insertError
                patientId = newPatient.id
            }

            // 2. Create walk-in appointment for today
            const today = new Date()
            // Create a dummy time mapping for walk-ins based on current time
            // This ensures they appear at the bottom/top of the day's schedule correctly
            // For a real app we might just set the status directly.
            const timeString = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:00`
            const dateString = today.toISOString().split('T')[0]

            const { error: appError } = await supabase
                .from('appointments')
                .insert([{
                    doctor_id: DOCTOR_ID,
                    patient_id: patientId,
                    appointment_date: dateString,
                    appointment_time: timeString,
                    status: 'pending',
                    notes: 'Walk-in'
                }])

            if (appError) {
                // Handle duplicate time constraint if triggered
                if (appError.code === '23505') {
                    // Slight delay hack for walk-in collision resolve
                    await supabase.from('appointments').insert([{
                        doctor_id: DOCTOR_ID,
                        patient_id: patientId,
                        appointment_date: dateString,
                        appointment_time: `${today.getHours().toString().padStart(2, '0')}:${(today.getMinutes() + 1).toString().padStart(2, '0')}:00`,
                        status: 'pending',
                        notes: 'Walk-in'
                    }])
                } else {
                    throw appError
                }
            }

            setSuccess("Walk-in patient registered successfully!")
            setIsAddingWalkIn(false)
            fetchPatients() // Refresh list

        } catch (err: any) {
            console.error(err)
            setError(err.message || "An error occurred registering the walk-in")
        } finally {
            setSubmitting(false)
        }
    }

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patients</h1>
                    <p className="text-slate-500 mt-1">Manage patient records and register walk-ins.</p>
                </div>
                <Button
                    onClick={() => setIsAddingWalkIn(!isAddingWalkIn)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-md"
                >
                    {isAddingWalkIn ? "Cancel" : <><Plus className="w-5 h-5 mr-2" /> Register Walk-in</>}
                </Button>
            </div>

            {isAddingWalkIn && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-200 animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <CalendarPlus className="w-5 h-5 mr-3 text-blue-600" />
                        New Walk-in Registration
                    </h2>

                    {error && <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{error}</div>}

                    <form onSubmit={handleWalkInSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" required placeholder="John Doe" className="h-11 bg-slate-50 border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number (Unique ID)</Label>
                                <Input id="phone" name="phone" required type="tel" placeholder="123-456-7890" className="h-11 bg-slate-50 border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" name="age" required type="number" min="0" max="120" placeholder="30" className="h-11 bg-slate-50 border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender" required defaultValue="prefer_not_to_say">
                                    <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => setIsAddingWalkIn(false)} className="mr-3 h-11 rounded-xl">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 w-32">
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm border border-emerald-100 flex items-center animate-in fade-in">
                    <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {success}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search by name or phone..."
                            className="pl-10 h-11 bg-white border-slate-200 rounded-xl w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        Total Records: {filteredPatients.length}
                    </div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No patients found matching your search criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Contact Info</th>
                                    <th className="p-4 font-semibold">Details</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900">{patient.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">ID: {patient.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-slate-700">{patient.phone}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{patient.age} yrs</span>
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{patient.gender.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                onClick={() => window.location.href = `/admin/prescriptions/new?patientId=${patient.id}`}
                                            >
                                                <FileText className="w-4 h-4 mr-2" /> Write Rx
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
