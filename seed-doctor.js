const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// MUST use service role key to bypass RLS and create users on the backend admin side
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function seedTestDoctor() {
    console.log("Seeding Test Doctor...");

    // 1. Create a User in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'testdoctor@clinic.com',
        password: 'password123',
        email_confirm: true
    });

    if (authError) {
        if (authError.message.includes('already registered')) {
            console.log("User already exists, skipping auth creation.");
        } else {
            console.error("Auth Error:", authError);
            return;
        }
    }

    // Get the auth user ID (either just created or already existing)
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const testUser = users.find(u => u.email === 'testdoctor@clinic.com');

    if (!testUser) {
        console.error("Could not find test user in Auth.");
        return;
    }

    // 2. Add doctor profile to public.doctors table
    const { data: docData, error: docError } = await supabase
        .from('doctors')
        .upsert({
            user_id: testUser.id,
            name: 'Dr. Test Smith',
            specialization: 'General Practice',
            phone: '555-010-2020'
        }, { onConflict: 'user_id' })
        .select()
        .single();

    if (docError) {
        console.error("DB Error creating doctor profile:", docError);
        return;
    }

    console.log("=========================================");
    console.log(`✅ Successfully seeded test doctor!`);
    console.log(`Doctor ID: ${docData.id}`);
    console.log("=========================================");
}

seedTestDoctor();
