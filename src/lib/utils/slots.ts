// src/lib/utils/slots.ts
import { addMinutes, format, parse, isBefore, isSameDay } from 'date-fns';

export interface TimeSlot {
    time: string;
    available: boolean;
}

/**
 * Generates an array of time slots based on the doctor's schedule.
 * Example: generateSlots('10:00', '13:00', 15) -> ['10:00', '10:15', '10:30', ...]
 */
export function generateSlots(
    startTimeStr: string,
    endTimeStr: string,
    intervalMinutes: number,
    bookedTimes: string[] = [],
    selectedDate: Date = new Date()
): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const now = new Date();

    // Parse the start and end times
    let currentTime = parse(startTimeStr, 'HH:mm', selectedDate);
    const endTime = parse(endTimeStr, 'HH:mm', selectedDate);

    const isToday = isSameDay(selectedDate, now);

    while (isBefore(currentTime, endTime)) {
        const formattedTime = format(currentTime, 'HH:mm');

        // If the selected date is today, disable slots that have already passed
        const hasPassed = isToday && isBefore(currentTime, now);

        // Check if the slot is in the booked array
        const isBooked = bookedTimes.includes(formattedTime);

        slots.push({
            time: formattedTime,
            available: !isBooked && !hasPassed
        });

        // Increment time by the specified interval
        currentTime = addMinutes(currentTime, intervalMinutes);
    }

    return slots;
}
