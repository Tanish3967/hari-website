const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DOCTOR_ID = 'daece02f-137c-4818-bc05-64383c3920b1';
const PATIENT_ID = '6782110b-9472-466b-ba05-957647022a34'; // Patient A
const APPOINTMENT_ID = null; // Walk-in / unlinked

async function testPrescription() {
    console.log("Testing Walk-in E-Prescription Generation...");

    // 1. Insert Prescription header
    const { data: rxHeader, error: rxError } = await supabase
        .from('prescriptions')
        .insert({
            doctor_id: DOCTOR_ID,
            patient_id: PATIENT_ID,
            appointment_id: APPOINTMENT_ID,
            diagnosis: 'Acute Pharyngitis (Test)',
            treatment: 'Rest and fluids',
            pdf_url: null,
        })
        .select()
        .single();

    if (rxError) {
        console.error("Failed to generate prescription header:", rxError);
        return;
    }

    console.log(`✅ Prescription Created! ID: ${rxHeader.prescription_id} (Internal UUID: ${rxHeader.id})`);

    // 2. Insert Medicines attached to this RX
    const medicines = [
        {
            prescription_id: rxHeader.id,
            name: 'Amoxicillin 500mg',
            dosage: '1 tablet',
            instructions: 'After meals, three times a day for 5 days'
        },
        {
            prescription_id: rxHeader.id,
            name: 'Paracetamol 650mg',
            dosage: '1 tablet',
            instructions: 'As needed for fever/pain'
        }
    ];

    const { data: rxMeds, error: medsError } = await supabase
        .from('medicines')
        .insert(medicines)
        .select();

    if (medsError) {
        console.error("Failed to insert medicines:", medsError);
        return;
    }

    console.log(`✅ Attached ${rxMeds.length} medicines to ${rxHeader.prescription_id}`);

    // 3. Verify it's fetchable
    const { data: finalRx, error: fetchErr } = await supabase
        .from('prescriptions')
        .select('*, patients(name), medicines(*)')
        .eq('id', rxHeader.id)
        .single();

    if (fetchErr) {
        console.error("Failed to join and fetch RX data:", fetchErr);
    } else {
        console.log("\n--- Full Prescription Record ---");
        console.log(`Rx ID: ${finalRx.prescription_id}`);
        console.log(`Patient: ${finalRx.patients.name}`);
        console.log(`Diagnosis: ${finalRx.diagnosis}`);
        console.log(`Medicines:`);
        finalRx.medicines.forEach(m => {
            console.log(` - ${m.name} (${m.dosage}) : ${m.instructions}`);
        });
        console.log("--------------------------------");
    }
}

testPrescription();
