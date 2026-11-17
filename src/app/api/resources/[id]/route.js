import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("resources")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { success: false, error: "Resource not found" },
                { status: 404 }
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

export async function PUT(request, { params }) {
    try {
        // 1. Get authenticated user
        const supabase = await createClient();

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

        // 2. Get resource ID
        const { id } = await params;

        // 3. Check whether resource exists
        const { data: resource, error: fetchError } = await supabase
            .from("resources")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (fetchError) {
            return NextResponse.json(
                { success: false, error: fetchError.message },
                { status: 500 }
            );
        }

        if (!resource) {
            return NextResponse.json(
                { success: false, error: "Resource not found" },
                { status: 404 }
            );
        }

        // 4. Check ownership
        if (resource.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: "You cannot update this resource" },
                { status: 403 }
            );
        }

        // 5. Read updated details
        const body = await request.json();

        const allowedFields = ["title", "subject", "description", "isbn"];
        const updateData = {};

        for (const field of allowedFields) {
            if (Object.hasOwn(body, field)) {
                updateData[field] = body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, error: "No valid fields provided for update" },
                { status: 400 }
            );
        }

        if (
            ("title" in updateData &&
                (typeof updateData.title !== "string" || !updateData.title.trim())) ||
            ("subject" in updateData &&
                (typeof updateData.subject !== "string" || !updateData.subject.trim()))
        ) {
            return NextResponse.json(
                { success: false, error: "Title and subject cannot be empty" },
                { status: 400 }
            );
        }

        // 6. Update resource
        const { data, error: updateError } = await supabase
            .from("resources")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json(
                { success: false, error: updateError.message },
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

export async function DELETE(request, { params }) {
    try {
        // 1. Get authenticated user
        const supabase = await createClient();

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

        // 2. Get resource ID
        const { id } = await params;

        // 3. Find resource
        const { data: resource, error: fetchError } = await supabase
            .from("resources")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (fetchError) {
            return NextResponse.json(
                { success: false, error: fetchError.message },
                { status: 500 }
            );
        }

        if (!resource) {
            return NextResponse.json(
                { success: false, error: "Resource not found" },
                { status: 404 }
            );
        }

        // 4. Check ownership
        if (resource.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: "You cannot delete this resource" },
                { status: 403 }
            );
        }

        // 5. Delete PDF from Storage
        const { error: storageError } = await supabase.storage
            .from("resources")
            .remove([resource.file_path]);

        if (storageError) {
            return NextResponse.json(
                { success: false, error: storageError.message },
                { status: 500 }
            );
        }

        // 6. Delete database record
        const { error: deleteError } = await supabase
            .from("resources")
            .delete()
            .eq("id", id);

        if (deleteError) {
            return NextResponse.json(
                { success: false, error: deleteError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                message: "Resource deleted successfully",
            },
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}