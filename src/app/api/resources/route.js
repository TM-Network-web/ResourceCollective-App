import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const subject = searchParams.get("subject");

        let query = supabase
            .from("resources")
            .select("*")
            .order("created_at", { ascending: false });

        if (subject) {
            query = query.ilike("subject", `%${subject}%`);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        // 1. Create Supabase client using cookies
        const supabase = await createClient();

        // 2. Get authenticated user from cookie session
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        // 3. Read form data
        const formData = await request.formData();

        const title = formData.get("title");
        const subject = formData.get("subject");
        const description = formData.get("description");
        const isbn = formData.get("isbn");
        const file = formData.get("file");

        if (!title || !subject || !file || typeof file === "string") {
            return NextResponse.json(
                { success: false, error: "Title, subject and PDF file are required" },
                { status: 400 }
            );
        }

        // 4. Validate PDF
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { success: false, error: "Only PDF files are allowed" },
                { status: 400 }
            );
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: "File size must not exceed 10MB" },
                { status: 400 }
            );
        }

        // 5. Upload PDF to Supabase Storage
        const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `${user.id}/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
            .from("resources")
            .upload(filePath, file, {
                contentType: "application/pdf",
            });

        if (uploadError) {
            return NextResponse.json(
                { success: false, error: uploadError.message },
                { status: 500 }
            );
        }

        // 6. Insert resource into database
        const { data, error: insertError } = await supabase
            .from("resources")
            .insert({
                user_id: user.id,
                title,
                subject,
                description: description || null,
                isbn: isbn || null,
                file_path: filePath,
                file_name: file.name,
            })
            .select()
            .single();

        if (insertError) {
            await supabase.storage
                .from("resources")
                .remove([filePath]);

            return NextResponse.json(
                { success: false, error: insertError.message },
                { status: 500 }
            );
        }

        // 7. Generate download URL
        const { data: urlData } = supabase.storage
            .from("resources")
            .getPublicUrl(filePath);

        return NextResponse.json(
            {
                success: true,
                data: {
                    ...data,
                    file_url: urlData.publicUrl,
                    download_url: `${urlData.publicUrl}?download=${encodeURIComponent(file.name)}`,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}