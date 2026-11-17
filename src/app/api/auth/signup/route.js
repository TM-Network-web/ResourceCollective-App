import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { full_name, email, password } = await request.json();

        // Validate required fields
        if (!full_name || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Full name, email and password are required"
                },
                { status: 400 }
            );
        }

        // Validate password
        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Password must be at least 6 characters"
                },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name
                }
            }
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                        full_name: data.user.user_metadata.full_name
                    }
                }
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong"
            },
            { status: 500 }
        );
    }
}