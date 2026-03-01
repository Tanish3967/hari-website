const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const DOCTOR_ID = 'daece02f-137c-4818-bc05-64383c3920b1';
const TEST_DATE = '2026-03-01';
const TEST_TIME = '10:00';

async function testRaceCondition() {
    console.log(`Testing concurrent booking for slot: ${TEST_DATE} at ${TEST_TIME}`);

    // Create 3 dummy patients
    const patients = [
        { name: 'Patient A', phone: '111', age: 20, gender: 'male' },
        { name: 'Patient B', phone: '222', age: 30, gender: 'female' },
        { name: 'Patient C', phone: '333', age: 40, gender: 'male' }
    ];

    // Insert patients first
    const { data: insertedPatients, error: pError } = await supabase
        .from('patients')
        .insert(patients)
        .select();

    if (pError) {
        console.error("Failed to insert dummy patients", pError);
        return;
    }

    console.log("Created 3 dummy patients:");
    console.log(insertedPatients.map(p => p.id));

    // Now, attempt to book the EXACT SAME slot at the EXACT SAME time concurrently
    console.log("\nAttempting concurrent booking...");
    const bookingPromises = insertedPatients.map(patient => {
        return supabase
            .from('appointments')
            .insert({
                doctor_id: DOCTOR_ID,
                patient_id: patient.id,
                appointment_date: TEST_DATE,
                appointment_time: TEST_TIME,
                status: 'pending'
            });
    });

    const results = await Promise.allSettled(bookingPromises);

    let successes = 0;
    let failures = 0;

    results.forEach((result, idx) => {
        if (result.status === 'fulfilled' && !result.value.error) {
            console.log(`Patient ${idx} (Phone: ${insertedPatients[idx].phone}) SUCCESS`);
            successes++;
        } else {
            const err = result.value ? result.value.error : result.reason;
            console.log(`Patient ${idx} (Phone: ${insertedPatients[idx].phone}) FAILD: ${err.message || 'Error'}`);
            failures++;
        }
    });

    console.log("\n--- Race Condition Test Results ---");
    console.log(`Total Attempts: 3`);
    console.log(`Successful Bookings: ${successes}`);
    console.log(`Rejected by Database Constraints: ${failures}`);

    if (successes === 1 && failures === 2) {
        console.log("\n✅ TEST PASSED: Database successfully prevented double booking.");
    } else {
        console.log("\n❌ TEST FAILED: Either multiple bookings went through, or all failed.");
    }
}

testRaceCondition();
