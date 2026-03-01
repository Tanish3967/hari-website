"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function BookAppointment() {
    const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // In a multi-doctor clinic, this would be selected by the user.
    // For the portfolio, we'll hardcode or assume the first doctor for now.
    const DOCTOR_ID = "daece02f-137c-4818-bc05-64383c3920b1"; // Doctor DB ID

    useEffect(() => {
        async function fetchSlots() {
            if (!date) return;

            setIsLoadingSlots(true);
            setError("");
            setSelectedSlot("");

            try {
                const response = await fetch(`/api/slots?date=${date}&doctorId=${DOCTOR_ID}`);
                if (!response.ok) throw new Error("Failed to fetch slots");

                const data = await response.json();
                setAvailableSlots(data.availableSlots || []);
            } catch (err) {
                console.error(err);
                setError("Could not load available times. Please try again.");
            } finally {
                setIsLoadingSlots(false);
            }
        }

        fetchSlots();
    }, [date]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedSlot) {
            setError("Please select a time slot");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const patientData = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            age: parseInt(formData.get("age") as string, 10),
            gender: formData.get("gender") as string,
        };

        const notes = formData.get("notes") as string;

        try {
            const supabase = createClient();

            // 1. Create or find patient
            // For simplicity, creating a new patient record here.
            // In production, we'd check if phone exists first.
            const { data: patient, error: patientError } = await supabase
                .from('patients')
                .insert([patientData])
                .select()
                .single();

            if (patientError) throw patientError;

            // 2. Book appointment (Database UNIQUE constraint handles race conditions)
            const { error: appointmentError } = await supabase
                .from('appointments')
                .insert([{
                    doctor_id: DOCTOR_ID,
                    patient_id: patient.id,
                    appointment_date: date,
                    appointment_time: `${selectedSlot}:00`, // Postgres expects HH:mm:ss
                    notes: notes,
                    status: 'pending'
                }]);

            if (appointmentError) {
                if (appointmentError.code === '23505') { // Unique violation
                    throw new Error("This slot was just booked by someone else. Please choose another time.");
                }
                throw appointmentError;
            }

            setSuccess(true);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred while booking. Please try again.");
            // Refresh slots if it was double booked
            if (err.message.includes("just booked")) {
                const response = await fetch(`/api/slots?date=${date}&doctorId=${DOCTOR_ID}`);
                if (response.ok) {
                    const data = await response.json();
                    setAvailableSlots(data.availableSlots || []);
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-lg text-center border border-slate-100 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
                        <p className="text-slate-600 mb-8 text-lg">
                            Your appointment has been successfully scheduled for <br />
                            <span className="font-bold text-slate-900">{format(new Date(date), "MMMM do, yyyy")}</span> at <span className="font-bold text-slate-900">{selectedSlot}</span>.
                        </p>
                        <Button className="w-full h-12 text-md" onClick={() => window.location.href = '/'}>
                            Return to Home
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    // Generate an array of the next 14 days for the date selector
    const next14Days = Array.from({ length: 14 }).map((_, i) => {
        const d = addDays(new Date(), i);
        return {
            value: format(d, "yyyy-MM-dd"),
            label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE, MMM do")
        };
    });

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-12 flex-1 max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Book Your Appointment</h1>
                    <p className="text-lg text-slate-600">Select a convenient time slot and fill in your details.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="grid md:grid-cols-5 h-full">

                        {/* Left Column: Date & Time Selection */}
                        <div className="md:col-span-2 bg-slate-50 p-6 md:p-8 border-r border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-6 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-3">1</span>
                                Select Date & Time
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <Label className="text-sm text-slate-500 mb-2 block">Available Dates</Label>
                                    <Select value={date} onValueChange={setDate}>
                                        <SelectTrigger className="w-full bg-white h-12">
                                            <SelectValue placeholder="Select a date" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {next14Days.map((d) => (
                                                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm text-slate-500 mb-3 block">
                                        Available Time Slots
                                        {isLoadingSlots && <Loader2 className="w-3 h-3 inline ml-2 animate-spin text-blue-600" />}
                                    </Label>

                                    <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {!isLoadingSlots && availableSlots.length === 0 ? (
                                            <div className="col-span-2 text-center py-8 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                                                No slots available for this date.<br />Please choose another.
                                            </div>
                                        ) : (
                                            availableSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => setSelectedSlot(time)}
                                                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${selectedSlot === time
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Patient Details */}
                        <div className="md:col-span-3 p-6 md:p-8">
                            <h3 className="font-semibold text-slate-900 mb-6 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-3">2</span>
                                Patient Details
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" required placeholder="John Doe" className="h-12 mt-1" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" name="phone" required type="tel" placeholder="123-456-7890" className="h-12 mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="age">Age</Label>
                                            <Input id="age" name="age" required type="number" min="0" max="120" placeholder="30" className="h-12 mt-1" />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select name="gender" required defaultValue="prefer_not_to_say">
                                            <SelectTrigger className="w-full h-12 mt-1">
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

                                    <div>
                                        <Label htmlFor="notes">Problem Description (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            name="notes"
                                            placeholder="Briefly describe your symptoms or reason for visit"
                                            className="mt-1 resize-none"
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start">
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !selectedSlot}
                                    className="w-full h-14 text-md bg-blue-600 hover:bg-blue-700 mt-8"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Confirming Booking...</>
                                    ) : (
                                        `Confirm Appointment for ${selectedSlot ? selectedSlot : '...'}`
                                    )}
                                </Button>

                                <p className="text-xs text-center text-slate-500 mt-4">
                                    By booking, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
