import { createClient } from '@/lib/supabase/server';
import { generateSlots } from '@/lib/utils/slots';
import { NextResponse } from 'next/server';
import { startOfDay, endOfDay, format } from 'date-fns';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const doctorId = searchParams.get('doctorId');

    if (!dateStr || !doctorId) {
        return NextResponse.json({ error: 'Missing date or doctorId' }, { status: 400 });
    }

    try {
        const supabase = await createClient();
        const date = new Date(dateStr);

        // Format date for postgres comparison
        const formattedDate = format(date, 'yyyy-MM-dd');

        // 1. Fetch booked appointments for the given date and doctor
        // Status should not be cancelled
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select('appointment_time')
            .eq('doctor_id', doctorId)
            .eq('appointment_date', formattedDate)
            .neq('status', 'cancelled');

        if (error) {
            console.error('Error fetching appointments:', error);
            return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
        }

        const bookedTimes = appointments.map((app: { appointment_time: string }) => {
            // Postgres time comes as "HH:mm:ss", we need "HH:mm"
            return app.appointment_time.substring(0, 5);
        });

        // 2. Doctor Schedule (In a real app, this might come from the DB)
        const MORN_START = '10:00';
        const MORN_END = '13:00';
        const EVE_START = '17:00'; // 5:00 PM
        const EVE_END = '20:00'; // 8:00 PM
        const INTERVAL = 15; // 15 mins

        // 3. Generate slots
        const morningSlots = generateSlots(MORN_START, MORN_END, INTERVAL, bookedTimes, date);
        const eveningSlots = generateSlots(EVE_START, EVE_END, INTERVAL, bookedTimes, date);

        // Filter to only return available slots
        const allAvailable = [...morningSlots, ...eveningSlots].filter(s => s.available);

        return NextResponse.json({
            date: formattedDate,
            availableSlots: allAvailable.map(s => s.time)
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
