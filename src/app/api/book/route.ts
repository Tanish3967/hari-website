import { NextResponse } from 'next/server';

// Note: We create a custom admin client since we need to bypass RLS to book patients publicly
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, selectedSlot, DOCTOR_ID, patientData, notes } = body;

        if (!date || !selectedSlot || !patientData) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Initialize Supabase Admin Client to bypass RLS for inserting patient & appointment
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

        // 1. Create Patient
        const { data: patient, error: patientError } = await supabaseAdmin
            .from('patients')
            .insert([patientData])
            .select()
            .single();

        if (patientError) {
            console.error('Patient Insert Error:', patientError);
            return NextResponse.json({ error: 'Failed to register patient details' }, { status: 500 });
        }

        // 2. Book appointment (Database UNIQUE constraint handles race conditions)
        const { error: appointmentError } = await supabaseAdmin
            .from('appointments')
            .insert([{
                doctor_id: DOCTOR_ID,
                patient_id: patient.id,
                appointment_date: date,
                appointment_time: `${selectedSlot}:00`, // Postgres expects HH:mm:ss
                notes: notes || '',
                status: 'pending'
            }]);

        if (appointmentError) {
            if (appointmentError.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'This slot was just booked by someone else. Please choose another time.' }, { status: 409 });
            }
            console.error('Appointment Insert Error:', appointmentError);
            return NextResponse.json({ error: 'Failed to lock appointment slot' }, { status: 500 });
        }

        return NextResponse.json({ success: true, patientId: patient.id });

    } catch (error) {
        console.error('Booking API Error:', error);
        return NextResponse.json({ error: 'Internal server error processing booking' }, { status: 500 });
    }
}
