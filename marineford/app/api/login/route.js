import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // 1. Get email and password from the request body
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        // 2. Initialize Supabase client using env variables
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // 3. Sign in with email + password
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        // 4. Return success with user info
        return NextResponse.json({ success: true, user: data.user });
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
