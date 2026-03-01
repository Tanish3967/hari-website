const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetchPatients() {
    console.log("Fetching list of registered Patients...");

    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching patients", error);
        return;
    }

    console.log(`✅ Successfully retrieved ${data.length} patients.`);
    console.log("Sample Data:");
    console.log(data);
}

testFetchPatients();
